import { writeToAssets } from "from-anywhere/node";
import { getStatementWithDependenciesRecursive } from "./getStatementWithDependenciesRecursive.js";
const operations = {};
getStatementWithDependenciesRecursive(operations, "getStatementWithDependenciesRecursive").then((result) => {
    writeToAssets(__filename, JSON.stringify(result), `getStatementWithDependenciesRecursive.json`);
});
//# sourceMappingURL=getStatementWithDependenciesRecursive.test.js.map