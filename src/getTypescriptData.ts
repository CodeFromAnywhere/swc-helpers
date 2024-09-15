import { getProjectRoot } from "edge-util";
import { notEmpty } from "edge-util";
import { TypescriptFileConfig } from "./TypescriptFileConfig.js";
import { findTypescriptFiles } from "./findTypescriptFiles.js";
import { getTypescriptFileData } from "./getTypescriptFileData.js";
import { SwcImport, SwcStatement } from "./types/types.js";
/**
Function that parses Typescript in real time so it's super easy to work with code

NB: this doesn't get all stats and extra data sources like `getStatements`! it just simplifies the swc-parse that is done on the code in realtime. It can do 3MB of code in under 500MS on an M1, which is pretty spectacular... I wonder how it will be in bun ^^
 */
export const getTypescriptData = async (
  config: {
    operations: { [key: string]: string };
    /**
     * File or folder path containing typescript code (.ts, .tsx)
     *
     * By default, will use project root
     */
    basePath: string | string[] | undefined;
    /**
     * function to filter files based on their path
     */
    pathFilter?: (absolutePath: string) => boolean;
  } & TypescriptFileConfig,
): Promise<{
  isSuccessful: boolean;
  message: string;
  statements: SwcStatement[];
  imports: SwcImport[];
}> => {
  const {
    pathFilter,
    swcParseFilter,
    // TypescriptFileConfig stuff
    basePath,
    rawFilter,
    operations,
  } = config;

  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    return {
      isSuccessful: false,
      message: "No projectRoot",
      statements: [],
      imports: [],
    };
  }

  // 1) find all ts(x) files in basePath
  const absoluteTypescriptFilePaths = await findTypescriptFiles(
    operations,
    basePath,
  );

  // 2) apply filters based on path, raw, and swc parse
  const pathsFiltered = pathFilter
    ? absoluteTypescriptFilePaths.filter(pathFilter)
    : absoluteTypescriptFilePaths;

  // 3) find all statements for each file separately

  const results = await Promise.all(
    pathsFiltered.map((absolutePath) =>
      getTypescriptFileData(operations, absolutePath, {
        swcParseFilter,
        rawFilter,
      }),
    ),
  );

  const statements = results
    .map((x) => x.statements)
    .filter(notEmpty)
    .flat();

  const imports = results
    .map((x) => x.imports)
    .filter(notEmpty)
    .flat();

  return { isSuccessful: true, message: "Got it", statements, imports };
};
