import fs from "fs";
import path from "path";
import { readJsonFile } from "edge-util";
import { makeRelative } from "edge-util";
import { getOperationClassification, getProjectRoot } from "edge-util";
import {
  createMappedKeysObject,
  createPromisedMappedKeysObject,
  makeArray,
  notEmpty,
  onlyUnique2,
} from "edge-util";
import { findOperationsInScope } from "edge-util";
import { SchemaItem } from "edge-util";
import { SwcImport, SwcStatement } from "./types/types.js";
import { tryParseJson } from "edge-util";
import { addStatementInfo } from "./addStatementInfo.js";
import { getTypescriptData } from "./getTypescriptData.js";
import { storeResult } from "./storeResult.js";
import { GetSwcStatementsFilter } from "./types/GetSwcStatementsFilter.js";

/**

Fetch all functions and attach config and function to it if requested

NB: please note that this gives a huge advantage as it does not require the SDK to embed the function. We need to be careful about this, however, since it can be slow with large amount of functions, also loops might occur if you need a function that uses the db stuff. Therefore, it can be disabled by stating "omitRequire" in the filter.


# THOUGHTS

Now I think we have all we need for getting rid of TsInterface and TsFunction, and with that basically anything legacy. This is a huge cleanup.

Potentially I can now make everything execute in the frontend, for example for validation and generating forms! This would be insane.

 */
export const getStatements = async (
  operations: { [key: string]: string },
  filter?: GetSwcStatementsFilter,
): Promise<{ statements?: SwcStatement[]; imports?: SwcImport[] }> => {
  const projectRoot = getProjectRoot();

  if (!projectRoot) {
    return { statements: undefined, imports: undefined };
  }

  // NB: shouldn't be hardcoded like this but also should be efficient!
  const projectRelativeToolsPath = "packages";
  const absoluteToolsPath = path.join(projectRoot, projectRelativeToolsPath);

  const projectRelativeBasePaths = filter?.projectRelativeBasePath
    ? makeArray(filter.projectRelativeBasePath)
    : [projectRelativeToolsPath];

  const absoluteOperationPathsInScope = (
    await Promise.all(
      projectRelativeBasePaths.map((projectRelativeBasePath) => {
        return findOperationsInScope(
          path.join(projectRoot, projectRelativeBasePath),
        );
      }),
    )
  )
    .filter(notEmpty)
    .flat()
    .filter((x) => {
      if (!fs.existsSync(x)) {
        console.log(
          "found weird nonexisting path after `findOperationsInScope`",
          x,
        );
        return false;
      }
      return true;
    })
    .filter(onlyUnique2());

  const absoluteBasePaths = projectRelativeBasePaths.map((p) =>
    path.join(projectRoot, p),
  );

  // console.log({ absoluteBasePaths, absoluteOperationPathsInScope });

  if (!absoluteOperationPathsInScope) {
    // Must have some operations in scope
    return { imports: [], statements: [] };
  }

  if (filter?.isCacheDisabled) {
    // NB: if you don't cache, go directly to the real typescript code, and attach all required information

    const operationClassificationObject = createMappedKeysObject(
      absoluteOperationPathsInScope,
      (key) => getOperationClassification(key),
    );

    // console.log({ operationClassificationObject });

    //for each operation in scope, get the schema json file. NB: this does many file reads at once, but prevents doing it even more (for each item)
    const operationSchemaObject = await createPromisedMappedKeysObject(
      absoluteOperationPathsInScope,
      async (absoluteOperationPath) => {
        const absoluteSchemaFilePath = path.join(
          absoluteOperationPath,
          "schema.json",
        );

        const schemaItemsString = fs.existsSync(absoluteSchemaFilePath)
          ? await fs.readTextFile(absoluteSchemaFilePath)
          : undefined;

        const schemaItems: SchemaItem[] | undefined = schemaItemsString
          ? tryParseJson<SchemaItem[]>(schemaItemsString) || undefined
          : undefined;

        return schemaItems;
      },
    );

    const { statements, imports } = await getTypescriptData({
      operations,

      basePath: absoluteBasePaths,
    });

    // console.log({ absoluteOperationPathsInScope });

    const finalImports = imports
      .map((item) => {
        const operationPath = absoluteOperationPathsInScope.find((p) =>
          item.absolutePath?.startsWith(`${p}/`),
        );

        if (!operationPath) {
          //shouldn't happen
          return;
        }

        const operationClassification =
          operationClassificationObject[operationPath];

        const finalSwcImport: SwcImport = {
          ...item,
          // NB: should be the name of the operation by convention
          packageName: `${path.parse(operationPath).base}`,
          operationClassification,
        };

        return finalSwcImport;
      })
      .filter(notEmpty);

    const finalStatements = (
      await Promise.all(
        statements.map((item) =>
          addStatementInfo(
            item,
            absoluteOperationPathsInScope,
            operationClassificationObject,
            operationSchemaObject,
          ),
        ),
      )
    ).filter(notEmpty);

    if (statements.length !== finalStatements.length) {
      console.log("WTF things got filtered out", {
        absoluteOperationPathsInScope,
        // absoluteOperationPaths,
        statementsLength: statements.length,
        finalStatementsLength: finalStatements.length,
        importsLength: imports.length,
        finalImportsLength: finalImports.length,
      });
    }
    // await writeToAssets(__filename, finalImports, "all-imports.json");

    // await writeToAssets(__filename, finalStatements, "all-statements.json");

    await storeResult({
      finalImports,
      finalStatements,
      projectRelativeBasePath: filter?.projectRelativeBasePath,
      absoluteOperationPathsInScope,
    });

    return { statements: finalStatements, imports: finalImports };
  }

  // If cache is not disabled (IS ENABLED), just get it from here
  const result = await Promise.all(
    absoluteOperationPathsInScope.map(async (absoluteOperationPath) => {
      const statementsPath = path.join(
        absoluteOperationPath,
        "statements.json",
      );
      const importsPath = path.join(absoluteOperationPath, "imports.json");
      const statements = await readJsonFile<SwcStatement[]>(statementsPath);
      const imports = await readJsonFile<SwcImport[]>(importsPath);

      if (statements && imports) {
        return { statements, imports };
      }

      return { notFoundAbsoluteOperationPath: absoluteOperationPath };
    }),
  );

  const notFoundAbsoluteOperationPaths = result
    .map((x) => x.notFoundAbsoluteOperationPath)
    .filter(notEmpty)
    // NB: added because of a bug in bun.js
    .filter((p) => fs.existsSync(p));

  if (notFoundAbsoluteOperationPaths.length > 0) {
    console.log(
      `Not found operations: ${notFoundAbsoluteOperationPaths.length} (Going to get them now without cache)`,
      notFoundAbsoluteOperationPaths,
    );
  }

  // if not found, get it parsed.

  const projectRelativeBasePath = notFoundAbsoluteOperationPaths.map((x) =>
    makeRelative(x, projectRoot),
  );
  // console.log({ projectRelativeBasePath });
  const notFoundResult =
    notFoundAbsoluteOperationPaths.length > 0
      ? await getStatements(operations, {
          projectRelativeBasePath,
          isCacheDisabled: true,
        })
      : {};

  const statements = result
    .map((x) => x.statements)
    .filter(notEmpty)
    .flat()
    .concat(notFoundResult.statements || []);
  const imports = result
    .map((x) => x.imports)
    .filter(notEmpty)
    .flat()
    .concat(notFoundResult.imports || []);

  // console.log("3", { projectRelativeBasePaths, absoluteOperationPathsInScope });

  return { statements, imports };
};
