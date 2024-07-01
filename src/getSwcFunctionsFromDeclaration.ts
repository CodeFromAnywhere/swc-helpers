import { Declaration } from "@swc/core";
import { ExportDeclaration } from "@swc/core";
import { notEmpty } from "from-anywhere";
import { getSwcFunctionFromFunctionDeclaration } from "./getSwcFunctionFromFunctionDeclaration.js";
import { getIsArrowDeclaration } from "./getIsArrowDeclaration.js";
import { getSwcFunctionFromVariableDeclarator } from "./getSwcFunctionFromVariableDeclarator.js";
import { FileSpan } from "./types/types.js";
/**
Detects and finds SwcFunctions in regular and arrow functions, exported or not
 */
export const getSwcFunctionsFromDeclaration = (
  item: Declaration | ExportDeclaration,
  absolutePath: string | undefined,
  projectRoot: string | undefined,
  fileSpan: FileSpan,
) => {
  if (
    item.type === "FunctionDeclaration" ||
    (item.type === "ExportDeclaration" &&
      item.declaration.type === "FunctionDeclaration")
  ) {
    return getSwcFunctionFromFunctionDeclaration(
      item,
      absolutePath,
      projectRoot,
      fileSpan,
    );
  }

  if (
    item.type === "ExportDeclaration" &&
    getIsArrowDeclaration(item.declaration)
  ) {
    const swcFunctions = item.declaration.declarations
      .map((declarator) =>
        getSwcFunctionFromVariableDeclarator(
          item,
          declarator,
          fileSpan,
          absolutePath,
          projectRoot,
        ),
      )
      .filter(notEmpty);

    return swcFunctions;
  }

  if (getIsArrowDeclaration(item)) {
    const swcFunctions = item.declarations
      .map((declarator) =>
        getSwcFunctionFromVariableDeclarator(
          item,
          declarator,
          fileSpan,
          absolutePath,
          projectRoot,
        ),
      )
      .filter(notEmpty);
    return swcFunctions;
  }
};
