import { Module, ModuleItem } from "@swc/core";
import { JSONSchema7 } from "json-schema";
/**
 *
 */
export declare const tsModuleToFunctionSchemas: (module: Module) => {
    isSuccessful: boolean;
    functions: {
        functionParameters: {
            parameterName: string;
            required: boolean;
            schema: JSONSchema7;
        }[];
        returnTypeSchema: JSONSchema7;
        references: string[];
    }[];
    errors: {
        isSuccessful: boolean;
        message: string;
        error: string;
        item: ModuleItem;
    }[];
};
//# sourceMappingURL=tsModuleToFunctionSchemas.d.ts.map