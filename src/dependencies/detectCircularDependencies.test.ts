import { writeToAssets } from "edge-util";
import { detectCircularDependencies } from "./detectCircularDependencies.js";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const operations = {};
detectCircularDependencies(operations, "peer-types").then((res) =>
  writeToAssets(__filename, res, "circdep.json"),
);
