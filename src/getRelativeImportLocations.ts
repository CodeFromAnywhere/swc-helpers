import fs from "fs";
import path from "path";
import { notEmpty } from "edge-util";
import { SwcImport } from "./types/types.js";
export const getRelativeImportLocations = (
  imports: SwcImport[] | undefined,
) => {
  const locations = imports
    ?.filter((x) => !x.isAbsolute)
    .map((item) => {
      if (!item.absolutePath) {
        return;
      }
      const absoluteFolderPath = path.parse(item.absolutePath).dir;

      const absolutePathWithoutExtension = path.join(
        absoluteFolderPath,
        item.module,
      );

      const absolutePath = fs.existsSync(`${absolutePathWithoutExtension}.ts`)
        ? `${absolutePathWithoutExtension}.ts`
        : fs.existsSync(`${absolutePathWithoutExtension}.tsx`)
          ? `${absolutePathWithoutExtension}.tsx`
          : undefined;

      return { absolutePath, name: item.name };
    })
    .filter(notEmpty);

  return locations || [];
};
