import { Declaration } from "@swc/core";
import { ExportDeclaration } from "@swc/core";
import { VariableDeclarator } from "@swc/core";
import { makeRelative } from "edge-util";
import { getRealSpan } from "./getRealSpan.js";
import { FileSpan, SwcFunction } from "./types/types.js";
export const getSwcFunctionFromVariableDeclarator = (
  item: Declaration | ExportDeclaration,
  variableDeclarator: VariableDeclarator,
  fileSpan: FileSpan,
  absolutePath: string | undefined,
  projectRoot: string | undefined,
) => {
  const name =
    variableDeclarator.id.type === "Identifier"
      ? variableDeclarator.id.value
      : undefined;
  if (!name) {
    return;
  }

  if (variableDeclarator.init?.type !== "ArrowFunctionExpression") {
    return;
  }

  //  console.log(x.span);
  const { start, end, relevantCode } = getRealSpan(item.span, fileSpan);

  const swcFunction: SwcFunction = {
    modelName: "SwcFunction",
    name,
    start,
    end,
    length: end - start,
    raw: relevantCode,
    absolutePath,
    projectRelativePath:
      absolutePath && projectRoot
        ? makeRelative(absolutePath, projectRoot)
        : undefined,
    isExported: item.type === "ExportDeclaration",
  };

  return swcFunction;
};
