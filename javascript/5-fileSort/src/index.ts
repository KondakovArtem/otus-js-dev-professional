import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SingleBar } from "cli-progress";
import colors from "ansi-colors";

import {
  generateFile,
  getNumberFromRange,
  splitAndSortFile,
  ESizes,
  mergeSortFiles,
} from "./merge-sorting-file";

(async () => {
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)),
    `gen/file${getNumberFromRange(0, 100)}.txt`
  );

  const size = ESizes.size_100Mb;

  ///////////////////////
  const genFileBar = new SingleBar({
    format: `${colors.yellow("1. Generating file")}     | ${colors.cyan(
      "{bar}"
    )} | {percentage}% || {value}/{total} Bytes || Number count: {count}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });
  genFileBar.start(size, 0);
  await generateFile({
    path,
    size,
    progress: ({ value, count }) => genFileBar.update(value, { count }),
  });
  genFileBar.stop();
  console.log(colors.green(`File was generated ${path}`));
  ///////////////////////
  let splitFileBarStarted = false;
  const splitFileBar = new SingleBar({
    format: `${colors.yellow("2. Splitting file")}      | ${colors.cyan(
      "{bar}"
    )} | {percentage}% || {value}/{total} Bytes || Filename: {fileName}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });
  const fileList = await splitAndSortFile({
    path,
    progress: ({ bytesRead, fileName, bytesTotal }) => {
      if (!splitFileBarStarted) {
        splitFileBarStarted = true;
        splitFileBar.start(bytesTotal, 0, { fileName });
      } else {
        splitFileBar.update(bytesRead, { fileName });
      }
    },
  });
  splitFileBar.stop();
  console.log(colors.green(`File was splitted in \n ${dirname(fileList[0])}`));

  let mergeSortFilesBarStarted = false;
  const mergeSortFilesBar = new SingleBar({
    format: `${colors.yellow("3. Merging sort files")}  | ${colors.cyan(
      "{bar}"
    )} | {percentage}% || {value}/{total} Bytes`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });
  await mergeSortFiles({
    fileList,
    target: path,
    progress: ({ total, value }) => {
      if (!mergeSortFilesBarStarted) {
        mergeSortFilesBarStarted = true;
        mergeSortFilesBar.start(total, 0);
      } else {
        mergeSortFilesBar.update(value);
      }
    },
  });
  mergeSortFilesBar.stop();

  console.log(colors.green(`File was sorted \n ${path}`));
})();
