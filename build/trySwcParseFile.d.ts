import { SwcFileParse } from "./types/types.js";
/**ugliest hack ever but it fixes the problem that dangles at the end aren't detected */
export declare const withTrueSuffix: (src: string) => string;
/**
Applies parse from `@swc/core`, wraps it in a try/catch, and adds some functionality, primarily around fixing the span
*/
export declare const trySwcParseFile: (absolutePath: string) => Promise<{
    isSuccessful: boolean;
    message?: string | undefined;
    isCached?: boolean | undefined;
    result?: SwcFileParse | undefined;
}>;
//# sourceMappingURL=trySwcParseFile.d.ts.map