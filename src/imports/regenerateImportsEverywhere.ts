import { getTypescriptData } from "../getTypescriptData.js";
import { regenerateImports } from "./regenerateImports.js";
import { getObjectKeysArray } from "from-anywhere";
import { onlyUnique2 } from "from-anywhere";
import { getRelativeLinkPath } from "from-anywhere/node";
import { withoutExtension } from "from-anywhere";
import { statementNoSpecialFileFilter } from "../convention/findDuplicateNames.js";
import { SwcImport } from "../types/types.js";
/**
Scan all monorepo files within basePath(s)

Go over every file: look if imports that were stated actually seem to be correct, or not. If not, find the statement in the list with the same name, and replace the import with a correct import.

Policy:

- Run buildEverythingInRightOrder
- Run this after big refactors (moving files around in the fs). 
- Ensures all imports are correct based on the detected location of all functions/interfaces/variables.

Please note:
- it does not work if it imports from a non-existing package. Therefore, ensure to move the function away from a package first, before actually removing the entire package.
- it doesn't do anything for imports from non-monorepo packages
- it doens't do anything if the name of the statement changed. Only same name, different location.

# Import updates

When recreating imports, have the ability to:

1. Alter any renamed package or renamed function or moved function.
2. List all altered packages and rebuild them in the right order

Recipes (less important):

- rename package: find all ts-files that import this as module, update this to new name, build all packages in right order
- rename function: find all ts-files that import the function from monorepo, update the import there, but also update functionName( or functionName< to `newFunctionName</(` in the same file. In the same package, we need to also change the filename if this didn't happen yet, and also import the new function name from the new relative file location.
- move function to other package: you get the idea

It's hard:

Testcases:

- There's a file dangle at the end or at the start and the raw is incorrect.
- There are imports that aren't from monorepo
- Imports of JSON files, images, css, etc
- Same import commented out, above actual import

*/

export const regenerateImportsEverywhere = async (
  operations: { [key: string]: string },
  basePath?: string | string[] | undefined,
  isDryrun?: boolean,
): Promise<
  | undefined
  | {
      unresolved: string[];
      duplicates: string[];
      updatedAmount: number;
      result?: {
        absolutePath: string;
        needsUpdate: boolean;
        difference?: string;
      }[];
    }
> => {
  // NB: all statements are needed no matter where the things are regenerated
  const { statements } = await getTypescriptData({
    basePath: undefined,
    operations,
  });
  if (!statements) {
    return;
  }
  const realStatements = statements.filter(statementNoSpecialFileFilter);

  const unresolved: string[] = [];
  const duplicates: string[] = [];

  const updateImport = (item: SwcImport) => {
    // console.log(`Import:`, item);
    if (!item.absolutePath || !item.projectRelativePath) {
      // shouldn't happen
      console.log("ERR: got no paths for import");
      return item;
    }

    if (item.isAbsolute && !item.isModuleFromMonorepo) {
      // No need to change this, ever
      // console.log({ item });
      return item;
    }

    const statementsForThisImport = realStatements.filter(
      (x) => x.name === item.name,
    );

    if (statementsForThisImport.length === 0) {
      //console.log("Can't find:", item.name);
      unresolved.push(item.name);
      return item;
    }

    if (statementsForThisImport.length > 1) {
      // console.log(
      //   `Dup${item.name})`,
      //   statementsForThisImport.map((x) => x.absolutePath)
      // );
      duplicates.push(item.name);
      return item;
    }

    const statementForThisImport = statementsForThisImport[0];

    if (
      !statementForThisImport.absolutePath ||
      !statementForThisImport.projectRelativePath
    ) {
      // shouldn't happen
      console.log("ERR: got no paths for statement");

      return item;
    }

    const packageNameOfStatement = getObjectKeysArray(operations).find((key) =>
      statementForThisImport.projectRelativePath!.startsWith(
        `${operations[key]}/`,
      ),
    );

    const packageNameOfImport = getObjectKeysArray(operations).find((key) =>
      item.projectRelativePath!.startsWith(`${operations[key]}/`),
    );

    if (!packageNameOfStatement || !packageNameOfImport) {
      // shouldn't happen
      console.log("ERR: got no packagenames. Try 'generateOperationsSdk'", {
        packageNameOfImport,
        packageNameOfStatement,
      });

      return item;
    }

    const isAbsolute = packageNameOfImport !== packageNameOfStatement;

    const relativePath = `${withoutExtension(
      getRelativeLinkPath(
        item.absolutePath,
        statementForThisImport.absolutePath,
      ),
    )}.js`;

    const module = isAbsolute ? packageNameOfStatement : relativePath;

    if (module === item.module) {
      // nothing changed

      return item;
    }

    const newImport: SwcImport = { ...item, module, isAbsolute };

    console.log(
      item.projectRelativePath,
      `import { ${item.name} } from "${item.module}" -> "${module}"`,
    );

    return newImport;
  };

  const result = await regenerateImports(
    operations,
    basePath,
    updateImport,
    isDryrun,
  );

  const updatedAmount =
    result?.map((x) => x.needsUpdate).filter((x) => !!x).length || 0;

  return {
    updatedAmount,
    unresolved: unresolved.filter(onlyUnique2()),
    duplicates: duplicates.filter(onlyUnique2()),
    result,
  };
};
