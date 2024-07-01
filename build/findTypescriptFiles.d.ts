/**
 * Finds all typescript files in the provided basePath(s). If undefined, uses projectRoot. You can also provide specific files as part of the basePath
 */
export declare const findTypescriptFiles: (operations: {
    [key: string]: string;
}, absoluteFileOrFolderPaths: string | string[] | undefined) => Promise<string[]>;
//# sourceMappingURL=findTypescriptFiles.d.ts.map