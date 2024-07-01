import type { JSONSchema7 } from "json-schema";

/**
 * NB: function that removes the `StandardContext` properties from a schema.
 */
export const removeStandardContextProperties = (
  schema: JSONSchema7 | undefined,
) => {
  if (!schema) {
    return undefined;
  }

  const { properties } = schema;

  if (!properties) {
    return schema;
  }

  const {
    me_personSlug,
    host,
    relation_personSlug,
    isExternalCall,
    authToken,
    ...propertiesWithoutStandardContext
  } = properties;
  const newSchema = { ...schema, properties: propertiesWithoutStandardContext };
  return newSchema;
};
