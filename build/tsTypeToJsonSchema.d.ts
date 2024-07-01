import { TsType } from "@swc/core";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
export declare const tsKeywordTypeKindToJsonSchemaTypeName: (tsKeywordTypeKind: "any" | "unknown" | "number" | "object" | "boolean" | "bigint" | "string" | "symbol" | "void" | "undefined" | "null" | "never" | "intrinsic") => JSONSchema7TypeName;
/**
Simple parser for tsTypeAnnotations to a JSON schema. Does not support most things!

See TsType for all it's possible values (a lot)

This function should support:

- Unwrap from a Promise<T> (ignoring the promise)
- TsKeywordType
- TsTypeReference (without params)
- TsTypeLiteral (objects)
- TsIntersectionType (only for TsTypeLiterals)
*/
export declare const tsTypeToJsonSchema: (typeAnnotation: TsType, references: string[]) => {
    schema: JSONSchema7;
    references: string[];
};
//# sourceMappingURL=tsTypeToJsonSchema.d.ts.map