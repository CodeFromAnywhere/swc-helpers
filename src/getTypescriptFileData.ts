//goal: fix all broken imports, then rebuild everything in the right order
import { getProjectRoot } from "edge-util";
import { destructureOptionalObject } from "edge-util";
import { TypescriptFileConfig } from "./TypescriptFileConfig.js";
import { getSwcFunctions } from "./getSwcFunctions.js";
import { getSwcImports } from "./getSwcImports.js";
import { getSwcInterfaces } from "./getSwcInterfaces.js";
import { getSwcVariables } from "./getSwcVariable.js";
import { trySwcParseFile } from "./trySwcParseFile.js";
import { SwcStatement, TypescriptFileData } from "./types/types.js";

/**
 Returns the `TypescriptInstance`[] for a piece of typescript code, using swc to parse it.

 TODO: get the playground for some of my own files, until I understand well enough how the AST works. isn't there a SWC vscode plugin, in the meantime?

 */
export const getTypescriptFileData = async (
  operations: { [key: string]: string },
  absolutePath: string,
  // code?:string,
  config?: TypescriptFileConfig,
): Promise<
  {
    isSuccessful: boolean;
    message?: string;
  } & Partial<TypescriptFileData>
> => {
  const projectRoot = getProjectRoot();

  // const src = code
  //   ? code
  //   : absolutePath && fs.existsSync(absolutePath)
  //   ? await fs.readTextFile(absolutePat)
  //   : undefined;

  // if (!src) {
  //   return { isSuccessful: false, message: "No src provided" };
  // }

  const { rawFilter, swcParseFilter } = destructureOptionalObject(config);

  // if (rawFilter?.(src) === false) {
  //   return { isSuccessful: true, message: "Filtered out" };
  // }

  const result = await trySwcParseFile(absolutePath);

  if (!result.result) {
    console.log({ result });
    return { isSuccessful: result.isSuccessful, message: result.message };
  }

  const fileParse = result.result;
  const swcModuleItems = fileParse.body;

  // console.dir(fileParse, { depth: 4 });
  if (swcParseFilter?.(swcModuleItems) === false) {
    return { isSuccessful: true, message: "Filtered out by swc parse filter" };
  }

  const fileSpan = result.result.fileSpan;

  //  console.log({ fileSpan });
  // 1) get all things we need to attach to the instances
  const imports = getSwcImports(
    result.result.src,
    swcModuleItems,
    absolutePath,
    projectRoot,
    fileSpan,
    operations,
  );

  // 2) get the instances we usually have at the fileroot
  const swcFunctions: SwcStatement[] = getSwcFunctions(
    swcModuleItems,
    absolutePath,
    projectRoot,
    fileSpan,
  );

  const swcVariables = getSwcVariables(
    result.result.src,
    swcModuleItems,
    absolutePath,
    projectRoot,
    fileSpan,
  );

  const swcInterfaces = getSwcInterfaces(
    result.result.src,
    swcModuleItems,
    absolutePath,
    projectRoot,
    fileSpan,
  );

  // 3) attach comments and imports to the statements, until they are all gone.
  // NB: todo

  // 4) put it all together
  const statements: SwcStatement[] = swcInterfaces
    .concat(swcVariables)
    .concat(swcFunctions);

  // NB: let's keep the order in `getTypescriptFileData` 100% correct. As some variables may sometimes call functions, it's important to not forget this and sort afterwards by starting line.
  const sortedStatements = statements.sort((a, b) => a.start - b.start);

  return { statements: sortedStatements, imports, isSuccessful: true };
};
