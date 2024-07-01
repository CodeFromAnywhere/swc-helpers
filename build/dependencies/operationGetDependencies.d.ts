/**
Behavior:
 - finds all ts/tsx files in the operation (extrahere this from )
 - parses them all with swc to find the imports
 - excludes relative imports, parses absolute imports to get the dependency name
 - returns dependency names
 */
export declare const operationGetDependencies: (operationName: string, operations: {
    [key: string]: string;
}) => Promise<string[] | undefined>;
//# sourceMappingURL=operationGetDependencies.d.ts.map