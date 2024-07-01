import { SwcImport } from "../types/index.js";

export const fileGetContentWithoutImports = (
  content: string,
  importsThisFile: SwcImport[],
) => {
  // console.log({ raws: importsThisFile.map((x) => x.raw) });
  const contentWithoutImports = importsThisFile.reduce(
    (previousContent, currentImport) => {
      return previousContent.replaceAll(currentImport.raw, "");
    },
    content,
  );

  return contentWithoutImports.trim().concat("\n");
};
