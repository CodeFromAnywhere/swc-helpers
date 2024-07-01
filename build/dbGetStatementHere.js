import { makeRelative } from "from-anywhere";
import { getFilenameTypescriptPath } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getStatements } from "./getStatements.js";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
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
export const dbGetStatementHere = async (
/**
 * just pass __filename, which should point to the current js file where this function is called.
 */
sourceFilePath, 
/**
 * the name of the statement you want to inspect with swc
 */
statementName) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return;
    }
    const absouluteTypescriptFilePath = getFilenameTypescriptPath(sourceFilePath);
    const projectRelativeTypescriptFilePath = makeRelative(absouluteTypescriptFilePath, projectRoot);
    const statements = (await getStatements({
        name: statementName,
        projectRelativeBasePath: projectRelativeTypescriptFilePath,
    })).statements;
    const typeInterface = statements?.find((x) => x.name === statementName);
    return typeInterface;
};
dbGetStatementHere.config = {
    sourceFilePath: __filename,
};
//# sourceMappingURL=dbGetStatementHere.js.map