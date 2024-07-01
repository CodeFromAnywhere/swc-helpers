import { makeRelative } from "from-anywhere";
import { getRealSpan } from "./getRealSpan.js";
export const getSwcFunctionFromVariableDeclarator = (item, variableDeclarator, fileSpan, absolutePath, projectRoot) => {
    const name = variableDeclarator.id.type === "Identifier"
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
    const swcFunction = {
        modelName: "SwcFunction",
        name,
        start,
        end,
        length: end - start,
        raw: relevantCode,
        absolutePath,
        projectRelativePath: absolutePath && projectRoot
            ? makeRelative(absolutePath, projectRoot)
            : undefined,
        isExported: item.type === "ExportDeclaration",
    };
    return swcFunction;
};
//# sourceMappingURL=getSwcFunctionFromVariableDeclarator.js.map