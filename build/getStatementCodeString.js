import { getStatementIndex } from "./getStatementIndex.js";
import { path } from "from-anywhere/node";
import { projectRoot } from "from-anywhere/node";
import { getTypescriptFileData } from "./getTypescriptFileData.js";
let statementIndex = null;
export const getStatementCodeString = async (statementName, operations) => {
    if (!statementIndex) {
        statementIndex = await getStatementIndex();
    }
    const realStatementIndex = statementIndex;
    if (!realStatementIndex) {
        return;
    }
    const item = realStatementIndex[statementName];
    if (!item ||
        !item.packageCategory ||
        !item.packageName ||
        !item.operationRelativeFilePath) {
        console.log("Incomplete statement-index: ", statementName, " (not found)");
        return;
    }
    const absolutePath = path.join(projectRoot, "packages", item.packageCategory, item.packageName, item.operationRelativeFilePath);
    // now we have the absolute path of that statement, and we can find its imports
    const { imports, statements } = await getTypescriptFileData(operations, absolutePath);
    const importedStatementNames = (imports || [])
        .filter((x) => !!x.isModuleFromMonorepo)
        .map((x) => x.name);
    const nonModuleImports = (imports || []).filter((x) => !x.isModuleFromMonorepo);
    return { statements, importedStatementNames, nonModuleImports };
};
//# sourceMappingURL=getStatementCodeString.js.map