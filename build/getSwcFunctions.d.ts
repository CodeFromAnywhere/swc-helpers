import { ModuleItem } from "@swc/core";
import { FileSpan, SwcFunction } from "./types/types.js";
/**
Gets all swc functions
- get regular functions (exported or not)
- get arrow functions (exported or not)

TODO:
- also get the config attached as part of the raw span
- along the same lines: ensure the config for models would be attached when getting all fsorm models

*/
export declare const getSwcFunctions: (swcModuleItems: ModuleItem[], absolutePath: string | undefined, projectRoot: string | undefined, fileSpan: FileSpan) => SwcFunction[];
//# sourceMappingURL=getSwcFunctions.d.ts.map