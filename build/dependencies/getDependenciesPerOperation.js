import { operationGetDependencies } from "./operationGetDependencies.js";
/**
In ±400ms scans thue entire codebase for all dependencies in the imports
*/
export const getDependenciesPerOperation = async (operationNames, operations) => {
    const dependenciesPerOperation = await Promise.all(operationNames.map(async (operationName) => {
        const dependencies = await operationGetDependencies(operationName, operations);
        return {
            operationName,
            dependencies: dependencies?.filter((name) => operationNames.includes(name)),
        };
    }));
    return dependenciesPerOperation;
};
//# sourceMappingURL=getDependenciesPerOperation.js.map