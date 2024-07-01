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
export declare const findCodeInMarkdown: (text?: string, isJavascript?: boolean) => Promise<{
    isSuccessful: boolean;
    code?: undefined;
    parseResult?: undefined;
} | {
    code: string;
    parseResult: import("@swc/core").Module | undefined;
    isSuccessful: boolean;
}>;
//# sourceMappingURL=findCodeInMarkdown.d.ts.map