import { Declaration } from "@swc/core";
import { ExportDeclaration } from "@swc/core";
import { VariableDeclarator } from "@swc/core";
import { FileSpan, SwcFunction } from "./types/types.js";
export declare const getSwcFunctionFromVariableDeclarator: (item: Declaration | ExportDeclaration, variableDeclarator: VariableDeclarator, fileSpan: FileSpan, absolutePath: string | undefined, projectRoot: string | undefined) => SwcFunction | undefined;
//# sourceMappingURL=getSwcFunctionFromVariableDeclarator.d.ts.map