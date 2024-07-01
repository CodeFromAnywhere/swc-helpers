import path from "node:path";
import { getProjectRoot, readJsonFile } from "from-anywhere/node";
import { getStatementIndex } from "./getStatementIndex.js";
import { StatementIndex, SwcStatement } from "./types/types.js";
let statementIndex: StatementIndex | null = null;

/**
 * NB: assumes server restarts after statements are changed!
 */
export const getIndexedSwcStatement = async <T extends SwcStatement>(
  statementName: string,
): Promise<T | undefined> => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    return;
  }

  const json = statementIndex || (await getStatementIndex());

  if (json && !statementIndex) {
    statementIndex = json;
  }

  if (!json) {
    return;
  }

  const value = json[statementName];

  if (!value || !value.packageCategory || !value.packageName) {
    return;
  }

  const statementsPath = path.join(
    projectRoot,
    "packages",
    value.packageCategory,
    value.packageName,
    "statements.json",
  );

  const statements = await readJsonFile<T[]>(statementsPath);
  if (!statements) {
    return;
  }

  const statement = statements.find((x) => x.name === statementName);

  if (!statement) {
    return;
  }

  return statement;
};
