/**

Strategy to detect circular dependencies:

- in every file in the operation, look for imports
- go to the operation that is imported, and look for all files all imports there, recursively
- if any file imports the same operationName as we started with, it's a circle. return that as string[] of operation/file pairs.

DEPRECATED: `simpleCircularDependencyFinder` is better
*/
export declare const detectCircularDependencies: (operations: {
    [key: string]: string;
}, operationName: string, stack?: string[]) => Promise<string[][] | undefined>;
//# sourceMappingURL=detectCircularDependencies.d.ts.map