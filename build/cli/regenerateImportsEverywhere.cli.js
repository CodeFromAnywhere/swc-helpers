#!/usr/bin/env node
import path from "node:path";
import { regenerateImportsEverywhere } from "../imports/regenerateImportsEverywhere.js";
import { writeToAssets } from "from-anywhere/node";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const [basePath, options] = process.argv.slice(2);
if (basePath === undefined || basePath === "") {
    console.log("Please provide a specific path. This is a very dangerous function");
    process.exit();
}
const isDryrun = options == "--isDryrun";
const hasOptions = options !== undefined;
if (hasOptions && !isDryrun) {
    console.log("Invalid options");
    process.exit(0);
}
const realBasePath = basePath?.startsWith(".")
    ? path.join(process.cwd(), basePath)
    : basePath;
console.log({ realBasePath, isDryrun });
const operations = {};
regenerateImportsEverywhere(operations, realBasePath, isDryrun).then((result) => writeToAssets(__filename, result, "resulted-changes.json"));
//# sourceMappingURL=regenerateImportsEverywhere.cli.js.map