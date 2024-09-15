import { FunctionParameter } from "edge-util";
import { notEmpty } from "edge-util";
import { SchemaItem } from "edge-util";
import { getSchema } from "schema-helpers";
import { simplifySchema } from "schema-helpers";
import { removeStandardContextProperties } from "./custom/removeStandardContextProperties.js";
import { getPossibleRefs } from "./getPossibleRefs.js";

/**
 * NB: this function also removes parameters not needed in the api (things from StandardContext) as it is intended to be used for rendering function forms
 */
export const getParametersFromSchema = (
  schemaItem: SchemaItem | undefined,
  functionName: string,
): FunctionParameter[] | undefined => {
  if (!schemaItem) {
    return undefined;
  }
  const propertyName = `NamedParameters<typeof ${functionName}>`;
  const namedParameters = getSchema(
    schemaItem.schema?.definitions?.[propertyName],
  );

  const properties = namedParameters?.properties;

  if (!properties) {
    return undefined;
  }

  /*
    NB: this is how a named parameters typeDefinition looks for a function with 2 arguments
    {
      "type": "object",
      "properties": {
        "markdownString": { "type": "string" },
        "level": { "type": "number" }
      },
      "required": ["markdownString", "level"],
      "additionalProperties": false
    }
    */

  const parameters: FunctionParameter[] = Object.keys(properties)
    .map((name) => {
      const propertySchema = getSchema(properties[name]);
      const propertySchemaWithoutStandardContext =
        name === "context"
          ? removeStandardContextProperties(propertySchema)
          : propertySchema;

      const required = namedParameters?.required?.includes(name) || false; // schemaItem.schema?.required?.includes(name) || false;

      const functionParameter: FunctionParameter | undefined =
        propertySchemaWithoutStandardContext
          ? {
              name,
              schema: propertySchemaWithoutStandardContext,
              simplifiedSchema: simplifySchema(
                name,
                propertySchemaWithoutStandardContext,
                getPossibleRefs(schemaItem),
                [],
              ),
              required,
            }
          : undefined;

      return functionParameter;
    })
    .filter(notEmpty);

  return parameters;
};
