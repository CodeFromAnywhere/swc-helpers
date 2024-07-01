import { getProjectRoot } from "from-anywhere/node";
import { recursiveImportFetchCode } from "./recursiveImportFetchCode.js";
import { onlyUnique2 } from "from-anywhere";
import { SwcImport, SwcStatement } from "../types/types.js";
/**
 * DEPRECATED: superseded by getStatementWithDependenciesRecursive
 */
export const getSingleCodeString = async (
  basePath: string,
  operations: { [key: string]: string },
) => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    console.log("NO projectroot");
    return;
  }

  const result = await recursiveImportFetchCode(
    basePath,
    projectRoot,
    undefined,
    operations,
  );

  // console.log({ result });

  const externalImports =
    result.imports?.filter((x) => !x.isModuleFromMonorepo) || [];

  const allExternalImportsOnce = externalImports.filter(
    onlyUnique2<SwcImport>(
      (a, b) => a.module === b.module && a.name === b.name,
    ),
  );

  const uniqueExternalImports = allExternalImportsOnce.filter(
    onlyUnique2<SwcImport>((a, b) => a.name === b.name),
  );

  const importExternalsString = uniqueExternalImports
    ?.map((x) => `import { ${x.name} } from "${x.module}";`)
    .join("\n");

  const allStatementsOnce =
    result.statements?.filter(
      onlyUnique2<SwcStatement>(
        (a, b) => a.absolutePath === b.absolutePath && a.name === b.name,
      ),
    ) || [];

  const uniqueStatements = allStatementsOnce.filter(
    onlyUnique2<SwcStatement>((a, b) => a.name === b.name),
  );

  // console.log({
  //   hadImportNameDuplicates:
  //     allExternalImportsOnce.length !== uniqueExternalImports.length,
  //   statementsHadDuplicates:
  //     uniqueStatements.length !== allStatementsOnce.length,
  // });

  const statementsString = uniqueStatements
    .map(
      (x) => `// ${x.name}

${x.raw}

// ${x.name} END`,
    )
    .join("\n");

  return `${importExternalsString}${statementsString}`;
};
