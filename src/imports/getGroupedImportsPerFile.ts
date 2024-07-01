/**
group imports per file
 */

import { SwcImport } from "../types/index.js";

export const getGroupedImportsPerFile = (imports: SwcImport[]) => {
  const groupedImportsPerFile: { [absolutePath: string]: SwcImport[] } = {};

  imports.map((item) => {
    if (!item.absolutePath) {
      return;
    }
    if (!groupedImportsPerFile[item.absolutePath]) {
      groupedImportsPerFile[item.absolutePath] = [];
    }
    groupedImportsPerFile[item.absolutePath].push(item);
  });

  return groupedImportsPerFile;
};
