import { writeToAssets } from "from-anywhere/node";
import { getSingleCodeString } from "./getSingleCodeString.js";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);

const test = async () => {
  const result = await getSingleCodeString(
    "packages/util/js-util/src/object-maps.ts",
    {},
    // "operations/tools/typescript/swc-util/src/getSwcImports.ts"
  );

  writeToAssets(__filename, result, "result.ts");
};

test();
