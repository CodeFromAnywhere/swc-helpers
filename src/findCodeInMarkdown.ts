import { trySwcParse } from "./trySwcParse.js";
import { findCodeblocks } from "marked-util";
import { findCodespans } from "marked-util";
import { trimCodeblock } from "marked-util";
/**
 * For good accuracy, try to parse the code given (ecmascript or typescript) and return the code if it is successfully parseable.
 *
 * Tries:
 * 1) parse first codeblock
 * 2) parse first codespan
 * 3) parse directly
 *
 * NB: unlike JSON finder, this a codeblock is also valid code, so we have to first find codeblocks and codespans, then the raw.
 */
export const findCodeInMarkdown = async (
  text?: string,
  isJavascript?: boolean,
) => {
  if (!text) return { isSuccessful: false };
  const trimmed = text.trim();

  // find first codeblock (```code```)
  const codeblocks = findCodeblocks(trimmed);

  const firstCodeblock = codeblocks[0]
    ? trimCodeblock(codeblocks[0])
    : undefined;

  const secondTry = firstCodeblock
    ? await trySwcParse(firstCodeblock, isJavascript)
    : undefined;

  if (secondTry?.parseResult && firstCodeblock) {
    return {
      code: firstCodeblock,
      parseResult: secondTry.parseResult,
      isSuccessful: true,
    };
  }
  // if no codeblocks were found, find codespans
  const codespans = findCodespans(trimmed);

  const codespan = codespans[0]?.trim().replaceAll("&quot;", '"');
  const thirdTry = await trySwcParse(codespan, isJavascript);

  if (thirdTry?.isSuccessful) {
    return {
      code: codespan,
      parseResult: thirdTry.parseResult,
      isSuccessful: true,
    };
  }

  const { isSuccessful, parseResult } = await trySwcParse(
    trimmed,
    isJavascript,
  );

  if (isSuccessful && trimmed && parseResult) {
    return { code: trimmed, parseResult, isSuccessful: true };
  }

  return { isSuccessful: false };
};
