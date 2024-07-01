import { findCircularDependency } from "./findCircularDependency.js";
import { oneByOne } from "from-anywhere";
/**
 * DEPRECATED: `simpleCircularDependencyFinder` is better
 */
const test = () => {
    const operations = {};
    oneByOne(Object.keys(operations), async (operationName, index) => {
        process.stdout.write(`${index + 1}:${operationName}...`);
        const result = await findCircularDependency(operationName, operations);
        console.log("✅");
    });
};
test();
//# sourceMappingURL=crawlCircularDependency.test.js.map