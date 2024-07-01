import { GetSwcStatementsFilter } from "./types/GetSwcStatementsFilter.js";
import { SwcFunction, SwcInterface, SwcModels, SwcVariable } from "./types/types.js";
export declare const dbGetSwcFunctions: (operations: {
    [key: string]: string;
}, filter?: GetSwcStatementsFilter) => Promise<SwcFunction[] | undefined>;
export declare const dbGetSwcInterfaces: (operations: {
    [key: string]: string;
}, filter?: GetSwcStatementsFilter) => Promise<SwcInterface[] | undefined>;
export declare const dbGetSwcVariables: (operations: {
    [key: string]: string;
}, filter?: GetSwcStatementsFilter) => Promise<SwcVariable[] | undefined>;
/**
 * General purpose function to get stuff from the typescript stored "db" (that is your code)
 */
export declare const swcGet: <TModel extends "SwcStatement" | "SwcFunction" | "SwcInterface" | "SwcVariable">(operations: {
    [key: string]: string;
}, model: TModel, filter?: GetSwcStatementsFilter) => Promise<SwcModels[TModel][] | undefined>;
//# sourceMappingURL=swcGet.d.ts.map