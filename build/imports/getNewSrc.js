import { format } from "prettier";
import { fileGetContentWithoutImports } from "./fileGetContentWithoutImports.js";
import { fileGetContentsWithoutTopStatements } from "./fileGetContentsWithoutTopStatements.js";
import { importDataToString } from "./importDataToString.js";
export const getNewSrc = async (src, oldImports, newImports) => {
    const srcWithoutImports = fileGetContentWithoutImports(src, oldImports);
    const { shebang, comment, content } = fileGetContentsWithoutTopStatements(srcWithoutImports);
    const newImportStrings = newImports.map(importDataToString);
    const shebangPart = shebang ? `${shebang}\n` : "";
    const commentPart = comment ? `${comment}\n` : "";
    const importsPart = `${newImportStrings.join("\n")}\n`;
    const newFileContents = `${shebangPart}${commentPart}${importsPart}${content}`;
    //console.log({ src, newFileContents });
    try {
        const prettifiedNewContents = await format(newFileContents, {
            parser: "typescript",
            trailingComma: "all",
        });
        return { newSrc: prettifiedNewContents };
    }
    catch (e) {
        console.log("Prettier failed:", e);
        return { prettierError: e?.message };
    }
};
//# sourceMappingURL=getNewSrc.js.map