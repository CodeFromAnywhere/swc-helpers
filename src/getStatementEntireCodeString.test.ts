import { writeToAssets } from "edge-util";
import { getStatementEntireCodeString } from "./getStatementEntireCodeString.js";
const operations = {};
getStatementEntireCodeString(operations, ["getTypescriptFileData"]).then(
  (result) => {
    writeToAssets(__filename, result, "getTypescriptFileData.ts");
  },
);
