import { readdir } from "fs/promises";
import { resolve } from "path";

export interface FileTree {
  files: string[];
  dirs: string[];
}

interface DirentData {
  path: string;
  isDirectory: boolean;
}

async function getDirents(
  path: string,
  relative: string = ""
): Promise<DirentData[]> {
  const dirents = await readdir(resolve(path, relative), {
    withFileTypes: true,
  });
  const res = dirents.map(
    (dirent) =>
      ({
        path: [relative, dirent.name].filter((i) => i).join("/"),
        isDirectory: dirent.isDirectory(),
      } as DirentData)
  );
  for (let dirent of dirents) {
    if (dirent.isDirectory()) {
      res.push(
        ...(await getDirents(
          resolve(path),
          [relative, dirent.name].filter((i) => i).join("/")
        ))
      );
    }
  }
  return res;
}

export async function tree(path: string): Promise<FileTree> {
  return (await getDirents(path)).reduce(
    (pre, { path, isDirectory }) => {
      pre[isDirectory ? "dirs" : "files"].push(path);
      return pre;
    },
    {
      dirs: [],
      files: [],
    } as FileTree
  );
}
