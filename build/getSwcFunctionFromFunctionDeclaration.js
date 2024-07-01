import { makeRelative } from "from-anywhere";
import { getRealSpan } from "./getRealSpan.js";
export const getSwcFunctionFromFunctionDeclaration = (item, absolutePath, projectRoot, fileSpan) => {
    const functionDeclaration = item.type === "ExportDeclaration"
        ? item.declaration
        : item;
    const name = functionDeclaration.identifier.type === "Identifier"
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
    const swcFunction = {
        modelName: "SwcFunction",
        name,
        start,
        end,
        length: end - start,
        raw: relevantCode,
        rawBodyCode,
        absolutePath,
        projectRelativePath: absolutePath && projectRoot
            ? makeRelative(absolutePath, projectRoot)
            : undefined,
        isExported: item.type === "ExportDeclaration",
    };
    return swcFunction;
};
//# sourceMappingURL=getSwcFunctionFromFunctionDeclaration.js.map