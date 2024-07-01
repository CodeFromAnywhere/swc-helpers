import { writeToAssets } from "from-anywhere/node";
import { getStatementEntireCodeString } from "./getStatementEntireCodeString.js";
const operations = {};
getStatementEntireCodeString(operations, ["getTypescriptFileData"]).then((result) => {
    writeToAssets(__filename, result, "getTypescriptFileData.ts");
});
//# sourceMappingURL=getStatementEntireCodeString.test.js.map