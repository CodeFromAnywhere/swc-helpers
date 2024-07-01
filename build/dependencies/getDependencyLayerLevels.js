import { writeToAssets } from "from-anywhere/node";
import { getDependenciesPerOperation } from "./getDependenciesPerOperation.js";
import { notEmpty } from "from-anywhere";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
/**

 * DEPRECATED: `simpleCircularDependencyFinder` is better

*/
export const getDependencyLayerLevels = async (operationNames, removedOperationNames, level, dependenciesPerOperation, operations) => {
    if (operationNames.length === 0) {
        console.log("DONE");
        return;
    }
    if (level > 50) {
        console.log("LOOP");
        // infinite loop
        return;
    }
    dependenciesPerOperation =
        dependenciesPerOperation ||
            (await getDependenciesPerOperation(operationNames, operations));
    const dependenciesWithoutRemovedPerOperation = dependenciesPerOperation
        .map((item) => {
        const isNeeded = operationNames.includes(item.operationName);
        if (!isNeeded) {
            return;
        }
        const dependenciesWithoutRemoved = item.dependencies?.filter((name) => !removedOperationNames.includes(name));
        return { operationName: item.operationName, dependenciesWithoutRemoved };
    })
        .filter(notEmpty);
    writeToAssets(__filename, dependenciesWithoutRemovedPerOperation, `dependenciesPerOperation-${level}.json`);
    const operationsWithoutDependencies = dependenciesWithoutRemovedPerOperation
        .filter((x) => x.dependenciesWithoutRemoved?.length === 0)
        .map((x) => x.operationName);
    if (operationsWithoutDependencies.length === 0) {
        // no new stuff without deps
        writeToAssets(__filename, dependenciesWithoutRemovedPerOperation, `problematic-operations.json`);
        return;
    }
    writeToAssets(__filename, operationsWithoutDependencies, `level${level}.json`);
    const operationNamesLeft = operationNames.filter((name) => {
        const withDependencies = !operationsWithoutDependencies.includes(name);
        return withDependencies;
    });
    const newRemovedOperationNames = [...removedOperationNames].concat(operationsWithoutDependencies);
    return await getDependencyLayerLevels(operationNamesLeft, newRemovedOperationNames, level + 1, dependenciesPerOperation, operations);
};
//# sourceMappingURL=getDependencyLayerLevels.js.map