import fs from "fs";
import path from "node:path";
import { getProjectRoot } from "edge-util";
import { makeArray } from "edge-util";
import { notEmpty } from "edge-util";
import { getFolderTypescriptFiles } from "edge-util";
/**
 * Finds all typescript files in the provided basePath(s). If undefined, uses projectRoot. You can also provide specific files as part of the basePath
 */
export const findTypescriptFiles = async (
  operations: { [key: string]: string },
  absoluteFileOrFolderPaths: string | string[] | undefined,
) => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    return [];
  }

  const basePath = absoluteFileOrFolderPaths
    ? makeArray(absoluteFileOrFolderPaths)
    : Object.values(operations).map((p) => path.join(projectRoot, p));

  const typescriptFiles = (
    await Promise.all(
      basePath.map(async (absoluteFileOrFolderPath) => {
        if (!fs.existsSync(absoluteFileOrFolderPath)) return;

        // folders
        if ((await fs.stat(absoluteFileOrFolderPath)).isDirectory()) {
          return (
            await getFolderTypescriptFiles(absoluteFileOrFolderPath, false)
          ).map((x) => x.path);
        }
        // files
        return [absoluteFileOrFolderPath];
      }),
    )
  )
    .filter(notEmpty)
    .flat()
    .filter((x) => !x.endsWith(".d.ts"));

  return typescriptFiles;
};
