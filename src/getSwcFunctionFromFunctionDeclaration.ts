import { ExportDeclaration } from "@swc/core";
import { FunctionDeclaration } from "@swc/core";
import { makeRelative } from "edge-util";
import { getRealSpan } from "./getRealSpan.js";
import { FileSpan, SwcFunction } from "./types/types.js";
export const getSwcFunctionFromFunctionDeclaration = (
  item: ExportDeclaration | FunctionDeclaration,
  absolutePath: string | undefined,
  projectRoot: string | undefined,
  fileSpan: FileSpan,
) => {
  const functionDeclaration =
    item.type === "ExportDeclaration"
      ? (item.declaration as FunctionDeclaration)
      : item;

  const name =
    functionDeclaration.identifier.type === "Identifier"
      ? functionDeclaration.identifier.value
      : undefined;

  if (!name) {
    return;
  }

  //  console.log(x.span);
  const { start, end, relevantCode } = getRealSpan(item.span, fileSpan);
  const rawBodyCode = functionDeclaration.body?.span
    ? getRealSpan(functionDeclaration.body.span, fileSpan)?.relevantCode
    : undefined;

  const swcFunction: SwcFunction = {
    modelName: "SwcFunction",
    name,
    start,
    end,
    length: end - start,
    raw: relevantCode,
    rawBodyCode,
    absolutePath,
    projectRelativePath:
      absolutePath && projectRoot
        ? makeRelative(absolutePath, projectRoot)
        : undefined,
    isExported: item.type === "ExportDeclaration",
  };

  return swcFunction;
};
