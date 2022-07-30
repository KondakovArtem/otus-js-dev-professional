import {
  createWriteStream,
  existsSync,
  createReadStream,
  WriteStream,
} from "fs";
import { stat } from "fs/promises";
import { createInterface } from "readline";
import { rm, mkdir, writeFile } from "fs/promises";
import { dirname, resolve, parse } from "path";

export enum ESizes {
  size_100b = 100,
  size_100Kb = 1024 * 100,
  size_10Mb = 1024 * 1024 * 10,
  size_100Mb = 1024 * 1024 * 100,
}

export function getNumberFromRange(
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
) {
  return (Math.floor(Math.random() * (max - min)) + min).toString();
}

const writeToStream = ({
  chunk,
  fileStream,
  progress,
}: {
  chunk: Buffer;
  fileStream: WriteStream;
  progress?(value: number): void;
}) => {
  return new Promise<void>((writeResolve, reject) => {
    fileStream.write(chunk, (err) => {
      progress?.(fileStream.bytesWritten);
      if (err) {
        reject(err);
      } else {
        writeResolve();
      }
    });
  });
};

export async function generateFile({
  path,
  size = ESizes.size_100Mb,
  chunkSize = ESizes.size_100Kb,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  progress,
}: {
  path: string;
  size?: number;
  chunkSize?: number;
  min?: number;
  max?: number;
  progress?(props: { value: number; count: number }): void;
}) {
  return new Promise<void>(async (resolve) => {
    existsSync(path) && (await rm(path));
    await mkdir(dirname(path), { recursive: true });
    const fileStream = createWriteStream(path, {
      encoding: "utf-8",
      highWaterMark: chunkSize,
    });

    let count = 0;
    progress?.({ value: 0, count: 0 });

    fileStream.on("finish", () => {
      progress?.({ value: fileStream.bytesWritten, count });
      resolve(undefined);
    });

    while (fileStream.bytesWritten <= size) {
      let value = ""; //Buffer.from([]);
      while (
        value.length * 2 < chunkSize &&
        fileStream.bytesWritten + value.length * 2 <= size
      ) {
        value += `${getNumberFromRange(min, max)}\n`;
        count++;
      }
      await writeToStream({
        chunk: Buffer.from(value),
        fileStream,
        progress: (value) => progress?.({ value, count }),
      });
    }
    fileStream.close();
  });
}

async function writeChunkToFile(path: string, chunk: number[]) {
  if (!existsSync(dirname(path))) {
    await mkdir(dirname(path));
  }
  chunk.sort((a, b) => (a > b ? 1 : -1));
  return writeFile(path, chunk.join("\n"), { encoding: "utf-8" });
}

export async function splitAndSortFile({
  path,
  chunkSize = 100000,
  progress,
}: {
  path: string;
  chunkSize?: number;
  progress?(props: {
    bytesRead: number;
    bytesTotal: number;
    fileName: string;
  }): void;
}): Promise<string[]> {
  if (!existsSync(path)) {
    throw new Error(`Missing source file with path ${path}`);
  }
  const tmpFolder = resolve(dirname(path), parse(path).name);
  const bytesTotal = (await stat(path)).size;
  const readStream = createReadStream(path);
  const readLine = createInterface({ input: readStream });

  readLine;

  let idx = 1;
  let numberList: number[] = [];

  const res: string[] = [];

  for await (const line of readLine) {
    if (numberList.length <= chunkSize) {
      numberList.push(parseInt(line));
    } else {
      const fileName = `${idx}.part`;
      const filePath = resolve(tmpFolder, fileName);
      await writeChunkToFile(filePath, numberList);
      res.push(filePath);
      progress?.({
        bytesTotal,
        bytesRead: readStream.bytesRead,
        fileName,
      });
      numberList = [];
      idx++;
    }
  }
  if (numberList.length) {
    const fileName = `${idx}.part`;
    const filePath = resolve(tmpFolder, fileName);
    await writeChunkToFile(filePath, numberList);
    res.push(filePath);
    progress?.({
      bytesTotal,
      bytesRead: readStream.bytesRead,
      fileName,
    });
  }
  return res;
}

export async function mergeSortFiles({
  target,
  fileList,
  progress,
}: {
  fileList: string[];
  target: string;
  progress?(props: { value: number; total: number }): void;
}) {
  existsSync(target) && (await rm(target));
  const outputStream = createWriteStream(target);

  const total = (await Promise.all(fileList.map((file) => stat(file)))).reduce(
    (pre, { size }) => pre + size,
    0
  );

  const readStreamList = fileList.map((file) => createReadStream(file));
  const readLineList = readStreamList.map((input) => {
    const readLine = createInterface({ input });
    return {
      readLine,
      iter: readLine[Symbol.asyncIterator](),
    };
  });

  const readValues: (number | undefined)[] = await Promise.all(
    readLineList.map(async (readLine) => {
      const value = (await readLine.iter.next()).value;
      return typeof value === "string" ? parseInt(value) : undefined;
    })
  );

  debugger;

  let outputData: number[] = [];

  while (true) {
    const minData: { idx?: number; value?: number } = {};
    readValues.forEach((value, idx) => {
      if (value && (!minData.value || minData.value > value)) {
        Object.assign(minData, { value, idx });
      }
    });

    if (minData.idx != undefined && minData.value != undefined) {
      const { idx, value } = minData;
      const newValue = (await readLineList[idx].iter.next()).value;
      readValues[idx] =
        typeof newValue === "string" ? parseInt(newValue) : undefined;
      outputData.push(value);

      if (outputData.length >= 100000) {
        progress?.({
          total,
          value: readStreamList.reduce(
            (pre, { bytesRead }) => pre + bytesRead,
            0
          ),
        });
        await writeToStream({
          chunk: Buffer.from(outputData.join("\n")),
          fileStream: outputStream,
        });
        outputData = [];
      }
    } else {
      break;
    }
  }

  if (outputData.length) {
    await writeToStream({
      chunk: Buffer.from(outputData.join("\n")),
      fileStream: outputStream,
    });
    progress?.({
      total,
      value: readStreamList.reduce((pre, { bytesRead }) => pre + bytesRead, 0),
    });
  }
}
