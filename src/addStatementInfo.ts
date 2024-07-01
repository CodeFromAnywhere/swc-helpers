import { OperationClassification } from "from-anywhere/types";
import { pascalCase } from "from-anywhere";
import { path } from "from-anywhere/node";
import { removeOptionalKeysFromObjectStrings } from "from-anywhere";
import { SchemaItem, TypeInfo } from "from-anywhere/types";
import { getSchema, simplifySchema } from "schema-helpers";
import { tryJsonStringify } from "from-anywhere";
import { statementNoSpecialFileFilter } from "./convention/findDuplicateNames.js";
import { getParametersFromSchema } from "./getParametersFromSchema.js";
import { tryRequire } from "./tryRequire.js";
import { getPossibleRefs } from "./getPossibleRefs.js";
import {
  SwcStatement,
  SwcFunction,
  SwcInterface,
  SwcVariable,
} from "./types/types.js";

/** Contains some conventions to add certain data to the SwcStatement */
export const addStatementInfo = async (
  item: SwcStatement,
  absoluteOperationPathsInScope: string[],
  operationClassificationObject: {
    [x: string]: OperationClassification | undefined;
  },
  operationSchemaObject: {
    [x: string]: SchemaItem[] | undefined;
  },
) => {
  const operationPath = absoluteOperationPathsInScope.find((p) =>
    item.absolutePath?.startsWith(`${p}/`),
  );

  if (!operationPath) {
    //  console.log(`item`, item.absolutePath);
    //shouldn't happen
    return;
  }

  // NB: should be the name of the operation by convention
  const operationFolderName = path.parse(operationPath).base;
  const packageCategory = path.parse(path.parse(operationPath).dir).base;

  // console.log({ operationPath, operationFolderName, packageCategory });
  const schemaItems = operationSchemaObject[operationPath];
  const operationClassification = operationClassificationObject[operationPath];

  const fullSwcStatement: SwcStatement = {
    ...item,
    packageCategory,
    packageName: operationFolderName,
    operationClassification,
  };

  // NB: this slows down everything a lot
  const isRequireEnabled = true;
  // NB: add function and config for functions, and statement for variables
  // NB: I can't do ESM modules in this CJS module. Other way around may be possible, but that limits where I can use it further...
  if (item.isExported && isRequireEnabled) {
    // NB:
    const isImportable = operationClassification
      ? ["cjs"].includes(operationClassification)
      : false;

    const isImportRequired = statementNoSpecialFileFilter(item);

    const file =
      isImportable && item.absolutePath && isImportRequired
        ? await tryRequire(item.absolutePath)
        : undefined;

    /// console.log({ name: item.name, isImportable });
    // attach function, config, and statement from the file, directly, if possible.
    if (isImportable && item.modelName === "SwcFunction") {
      // (fullSwcStatement as SwcFunction).function = file?.[item.name];

      //b  console.log({ name: item.name, config: file?.[item.name]?.config });

      (fullSwcStatement as SwcFunction).config = file?.[item.name]?.config;

      // console.log(`found ${item.name}`, {
      //   file,
      //   statement: file?.[item.name],
      //  });
    }

    if (isImportable && item.modelName === "SwcVariable") {
      const canStringify = !!tryJsonStringify(file?.[item.name]);
      if (canStringify) {
        // NB: only put it there if it can be stringified
        (fullSwcStatement as SwcVariable).statement = file?.[item.name];
      }
    }
  }

  //NB: if it's a function, add parameters and namedParameters here.
  if (fullSwcStatement.modelName === "SwcFunction") {
    const fullSwcFunction = fullSwcStatement as SwcFunction;

    const responseInterfaceName = `${pascalCase(fullSwcFunction.name)}Response`;
    const responseDefinitions = schemaItems?.find(
      (x) => x.name === responseInterfaceName,
    )?.schema?.definitions;
    const responseSchema = responseDefinitions?.[responseInterfaceName];

    const responseOtherDefs = responseDefinitions
      ? removeOptionalKeysFromObjectStrings(responseDefinitions, [
          responseInterfaceName,
        ])
      : undefined;

    if (responseSchema !== false && responseSchema !== true) {
      fullSwcFunction.returnType = { schema: responseSchema };
    }

    // Now named parameters

    const namedParametersName = `NamedParameters<typeof ${fullSwcFunction.name}>`;
    const namedParametersItem = schemaItems?.find(
      (x) => x.name === namedParametersName,
    );
    const defs = namedParametersItem?.schema?.definitions;

    const otherDefs = defs
      ? removeOptionalKeysFromObjectStrings(defs, [namedParametersName])
      : undefined;

    fullSwcFunction.otherDefs = { ...otherDefs, ...responseOtherDefs };

    fullSwcFunction.namedParameters = namedParametersItem;

    fullSwcFunction.parameters = getParametersFromSchema(
      namedParametersItem,
      fullSwcFunction.name,
    );

    return fullSwcFunction;
  }

  // NB: add typeinfo under type for interfaces
  if (fullSwcStatement.modelName === "SwcInterface") {
    const fullSwcInterface = fullSwcStatement as SwcInterface;

    const schemaItem = schemaItems?.find(
      (x) => x.name === fullSwcInterface.name,
    );

    const typeDefinition = getSchema(
      schemaItem?.schema?.definitions?.[fullSwcInterface.name],
    );
    const simplifiedSchema =
      schemaItem && typeDefinition
        ? simplifySchema(
            fullSwcInterface.name,
            typeDefinition,
            getPossibleRefs(schemaItem),
            [],
          )
        : undefined;
    const typeInfo: TypeInfo = {
      isArray: false,
      isEnum: false,
      isEnumLiteral: false,
      isObject: false,
      isPrimitive: false,
      rawType: "",
      typeCoverage: 0,
      typeDefinition,
      simplifiedSchema,
    };

    fullSwcInterface.type = typeInfo;

    return fullSwcInterface;
  }
  return fullSwcStatement;
};
