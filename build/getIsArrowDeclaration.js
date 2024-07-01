export const getIsArrowDeclaration = (moduleItem) => {
    return (moduleItem.type === "VariableDeclaration" &&
        !!moduleItem.declarations.find((x) => x.init?.type === "ArrowFunctionExpression"));
};
//# sourceMappingURL=getIsArrowDeclaration.js.map