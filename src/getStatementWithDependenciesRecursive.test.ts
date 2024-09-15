import { writeToAssets } from "edge-util";
import { getStatementWithDependenciesRecursive } from "./getStatementWithDependenciesRecursive.js";
const operations = {};
getStatementWithDependenciesRecursive(
  operations,
  "getStatementWithDependenciesRecursive",
).then((result) => {
  writeToAssets(
    __filename,
    JSON.stringify(result),
    `getStatementWithDependenciesRecursive.json`,
  );
});
