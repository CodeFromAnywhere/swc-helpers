import path from "node:path";
import { getProjectRoot, readJsonFile } from "from-anywhere/node";
/**
 * Get dependencies via package.json
 */
export const operationGetIndexedDependencies = async (operationName, operations) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot)
        return;
    const projectRelativeOperationPath = operations[operationName] || undefined;
    if (!projectRelativeOperationPath)
        return;
    const operationBasePath = path.join(projectRoot, projectRelativeOperationPath);
    const packageJsonPath = path.join(operationBasePath, "package.json");
    const operation = await readJsonFile(packageJsonPath);
    if (!operation)
        return;
    if (!operation.dependencies)
        return [];
    return Object.keys(operation.dependencies);
};
//# sourceMappingURL=operationGetIndexedDependencies.js.map