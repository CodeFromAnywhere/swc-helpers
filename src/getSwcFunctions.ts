import { Declaration } from "@swc/core";
import { ExportDeclaration } from "@swc/core";
import { ModuleItem } from "@swc/core";
import { notEmpty } from "edge-util";
import { getIsArrowDeclaration } from "./getIsArrowDeclaration.js";
import { getSwcFunctionsFromDeclaration } from "./getSwcFunctionsFromDeclaration.js";
import { FileSpan, SwcFunction, SwcVariable } from "./types/types.js";
import { getIsModuleItemSwcFunction } from "./getIsModuleItemSwcFunction.js";
/**
Gets all swc functions
- get regular functions (exported or not) 
- get arrow functions (exported or not)

TODO:
- also get the config attached as part of the raw span
- along the same lines: ensure the config for models would be attached when getting all fsorm models

*/
export const getSwcFunctions = (
  swcModuleItems: ModuleItem[],
  absolutePath: string | undefined,
  projectRoot: string | undefined,
  fileSpan: FileSpan,
): SwcFunction[] => {
  const swcFunctions = swcModuleItems
    .map((item) => {
      if (getIsModuleItemSwcFunction(item)) {
        return getSwcFunctionsFromDeclaration(
          item,
          absolutePath,
          projectRoot,
          fileSpan,
        );
      }

      return undefined;
    })
    .filter(notEmpty)
    .flat();

  return swcFunctions;
};
