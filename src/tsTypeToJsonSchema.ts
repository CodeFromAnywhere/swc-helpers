import { Identifier, TsType } from "@swc/core";
import { mergeObjectsArray, notEmpty } from "from-anywhere";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";

export const tsKeywordTypeKindToJsonSchemaTypeName = (
  tsKeywordTypeKind:
    | "any"
    | "unknown"
    | "number"
    | "object"
    | "boolean"
    | "bigint"
    | "string"
    | "symbol"
    | "void"
    | "undefined"
    | "null"
    | "never"
    | "intrinsic",
): JSONSchema7TypeName => {
  if (tsKeywordTypeKind === "number" || tsKeywordTypeKind === "bigint") {
    return "number";
  }

  if (tsKeywordTypeKind === "string") {
    return "string";
  }

  if (tsKeywordTypeKind === "boolean") {
    return "boolean";
  }

  if (tsKeywordTypeKind === "object") {
    return "object";
  }

  return "null";
};

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

export const tsTypeToJsonSchema = (
  typeAnnotation: TsType,
  references: string[],
): { schema: JSONSchema7; references: string[] } => {
  if (typeAnnotation.type === "TsKeywordType") {
    // regular keyword types are the simplest case
    return {
      schema: {
        type: tsKeywordTypeKindToJsonSchemaTypeName(typeAnnotation.kind),
      },
      references,
    };
  }

  const isPromise =
    typeAnnotation.type === "TsTypeReference" &&
    typeAnnotation.typeName.type === "Identifier" &&
    typeAnnotation.typeName.value === "Promise";

  if (isPromise && typeAnnotation.type === "TsTypeReference") {
    // If it's wrapped in a promise, evaluate the promise as we don't care about whether or not it's async
    const firstPromiseParameter = typeAnnotation.typeParams
      ?.params[0] as TsType;

    return tsTypeToJsonSchema(firstPromiseParameter, references);
  }

  if (typeAnnotation.type === "TsTypeReference") {
    // for references to another type we return a reference, assuming it's defined there.
    const reference = (typeAnnotation.typeName as Identifier).value;
    const newReferences = references.includes(reference)
      ? references
      : references.concat(reference);
    return {
      schema: {
        $ref: `#/components/schemas/${reference}`,
      },
      references: newReferences,
    };
  }

  if (typeAnnotation.type === "TsTypeLiteral") {
    // for inline object literals (`{a:string,b:string}` syntax) we recurse on each property
    //keys: members[n].key.value
    //values calc(members[n].typeAnnotation.typeAnnotation)

    const propertiesArray = typeAnnotation.members
      .map((item) => {
        if (
          item.type !== "TsPropertySignature" ||
          item.key.type !== "Identifier" ||
          !item.key.value ||
          !item.typeAnnotation?.typeAnnotation
        ) {
          return;
        }

        const result = tsTypeToJsonSchema(
          item.typeAnnotation.typeAnnotation,
          [],
        );

        return {
          property: { [item.key.value]: result.schema },
          references: result.references,
        };
      })
      .filter(notEmpty);

    const newReferences = propertiesArray
      .map((x) => x.references)
      .flat()
      .concat(references);

    return {
      references: newReferences,
      schema: {
        type: "object",
        properties: mergeObjectsArray(propertiesArray.map((x) => x.property)),
      },
    };
  }

  if (typeAnnotation.type === "TsIntersectionType") {
    // With intersection types (`T & Q` syntax) we use the `allOf` prop for each type
    const objectIntersection = typeAnnotation.types
      .map((item) => tsTypeToJsonSchema(item, []))
      .filter((x) => x.schema.type !== "null");

    const newReferences = objectIntersection
      .map((x) => x.references)
      .flat()
      .concat(references);

    return {
      schema: { allOf: objectIntersection.map((x) => x.schema) },
      references: newReferences,
    };
  }

  // if this happens we don't know what to do
  return { schema: { type: "null" }, references };
};
