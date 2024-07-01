import { fs, path, writeJsonToFile } from "from-anywhere/node";
import { makeRelative } from "from-anywhere";
import { getProjectRoot } from "from-anywhere/node";
import { createMappedObject, mergeObjectsArray, notEmpty } from "from-anywhere";
import { readJsonFile } from "from-anywhere/node";
import { lockAction } from "from-anywhere/node";
/**
 * Takes an absolute path to a json and a type generic and provides a map function with which you can alter that JSON (read, map, save)
 */
export const mapObjectJson = async (absolutePath, mapFunction, 
/**
 * Give this if you still want to map if there is no json yet (create)
 */
createObjectIfNonExistent) => {
    if (!absolutePath) {
        return false;
    }
    return lockAction(absolutePath, async () => {
        const json = await readJsonFile(absolutePath);
        if (!json) {
            console.log(`JSON read failed (${absolutePath})`, { type: "warning" });
        }
        if (!json && !createObjectIfNonExistent) {
            return false;
        }
        const realJson = json || createObjectIfNonExistent;
        if (!realJson) {
            return false;
        }
        const newJson = mapFunction(realJson);
        const isSuccessful = await writeJsonToFile(absolutePath, newJson);
        return isSuccessful;
    });
};
export const storeResult = async (context) => {
    const { finalImports, finalStatements } = context;
    const absoluteOperationPathsInScope = context.absoluteOperationPathsInScope.filter((x) => {
        if (!fs.existsSync(x)) {
            console.log("found weird nonexisting path after `findOperationsInScope`", x);
            return false;
        }
        return true;
    });
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return;
    }
    const projectRelativeToolsPath = "packages";
    const absoluteToolsPath = path.join(projectRoot, projectRelativeToolsPath);
    const simpleStatementMap = createMappedObject(finalStatements, "name", (item) => {
        const operationBasePath = absoluteOperationPathsInScope.find((x) => item.absolutePath?.startsWith(`${x}/`));
        return {
            packageCategory: item.packageCategory,
            packageName: item.packageName,
            operationRelativeFilePath: item.absolutePath && operationBasePath
                ? makeRelative(item.absolutePath, operationBasePath)
                : undefined,
            config: item.modelName === "SwcFunction"
                ? item.config
                : undefined,
            parameterNames: item.modelName === "SwcFunction"
                ? item.parameters?.map((x) => x.name)
                : undefined,
        };
    });
    const packageNamesInScope = absoluteOperationPathsInScope.map((p) => path.parse(p).base);
    // INDEX
    const indexPath = path.join(absoluteToolsPath, "statement-index.json");
    // NB: simple function to map the object or create it if it doesn't exist yet. Includes locking functionality
    await mapObjectJson(indexPath, (index) => {
        const keys = Object.keys(index);
        // NB: Ensure the statement-index statements of packageName get removed first before new ones are added
        const newIndex = mergeObjectsArray(keys
            .map((key) => {
            const item = index[key];
            if (!item.packageName) {
                return;
            }
            // NB: remove scoped packages (because we're re-adding them now)
            if (packageNamesInScope.includes(item.packageName)) {
                return;
            }
            return { [key]: item };
        })
            .filter(notEmpty));
        return { ...newIndex, ...simpleStatementMap };
    }, {});
    absoluteOperationPathsInScope.map(async (operationPath) => {
        const packageName = path.parse(operationPath).base;
        await writeJsonToFile(path.join(operationPath, "statements.json"), finalStatements.filter((x) => x.packageName === packageName));
        await writeJsonToFile(path.join(operationPath, "imports.json"), finalImports.filter((x) => x.packageName === packageName));
    });
};
//# sourceMappingURL=storeResult.js.map