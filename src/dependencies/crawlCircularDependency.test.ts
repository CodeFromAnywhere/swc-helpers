import { findCircularDependency } from "./findCircularDependency.js";
import { oneByOne } from "edge-util";
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
