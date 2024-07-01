import { path, readJsonFile } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
export const getStatementIndex = async () => {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return null;
    }
    const statementIndexPath = path.join(projectRoot, "packages", "statement-index.json");
    return readJsonFile(statementIndexPath);
};
//# sourceMappingURL=getStatementIndex.js.map