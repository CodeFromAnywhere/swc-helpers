import { makeRelative } from "from-anywhere";
import { getRealSpan } from "./getRealSpan.js";
import { notEmpty } from "from-anywhere";
/**
TODO: get only names/locations and isExported :) it's enough
 */
export const getSwcVariables = (code, swcModuleItems, absolutePath, projectRoot, fileSpan) => {
    const swcVariables = swcModuleItems
        .map((x) => {
        const variableDeclaration = x.type === "VariableDeclaration"
            ? x
            : x.type === "ExportDeclaration" &&
                x.declaration.type === "VariableDeclaration"
                ? x.declaration
                : undefined;
        const isExported = x.type === "ExportDeclaration";
        if (!variableDeclaration) {
            return;
        }
        const swcFunctions = variableDeclaration.declarations
            .map((variableDeclarator) => {
            const name = variableDeclarator.id.type === "Identifier"
                ? variableDeclarator.id.value
                : undefined;
            if (!name) {
                return;
            }
            if (variableDeclarator.init?.type === "ArrowFunctionExpression") {
                return;
            }
            //  console.log(x.span);
            const { start, end, relevantCode } = getRealSpan(x.span, fileSpan);
            const swcVariable = {
                modelName: "SwcVariable",
                name,
                start,
                end,
                length: end - start,
                raw: relevantCode,
                absolutePath,
                projectRelativePath: absolutePath && projectRoot
                    ? makeRelative(absolutePath, projectRoot)
                    : undefined,
                isExported,
            };
            return swcVariable;
        })
            .filter(notEmpty);
        return swcFunctions;
    })
        .filter(notEmpty)
        .flat();
    return swcVariables;
};
//# sourceMappingURL=getSwcVariable.js.map