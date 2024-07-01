import { notEmpty } from "from-anywhere";
import { onlyUnique2 } from "from-anywhere";
import { operationGetIndexedDependencies } from "./operationGetIndexedDependencies.js";
/**

Strategy to detect circular dependencies:

- in every file in the operation, look for imports
- go to the operation that is imported, and look for all files all imports there, recursively
- if any file imports the same operationName as we started with, it's a circle. return that as string[] of operation/file pairs.

DEPRECATED: `simpleCircularDependencyFinder` is better
*/
export const detectCircularDependencies = async (operations, operationName, stack = []) => {
    const dependencies = await operationGetIndexedDependencies(operationName, operations);
    if (!dependencies)
        return;
    const newStack = [...stack, operationName];
    const recursiveDependency = dependencies.find((x) => newStack.includes(x));
    if (recursiveDependency) {
        const startIndex = stack.findIndex((x) => x === recursiveDependency);
        const specificNewStack = [...stack.slice(startIndex), operationName];
        return [specificNewStack];
    }
    const depInfo = (await Promise.all(dependencies.map(async (dependency) => {
        const specificNewStack = [...stack, operationName];
        const circularDependencies = await detectCircularDependencies(operations, dependency, specificNewStack);
        return circularDependencies;
    })))
        .flat()
        .filter(notEmpty)
        .filter(onlyUnique2((a, b) => a.join("/") === b.join("/")));
    return depInfo;
};
//# sourceMappingURL=detectCircularDependencies.js.map