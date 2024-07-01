import { ModuleItem } from "@swc/core";
import { FileSpan, SwcImport } from "./types/types.js";
/**
 * Takes swcModuleItems, and returns an array of imports (name + module)
 */
export declare const getSwcImports: (src: string, swcModuleItems: ModuleItem[], absolutePath: string | undefined, projectRoot: string | undefined, fileSpan: FileSpan, operations: {
    [key: string]: string;
}) => SwcImport[];
//# sourceMappingURL=getSwcImports.d.ts.map