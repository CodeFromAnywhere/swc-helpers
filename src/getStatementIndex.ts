import fs from "fs";
import path from "path";
import { StatementIndex } from "./types/types.js";
export const getStatementIndex = async () => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    return null;
  }

  const statementIndexPath = path.join(
    projectRoot,
    "packages",
    "statement-index.json",
  );

  return readJsonFile<StatementIndex>(statementIndexPath);
};
