import { getStatementEntireCodeString } from "../getStatementEntireCodeString.js";
import fs from "node:fs";
const fsPromises = fs.promises;
import path from "node:path";
const cli = async () => {
    const [destinationPath, ...statementNames] = process.argv.slice(2);
    const operations = {};
    console.log("Making file for:", statementNames.join(", "));
    if (statementNames.length === 0) {
        console.log("Please provide some statement names as arguments.");
        return;
    }
    const codeString = await getStatementEntireCodeString(operations, statementNames);
    if (!codeString) {
        console.log("Something went wrong! No code generated");
        return;
    }
    const absolutePath = destinationPath.startsWith(".")
        ? path.join(process.cwd(), destinationPath)
        : destinationPath;
    const absolutePathWithFilename = absolutePath.endsWith(".ts") || absolutePath.endsWith(".tsx")
        ? absolutePath
        : path.join(absolutePath, "result.ts");
    if (!fs.existsSync(path.parse(absolutePathWithFilename).dir)) {
        console.log("Folder doesn't exist for this file", absolutePathWithFilename);
        return;
    }
    await fsPromises.writeFile(absolutePathWithFilename, codeString, "utf8");
    console.log("written to", absolutePathWithFilename);
};
cli();
//# sourceMappingURL=bundlex.cli.js.map