import { ExportDeclaration } from "@swc/core";
import { FunctionDeclaration } from "@swc/core";
import { FileSpan, SwcFunction } from "./types/types.js";
export declare const getSwcFunctionFromFunctionDeclaration: (item: ExportDeclaration | FunctionDeclaration, absolutePath: string | undefined, projectRoot: string | undefined, fileSpan: FileSpan) => SwcFunction | undefined;
//# sourceMappingURL=getSwcFunctionFromFunctionDeclaration.d.ts.map