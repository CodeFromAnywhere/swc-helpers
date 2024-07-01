import { OperationClassification } from "from-anywhere/types";
import { SchemaItem } from "from-anywhere/types";
import { SwcStatement } from "./types/types.js";
/** Contains some conventions to add certain data to the SwcStatement */
export declare const addStatementInfo: (item: SwcStatement, absoluteOperationPathsInScope: string[], operationClassificationObject: {
    [x: string]: "cjs" | "ts" | "esm" | "node-cjs" | "node-cjs-sdk" | "node-esm" | "node-ts" | "server-cjs" | "ui-web" | "ui-app" | "ui-ts" | "ui-cjs" | "ui-esm" | undefined;
}, operationSchemaObject: {
    [x: string]: SchemaItem[] | undefined;
}) => Promise<SwcStatement | undefined>;
//# sourceMappingURL=addStatementInfo.d.ts.map