export const getFirstNonExportedArrowFunctionName = (json) => {
    if (!json || json.type !== "Module" || json.body.length === 0) {
        return null;
    }
    const variableDeclaration = json.body.find((item) => item.type === "VariableDeclaration" &&
        item.kind === "const" &&
        item.declarations.length > 0);
    if (!variableDeclaration) {
        return null;
    }
    const arrowFunctionDeclaration = variableDeclaration.declarations.find((declaration) => declaration.init &&
        declaration.init.type === "ArrowFunctionExpression" &&
        declaration.id &&
        declaration.id.type === "Identifier");
    if (!arrowFunctionDeclaration) {
        return null;
    }
    return arrowFunctionDeclaration.id.value;
};
//# sourceMappingURL=getFirstNonExportedArrowFunction.js.map