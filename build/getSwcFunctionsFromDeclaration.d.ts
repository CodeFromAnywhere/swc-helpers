import { Declaration } from "@swc/core";
import { ExportDeclaration } from "@swc/core";
import { FileSpan } from "./types/types.js";
/**
Detects and finds SwcFunctions in regular and arrow functions, exported or not
 */
export declare const getSwcFunctionsFromDeclaration: (item: Declaration | ExportDeclaration, absolutePath: string | undefined, projectRoot: string | undefined, fileSpan: FileSpan) => import("./types/types.js").SwcFunction | import("./types/types.js").SwcFunction[] | undefined;
//# sourceMappingURL=getSwcFunctionsFromDeclaration.d.ts.map