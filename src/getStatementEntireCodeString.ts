import { mergeObjectsArray, notEmpty, onlyUnique2 } from "edge-util";
import { getStatementWithDependenciesRecursive } from "./getStatementWithDependenciesRecursive.js";
import { SwcImport } from "./types/types.js";

/**
Relies on `getStatementWithDependenciesRecursive` to create an entire codestring for multiple statements.

This can be useful to create a single file for multiple statements (e.g. for one or more packages)

# NB

NB: Not stable yet. When trying for example with `AgGridInteractive` I get lots of weird cut-offs, some duplicate naming, and a handful of other small issues. It can be done maybe, but maybe its too hard at the moment, the codebase is still too messy. Lets first clean things up (weekx) before I start using this for such serious things. Maybe smaller ones work though!

# TODO

- augment this function so I can give a basePath. BasePath --> all operations that are relevant -> all statements there-in (via direct .ts swc parse) that are non-test and non-cli

- For external dependencies, ensure the name + version is known. Needs to be backtracked to where the import came from. Ideally this information is available in the `SwcImport` already.

- Also, let's make `getTypescriptFileData` indepdendent of my `sdk-operations`. Instead, just require a `string[]` of my own monorepo-dependencies.

- Allow for an extension that keeps all the `.test` and `.cli` files except that it replaces the imports with `import XYZ from "./js.js";`. This way, clis can still function fully.

- Use an alteration of `newOperationWithFiles` to turn the resulting monorepo-bundle into a single package with the right dependencies. Ensure it has the option to output `.js` only by building the `.ts` with `tsc` and removing the original ts files.

- Expose this as a CLI/function in SWC-UTIL, ensuring all code ends up as standalone package with a given name that can easily be published and deployed.

- Now try to make some packages: swc-util + development, actionschema-homeserver, etc.

# Thoughts

This is a lot of work, but extremely fun and interesting for some reason. Imagine the power of this functionality! I would be able to bundle anything on the function level, without worrying about how it's structured. At some point, we could even reduce the solo file further by removing unused stuff and asking AI to simplify. On a fundamental level, a single typescript file is a lot simpler to work with than an entire codebase with imports everywhere. Removing the whole complexity of imports removes loads of compexity, and creates new possibilities!

If I can scale this into a more reliable and more simple way of deployment, I can deploy much more code! Not only is this useful for sharing, it's also great for generative AI and potentially edge deployments. Imagine AI 100x as powerful or cheap as the current stuff. Having all my code in a database is super powerful. Imagine doing a refactor from fsorm to actionschema with a prompt! This'd be next level and can totally be done.
 
*/
export const getStatementEntireCodeString = async (
  operations: { [key: string]: string },

  statementNames: string[],
) => {
  const results = (
    await Promise.all(
      statementNames.map((statementName) =>
        getStatementWithDependenciesRecursive(operations, statementName),
      ),
    )
  ).filter(notEmpty);

  if (results.length === 0) {
    return;
  }

  const imports = results
    .map((x) => x.imports)
    .flat()
    .filter(onlyUnique2<SwcImport>((a, b) => a.name === b.name));

  const statements = mergeObjectsArray(results.map((x) => x.statements));

  // NB: as order is maintained now, no need for reversal
  const allStatements = Object.keys(statements);

  const fullCode = allStatements.reduce((previous, key) => {
    const code = statements[key];

    return `${previous}

${code}`;
  }, "");

  const importsCode = imports
    .map(
      (x) =>
        `import ${x.isDefaultImport ? x.name : `{ ${x.name} }`} from "${
          x.module
        }";`,
    )
    .join("\n");

  const entireCode = `${importsCode}
      
${fullCode}`;

  return entireCode;
};
