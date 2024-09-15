import { notEmpty } from "edge-util";
import { SchemaItem } from "edge-util";
import { getSchema } from "schema-helpers";
import { JSONSchema7 } from "json-schema";
export const getPossibleRefs = (
  schemaItem: SchemaItem,
): { name: string; schema: JSONSchema7 }[] => {
  if (!schemaItem.schema?.definitions) {
    return [];
  }

  const possibleRefs = Object.keys(schemaItem.schema.definitions)
    .map((name) => {
      const schema = getSchema(schemaItem.schema?.definitions?.[name]);

      if (!schema) {
        return null;
      }
      return { name, schema };
    })
    .filter(notEmpty);

  return possibleRefs;
};
