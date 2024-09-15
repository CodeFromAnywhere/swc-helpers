import fs from "node:fs";
const fsPromises = fs.promises;
import { mapMany } from "edge-util";
import { getDifferenceString } from "./getDifferenceString.js";
import { diffLines } from "diff";
import { notEmpty } from "edge-util";
import { getTypescriptData } from "../getTypescriptData.js";
import { getGroupedImportsPerFile } from "./getGroupedImportsPerFile.js";
import { getNewSrc } from "./getNewSrc.js";
import { SwcImport } from "../types/types.js";
/**
Import re-generation: Useful function to map over imports and have them be edited in realtime.

# What it does

- For all imports in a file, take the raw
- Take the file string and replace all raw with empty string
- Now there are no more imports
- Recreate imports at the beginning of the file
- It works for all types of imports including default and namespaces

 */
export const regenerateImports = async (
  operations: { [key: string]: string },
  /**
   * Where are your typescript files? By default, takes projectRoot
   */
  basePath: string | string[] | undefined,
  /**
   * A function to change the imports (return null to delete the import)
   */
  map?: (
    item: SwcImport,
    index: number,
    imports: SwcImport[],
  ) => SwcImport | null,

  isDryrun?: boolean,
) => {
  const { imports } = await getTypescriptData({ basePath, operations });

  if (!imports) {
    console.log("No imports found");
    return;
  }

  const groupedImportsPerFile = getGroupedImportsPerFile(imports);

  // console.log(Object.keys(groupedImportsPerFile));
  const result = await mapMany(
    Object.keys(groupedImportsPerFile),
    async (absolutePath, index) => {
      const oldImports = groupedImportsPerFile[absolutePath];
      const newImports = map
        ? oldImports.map(map).filter(notEmpty)
        : oldImports;
      const src = await fsPromises.readFile(absolutePath, "utf8");
      const { prettierError, newSrc } = await getNewSrc(
        src,
        oldImports,
        newImports,
      );
      const isDifferent = src !== newSrc;
      const isLongEnough = !!newSrc && newSrc.length > src.length * 0.5;
      const needsUpdate = isDifferent && isLongEnough;

      if (!isDryrun && needsUpdate) {
        await fsPromises.writeFile(absolutePath, newSrc, "utf8");
      }

      if (prettierError) {
        console.log(prettierError, { type: "error" });
        console.log(absolutePath);
      }

      const changes =
        isDifferent && newSrc ? diffLines(src, newSrc) : undefined;
      const difference = getDifferenceString(changes);
      return {
        absolutePath,
        needsUpdate,
        difference,
      };
    },
    10,
  );

  return result;
};
