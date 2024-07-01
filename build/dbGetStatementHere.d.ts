/**
 * Get the statement in any nearbyFile.
 *
 * To get it in the file you're working in now, just do this:
 *
 * ```ts
 * dbGetStatementHere(__filename, "your statement name")
 * ```
 *
 * If you want to get it from another file, add `__filename` to the config of the statement
 *
 * ```
 * export const TestInterface = { age: number, name: string};
 * export const testInterfaceConfig = { __filename };
 * // in other file:
 * dbGetStatementHere(testInterfaceConfig.__filename, "TestInterface")
 * ```
 *
 * TODO: improve performance
 */
export declare const dbGetStatementHere: {
    (sourceFilePath: string, statementName: string): Promise<import("./index.js").SwcStatement | undefined>;
    config: {
        sourceFilePath: string;
    };
};
//# sourceMappingURL=dbGetStatementHere.d.ts.map