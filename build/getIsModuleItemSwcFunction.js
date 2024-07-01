import { getIsArrowDeclaration } from "./getIsArrowDeclaration.js";
export const getIsModuleItemSwcFunction = (item) => {
    const isFunctionDeclaration = item.type === "FunctionDeclaration";
    const isExportedFunctionDeclaration = item.type === "ExportDeclaration" &&
        item.declaration.type === "FunctionDeclaration";
    const isExportedArrowDeclaration = item.type === "ExportDeclaration" &&
        getIsArrowDeclaration(item.declaration);
    const isArrowDeclaration = getIsArrowDeclaration(item);
    return (isFunctionDeclaration ||
        isExportedFunctionDeclaration ||
        isArrowDeclaration ||
        isExportedArrowDeclaration);
};
//# sourceMappingURL=getIsModuleItemSwcFunction.js.map