export declare const getStatementCodeString: (statementName: string, operations: {
    [key: string]: string;
}) => Promise<{
    statements: import("./types/types.js").SwcStatement[] | undefined;
    importedStatementNames: string[];
    nonModuleImports: import("./types/types.js").SwcImport[];
} | undefined>;
//# sourceMappingURL=getStatementCodeString.d.ts.map