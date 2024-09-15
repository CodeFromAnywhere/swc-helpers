import { getStatementIndex } from "./getStatementIndex.js";
import path from "path";
import { projectRoot } from "edge-util";
import { getTypescriptFileData } from "./getTypescriptFileData.js";
import { StatementIndex, StatementIndexItem } from "./types/types.js";

let statementIndex: StatementIndex | null = null;

export const getStatementCodeString = async (
  statementName: string,
  operations: { [key: string]: string },
) => {
  if (!statementIndex) {
    statementIndex = await getStatementIndex();
  }

  const realStatementIndex = statementIndex!;
  if (!realStatementIndex) {
    return;
  }

  const item = realStatementIndex[statementName] as
    | StatementIndexItem
    | undefined;
  if (
    !item ||
    !item.packageCategory ||
    !item.packageName ||
    !item.operationRelativeFilePath
  ) {
    console.log("Incomplete statement-index: ", statementName, " (not found)");
    return;
  }

  const absolutePath = path.join(
    projectRoot,
    "packages",
    item.packageCategory,
    item.packageName,
    item.operationRelativeFilePath,
  );

  // now we have the absolute path of that statement, and we can find its imports

  const { imports, statements } = await getTypescriptFileData(
    operations,
    absolutePath,
  );

  const importedStatementNames = (imports || [])
    .filter((x) => !!x.isModuleFromMonorepo)
    .map((x) => x.name);

  const nonModuleImports = (imports || []).filter(
    (x) => !x.isModuleFromMonorepo,
  );

  return { statements, importedStatementNames, nonModuleImports };
};
