import { fs } from "from-anywhere/node";
import { makeRelative } from "from-anywhere";
import { getProjectRoot } from "from-anywhere/node";
import { getObjectKeysArray } from "from-anywhere";
/**
 * Returns the operationName for a typescript file path.
 *
 * uses `sdk-operations`.
 *
 * TODO: can also just recursively go up in the fs until a package.json is found that seems an operation root. This would be much better since now we rely on `sdk-operations` being indexed all the time; not a good reliability...
 *
 */
export const getTypescriptFileOperationName = (absoluteTypescriptFilePath, operations) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot)
        return;
    if (!fs.existsSync(absoluteTypescriptFilePath)) {
        return;
    }
    const projectRelativePath = makeRelative(absoluteTypescriptFilePath, projectRoot);
    const operationName = getObjectKeysArray(operations).find((operationName) => {
        return projectRelativePath.startsWith(`${operations[operationName]}/`);
    });
    return operationName;
};
//# sourceMappingURL=getTypescriptFileOperationName.js.map