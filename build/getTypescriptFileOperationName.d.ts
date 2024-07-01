/**
 * Returns the operationName for a typescript file path.
 *
 * uses `sdk-operations`.
 *
 * TODO: can also just recursively go up in the fs until a package.json is found that seems an operation root. This would be much better since now we rely on `sdk-operations` being indexed all the time; not a good reliability...
 *
 */
export declare const getTypescriptFileOperationName: (absoluteTypescriptFilePath: string, operations: {
    [key: string]: string;
}) => string | undefined;
//# sourceMappingURL=getTypescriptFileOperationName.d.ts.map