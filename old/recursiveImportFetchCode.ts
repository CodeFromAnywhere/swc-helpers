import path from "node:path";
import { notEmpty } from "from-anywhere";
import { getTypescriptData } from "../getTypescriptData.js";
import { getRelativeImportLocations } from "../getRelativeImportLocations.js";
import { SwcImport, SwcStatement } from "../types/types.js";
/**

DEPRECATED: Superseeded by `getStatementWithDependenciesRecursive`

Get the full code in a single file by merging everything we have across  the monorepo that's thought to be needed, and importing the things from external packages.

- search all ts files in "module"
- find exported statements in each file
- match if statement name matches with name
- if true, run `recursiveImportFetchCode` on that typescript file

TODO: Avoid recursive loops (do one-by-one and ensure to skip statements we have already)

ensure to generate a warning that returns duplicate names of external imports and statements that were omitted. start from `{ hadImportNameDuplicates: false, statementsHadDuplicates: false }`


I got a lot further, and got it almost working. However, the last things are not easy. 

There needs to be a refactor that ensures the codebase is clean enough so there goes nothing wrong. What is still not finished

- ensure no file contains end-dangles, as it could fuck up things 
- codebase cannot contain duplicate statement names
- create an e2e test to ensure that every file works independenty. can be done by parsing the file, getting the raw for every statement, and parsing that independently.
- create an e2e test to confirm that all imports are resolved
- improve the performance and remove the bugs, by extrahering the step of parsing all required operations, first.
- we can probably improve things by splitting up files with multiple statements into multiple files with a single statement each.

*/
export const recursiveImportFetchCode = async (
  projectRelativeTypescriptFilePath: string,
  projectRoot: string,
  alreadyPaths: string[] = [],
  operations: { [key: string]: string },
): Promise<{
  isSuccessful: boolean;
  statements?: SwcStatement[] | undefined;
  imports?: SwcImport[] | undefined;
}> => {
  const basePath = path.join(projectRoot, projectRelativeTypescriptFilePath);

  let newAlreadyPaths = [...alreadyPaths];

  if (newAlreadyPaths.includes(basePath)) {
    //console.log("already", basePath);
    return { isSuccessful: true, statements: [], imports: [] };
  }

  newAlreadyPaths = newAlreadyPaths.concat(basePath);

  // 1) uses swc to read the file content
  const typescriptData = await getTypescriptData({ basePath, operations });

  // console.log({ typescriptData });
  // 2) find imports in the file and their location
  const imports = typescriptData.imports;
  const importExternals = imports?.filter((x) => !x.isModuleFromMonorepo) || [];

  const relativeImportLocations = getRelativeImportLocations(imports);

  const relativePromises = relativeImportLocations.map(async (item) => {
    if (!item.absolutePath) {
      return;
    }

    const data = await getTypescriptData({
      basePath: item.absolutePath,
      operations,
    });

    const matchingStatement = data.statements?.find(
      (x) => x.name === item.name,
    );

    if (!matchingStatement || !matchingStatement.projectRelativePath) {
      return;
    }

    const code = await recursiveImportFetchCode(
      matchingStatement.projectRelativePath,
      projectRoot,
      newAlreadyPaths,
      operations,
    );

    return code;
  });

  const relativeStuff = relativePromises
    ? (await Promise.all(relativePromises)).filter(notEmpty)
    : [];

  const relativeImports =
    relativeStuff
      .map((x) => x.imports)
      .filter(notEmpty)
      .flat() || [];

  const relativeStatements =
    relativeStuff
      .map((x) => x.statements)
      .filter(notEmpty)
      .flat() || [];

  // console.log({ relativeImports: relativeImports?.length });
  const monorepoPromises = imports
    ?.filter((x) => x.isAbsolute && x.isModuleFromMonorepo && x.module)
    .map(async (item) => {
      const projectRelativeBasePath =
        operations[item.module as keyof typeof operations];

      const basePath = path.join(projectRoot, projectRelativeBasePath);

      const data = await getTypescriptData({
        operations,
        basePath,
      });

      const matchingStatement = data.statements?.find(
        (x) => x.name === item.name,
      );

      if (!matchingStatement || !matchingStatement.projectRelativePath) {
        return;
      }

      const code = await recursiveImportFetchCode(
        matchingStatement.projectRelativePath,
        projectRoot,
        newAlreadyPaths,
        operations,
      );

      return code;
    });

  const monorepoStuff = monorepoPromises
    ? (await Promise.all(monorepoPromises)).filter(notEmpty)
    : [];

  const monorepoImports =
    monorepoStuff
      .map((x) => x.imports)
      .filter(notEmpty)
      .flat() || [];

  const monorepoStatements =
    monorepoStuff
      .map((x) => x.statements)
      .filter(notEmpty)
      .flat() || [];

  const allImports = monorepoImports
    .concat(relativeImports)
    .concat(importExternals);

  const allStatements = monorepoStatements
    .concat(relativeStatements)
    .concat(typescriptData.statements || []);

  return {
    isSuccessful: true,
    imports: allImports,
    statements: allStatements,
  };

  // 3) open those files of operation imports, remove the imports, and repeat this process
  // 4) when done, add all files together, without monorepo imports
};
