/**
In ±400ms scans thue entire codebase for all dependencies in the imports
*/
export declare const getDependenciesPerOperation: (operationNames: string[], operations: {
    [key: string]: string;
}) => Promise<{
    operationName: string;
    dependencies: string[] | undefined;
}[]>;
//# sourceMappingURL=getDependenciesPerOperation.d.ts.map