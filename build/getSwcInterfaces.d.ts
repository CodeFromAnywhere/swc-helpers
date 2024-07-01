import { ModuleItem } from "@swc/core";
import { FileSpan, SwcInterface } from "./types/types.js";
/**
For now, gets only names/locations and isExported  :) it's enough
 */
export declare const getSwcInterfaces: (src: string, swcModuleItems: ModuleItem[], absolutePath: string | undefined, projectRoot: string | undefined, fileSpan: FileSpan) => SwcInterface[];
//# sourceMappingURL=getSwcInterfaces.d.ts.map