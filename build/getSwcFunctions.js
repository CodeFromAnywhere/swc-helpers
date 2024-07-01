import { notEmpty } from "from-anywhere";
import { getSwcFunctionsFromDeclaration } from "./getSwcFunctionsFromDeclaration.js";
import { getIsModuleItemSwcFunction } from "./getIsModuleItemSwcFunction.js";
/**
Gets all swc functions
- get regular functions (exported or not)
- get arrow functions (exported or not)

TODO:
- also get the config attached as part of the raw span
- along the same lines: ensure the config for models would be attached when getting all fsorm models

*/
export const getSwcFunctions = (swcModuleItems, absolutePath, projectRoot, fileSpan) => {
    const swcFunctions = swcModuleItems
        .map((item) => {
        if (getIsModuleItemSwcFunction(item)) {
            return getSwcFunctionsFromDeclaration(item, absolutePath, projectRoot, fileSpan);
        }
        return undefined;
    })
        .filter(notEmpty)
        .flat();
    return swcFunctions;
};
//# sourceMappingURL=getSwcFunctions.js.map