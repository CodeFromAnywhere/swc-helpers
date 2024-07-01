import { tryParseTypescript } from "./tryParseTypescript.js";
import { findCodeblocks } from "marked-util";
import { findCodespans } from "marked-util";
import { trimCodeblock } from "marked-util";
/**
 * For good accuracy, try to get a markdown with a single JSON, preferably without any other codespans.
 */
export const findTypescriptCodeInMarkdown = async (text) => {
    if (!text)
        return undefined;
    const trimmed = text.trim();
    // find first codeblock (```code```)
    const codeblocks = findCodeblocks(trimmed);
    const firstCodeblock = codeblocks[0]
        ? trimCodeblock(codeblocks[0])
        : undefined;
    const secondTryJson = firstCodeblock
        ? await tryParseTypescript(firstCodeblock)
        : undefined;
    if (secondTryJson) {
        return secondTryJson;
    }
    // if no codeblocks were found, find codespans
    const codespans = findCodespans(trimmed);
    const codespan = codespans[0]?.trim().replaceAll("&quot;", '"');
    const thirdTryJson = await tryParseTypescript(codespan);
    if (thirdTryJson) {
        return thirdTryJson;
    }
    const codeFirstTry = await tryParseTypescript(trimmed);
    if (codeFirstTry) {
        return codeFirstTry;
    }
    return;
};
//# sourceMappingURL=findTypescriptCodeInMarkdown.js.map