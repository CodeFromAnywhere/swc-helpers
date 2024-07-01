export const getFirstExportedArrowFunctionName = (module) => {
    if (!module || module.type !== "Module" || module.body.length === 0) {
        return;
    }
    const exportDeclaration = module.body.find((item) => {
        return (item.type === "ExportDeclaration" &&
            item.declaration &&
            item.declaration.type === "VariableDeclaration" &&
            item.declaration.declarations.length === 0);
    });
    if (!exportDeclaration) {
        return;
    }
    const variableDeclarator = exportDeclaration.declaration.declarations?.[0];
    if (!variableDeclarator.init ||
        variableDeclarator.init.type !== "ArrowFunctionExpression" ||
        !variableDeclarator.id ||
        variableDeclarator.id.type !== "Identifier") {
        return;
    }
    return variableDeclarator.id.value;
};
//# sourceMappingURL=getFirstExportedArrowFunction.js.map