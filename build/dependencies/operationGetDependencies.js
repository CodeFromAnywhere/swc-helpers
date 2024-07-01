import { sourceFolderName } from "from-anywhere";
import path from "node:path";
import { getProjectRoot } from "from-anywhere/node";
import { notEmpty } from "from-anywhere";
import { onlyUnique2 } from "from-anywhere";
import { getFolderTypescriptFiles } from "from-anywhere/node";
import { getTypescriptFileData } from "../getTypescriptFileData.js";
/**
Behavior:
 - finds all ts/tsx files in the operation (extrahere this from )
 - parses them all with swc to find the imports
 - excludes relative imports, parses absolute imports to get the dependency name
 - returns dependency names
 */
export const operationGetDependencies = async (operationName, operations) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot)
        return;
    const projectRelativeOperationPath = operations[operationName] || undefined;
    if (!projectRelativeOperationPath)
        return;
    const operationBasePath = path.join(projectRoot, projectRelativeOperationPath);
    const absoluteSrcBasePath = path.join(operationBasePath, sourceFolderName);
    const absoluteTypescriptFilePaths = (await getFolderTypescriptFiles(absoluteSrcBasePath, false)).map((x) => x.path);
    const typescriptFileDataPromises = absoluteTypescriptFilePaths.map(async (absolutePath) => getTypescriptFileData(operations, absolutePath, {}));
    const typescriptFileDataArray = await Promise.all(typescriptFileDataPromises);
    const imports = typescriptFileDataArray
        .map((x) => x.imports)
        .filter(notEmpty)
        .flat();
    const filtered = imports
        // NB: here we say we don't care about type imports. Not sure if true
        .filter((x) => x.isModuleFromMonorepo && !x.isTypeImport)
        .map((x) => x.module)
        .filter(onlyUnique2());
    return filtered;
};
//# sourceMappingURL=operationGetDependencies.js.map