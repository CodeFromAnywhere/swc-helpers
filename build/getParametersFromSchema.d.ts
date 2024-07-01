import { FunctionParameter } from "from-anywhere/types";
import { SchemaItem } from "from-anywhere/types";
/**
 * NB: this function also removes parameters not needed in the api (things from StandardContext) as it is intended to be used for rendering function forms
 */
export declare const getParametersFromSchema: (schemaItem: SchemaItem | undefined, functionName: string) => FunctionParameter[] | undefined;
//# sourceMappingURL=getParametersFromSchema.d.ts.map