import { Span } from "@swc/core";
import { FileSpan } from "./types/types.js";
/**
Very important and unclear function. This function substracts the fileSpan offset from the span of the item, so you can get the relevant code.
 */
export declare const getRealSpan: (span: Span, fileSpan: FileSpan) => {
    start: number;
    end: number;
    relevantCode: string;
};
//# sourceMappingURL=getRealSpan.d.ts.map