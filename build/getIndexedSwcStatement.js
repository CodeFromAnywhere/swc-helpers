import path from "node:path";
import { getProjectRoot, readJsonFile } from "from-anywhere/node";
import { getStatementIndex } from "./getStatementIndex.js";
let statementIndex = null;
/**
 * NB: assumes server restarts after statements are changed!
 */
export const getIndexedSwcStatement = async (statementName) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return;
    }
    const json = statementIndex || (await getStatementIndex());
    if (json && !statementIndex) {
        statementIndex = json;
    }
    if (!json) {
        return;
    }
    const value = json[statementName];
    if (!value || !value.packageCategory || !value.packageName) {
        return;
    }
    const statementsPath = path.join(projectRoot, "packages", value.packageCategory, value.packageName, "statements.json");
    const statements = await readJsonFile(statementsPath);
    if (!statements) {
        return;
    }
    const statement = statements.find((x) => x.name === statementName);
    if (!statement) {
        return;
    }
    return statement;
};
//# sourceMappingURL=getIndexedSwcStatement.js.map