import { ModuleItem } from "@swc/core";
import { FileSpan, SwcVariable } from "./types/types.js";
/**
TODO: get only names/locations and isExported :) it's enough
 */
export declare const getSwcVariables: (code: string, swcModuleItems: ModuleItem[], absolutePath: string | undefined, projectRoot: string | undefined, fileSpan: FileSpan) => SwcVariable[];
//# sourceMappingURL=getSwcVariable.d.ts.map