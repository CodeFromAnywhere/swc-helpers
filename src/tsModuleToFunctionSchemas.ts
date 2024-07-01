import {
  ArrowFunctionExpression,
  BindingIdentifier,
  Module,
  ModuleItem,
} from "@swc/core";
import { JSONSchema7 } from "json-schema";
import { notEmpty, onlyUnique2 } from "from-anywhere";
import { tsTypeToJsonSchema } from "./tsTypeToJsonSchema.js";

/**
 *
 */
export const tsModuleToFunctionSchemas = (module: Module) => {
  const modluleItems = module.body;

  const result = modluleItems
    .map((item) => {
      const arrowFunctionExpression =
        item.type === "ExportDeclaration" &&
        item.declaration.type === "VariableDeclaration"
          ? (item.declaration.declarations.find(
              (x) => x.init?.type === "ArrowFunctionExpression",
            )?.init as ArrowFunctionExpression | undefined)
          : undefined;

      if (!arrowFunctionExpression) {
        return;
      }

      const { params, returnType, typeParameters } = arrowFunctionExpression;

      if (!returnType) {
        return {
          isSuccessful: false,
          message: "Please specify the return type of your function explicitly",
          error: "returntype-needed",
          item,
        };
      }

      const functionParametersOrNot = params.map((param) => {
        if (param.type !== "Identifier") {
          return;
        }

        const identifier = param as BindingIdentifier;

        if (!identifier.typeAnnotation) {
          return;
        }

        const parseResult = tsTypeToJsonSchema(
          identifier.typeAnnotation.typeAnnotation,
          [],
        );
        return {
          parameter: {
            parameterName: identifier.value,
            required: !identifier.optional,
            schema: parseResult.schema,
          },
          references: parseResult.references,
        };
      });

      const hasEmpty = functionParametersOrNot.some((x) => x === undefined);

      if (hasEmpty) {
        return {
          isSuccessful: false,
          message: "This syntax isn't supported",
          error: "syntax-not-supported",
          item,
        };
      }

      const functionParameters = functionParametersOrNot as {
        parameter: {
          parameterName: string;
          required: boolean;
          schema: JSONSchema7;
        };
        references: string[];
      }[];

      const returnTypeResult = tsTypeToJsonSchema(
        returnType.typeAnnotation,
        [],
      );

      const allReferences = returnTypeResult.references
        .concat(functionParameters.map((x) => x.references).flat())
        .filter(onlyUnique2());

      return {
        isSuccessful: true,
        message: "Parsed",
        parse: {
          functionParameters: functionParameters.map((x) => x.parameter),
          returnTypeSchema: returnTypeResult.schema,
          references: allReferences,
        },
      };
    })
    .filter(notEmpty);

  const errors = result
    .filter((x) => !x.isSuccessful)
    .map(
      (x) =>
        x as {
          isSuccessful: boolean;
          message: string;
          error: string;
          item: ModuleItem;
        },
    );

  const functions = result.map((x) => x.parse).filter(notEmpty);

  return { isSuccessful: true, functions, errors };
};
