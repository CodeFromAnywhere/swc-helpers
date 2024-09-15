import { SwcImport } from "./types/types.js";
import { getStatementCodeString } from "./getStatementCodeString.js";
import { mergeObjectsArray, notEmpty } from "edge-util";

/**
This recursive function gets a full list of all required statements including the unretreiveable statements as depdendencies, of any statement.

Important to note:

- Preceeded by earlier attempts: `getSingleCodeString` and `recursiveImportFetchCode`
- Uses the direct typescript code for finding the statements (except for that it also uses the statement-index of the entire codebase)
- relies heavily on `statement-index.json` which is assumed to have all up-to-date locations of statements. This is useful because normally we'd only have the package and name of a statement by the import but now we have the exact file.
- Assumes there are no emojis in the code! Big assumption but if there are, there may be difficulties retaining the raw codestring index correclty!
- Assumes the entire monorepo has no duplicate naming, not even in imports of other modules!

TODO:

-

Solved issues:

- Block-scoped variable 'dbStorageMethodsConst' used before its declaration.ts(2448) --> Fixed by reversing the statements

- the named import `parse` occurs twice, both from `node:fs` and from `@swc/core`. Fixed this by doing a named import instead

- There were a lot of things wrong in the `statement-index.json` file, but after this was fixed, it was solved

- non-exported `let` and `const` (and probably `var`) variables seem not to be found as statements. I've made them available now, they're now parsed and found as statements by my SWC parser

- "Cannot access uninitialized variable". The order in which the statements get on paper matters! Let's be presise about it. 

1. let's keep the order in `getTypescriptFileData` 100% correct. As some variables may sometimes call functions, it's important to not forget this and sort afterwards by starting line
2. afterwards, order is carefully maintained

*/
export const getStatementWithDependenciesRecursive = async (
  operations: { [key: string]: string },
  statementName: string,
  already: string[] = [],
): Promise<
  | { statements: { [statementName: string]: string }; imports: SwcImport[] }
  | undefined
> => {
  if (already.includes(statementName)) {
    console.log("Loop detected", statementName, already);
    return;
  }

  const result = await getStatementCodeString(statementName, operations);

  if (!result) {
    return;
  }

  if (!result.statements?.length) {
    console.log("No statements found: ", statementName);
    return;
  }

  // console.log(
  //   `level ${already.length + 1}, ${
  //     result.importedStatementNames.length
  //   } imported`,
  // );

  const results = (
    await Promise.all(
      result.importedStatementNames.map(async (x) => {
        const newAlready = already.concat([statementName]);
        return getStatementWithDependenciesRecursive(operations, x, newAlready);
      }),
    )
  ).filter(notEmpty);

  const newStatements = mergeObjectsArray(results.map((x) => x.statements));
  const newImports = results.map((x) => x.imports).flat();

  const imports = result.nonModuleImports.concat(newImports);

  const thisStatementCodes = mergeObjectsArray(
    result.statements.map((x) => ({ [x.name]: x.raw })),
  );

  // NB: the order of entry of the statements in the codefile is maintained here, with the imports coming above the statements in the file.
  const statements = {
    ...newStatements,
    ...thisStatementCodes,
  };

  return { statements, imports };
};
