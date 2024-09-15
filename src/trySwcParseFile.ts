import fs from "fs";
import path from "path";
import { trySwcParse } from "./trySwcParse.js";
import { SwcFileParse } from "./types/types.js";
/**ugliest hack ever but it fixes the problem that dangles at the end aren't detected */
export const withTrueSuffix = (src: string) => {
  if (src.endsWith("\ntrue;\n")) {
    return src;
  }
  if (src.endsWith("\n")) {
    return `${src}true;\n`;
  }
  return `${src}\ntrue;\n`;
};

/**
Applies parse from `@swc/core`, wraps it in a try/catch, and adds some functionality, primarily around fixing the span
*/
export const trySwcParseFile = async (
  absolutePath: string,
): Promise<{
  isSuccessful: boolean;
  message?: string;
  isCached?: boolean;
  result?: SwcFileParse;
}> => {
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return {
      isSuccessful: false,
      message: `trySwcParseFile: Path not found (${absolutePath})`,
    };
  }

  const src = await fs.promises.readFile(absolutePath, "utf8");
  const realSrc = withTrueSuffix(src);
  // console.log({ realSrc });

  const { parseResult, isSuccessful, message } = await trySwcParse(realSrc);

  if (!parseResult) {
    console.log({ isSuccessful, message });
    return { isSuccessful: false, message: "Error" };
  }
  // console.log(parseResult.span);

  const srcStringLength = realSrc.length - 1;
  // NB: prettier automatically adds one newline at the end!

  const start = parseResult.span.start;
  const end = parseResult.span.end;
  const spanLength = end - start;
  const startDangleLength =
    srcStringLength - spanLength < 0 ? 0 : srcStringLength - spanLength;

  const hasStartDangle = startDangleLength > 0;

  const startDangle = hasStartDangle
    ? realSrc.substring(0, startDangleLength)
    : undefined;
  const endPosition = startDangleLength + spanLength;

  // console.log({
  //   start,
  //   end,
  //   spanLength,
  //   startDangleLength,
  //   hasStartDangle,
  //   endPosition,
  // });

  const parsedCode = realSrc.slice(startDangleLength, endPosition);

  // console.log({ realSrc: realSrc.length, startDangleLength, endPosition });
  const endDangle = realSrc.slice(endPosition);
  // Newline allowed
  if (endDangle.length > 1) {
    //  console.log({ absolutePath, endDangle });
  }
  // after this, set lastStartOffset

  // console.log({ hasStartDangle, endDangle, startDangle });

  const result: SwcFileParse = {
    src: realSrc,
    absolutePath,
    body: parseResult.body,
    fileSpan: {
      ctxt: parseResult.span.ctxt,
      start,
      end,
      startDangle,
      parsedCode,
    },
  };

  // console.log(parseResult.body);

  return {
    isSuccessful: true,
    isCached: false,
    result,
  };
};
//////
////
///

/////
///
