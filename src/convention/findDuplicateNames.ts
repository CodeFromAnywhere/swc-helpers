import { onlyDuplicates } from "edge-util";
import { onlyUnique } from "edge-util";
import { sum } from "edge-util";
import { getTypescriptData } from "../getTypescriptData.js";
import { SwcStatement } from "../types/types.js";
export const statementNoSpecialFileFilter = (x: SwcStatement) => {
  if (!x.absolutePath) {
    return false;
  }

  if (
    [
      ".test.ts",
      ".cli.ts",
      "/test.ts",
      "/cli.ts",
      "/test.tsx",
      "/cli.tsx",
      ".test.tsx",
      ".cli.tsx",
      ".native.ts",
      ".native.tsx",
      ".ios.ts",
      ".ios.tsx",
      ".android.ts",
      ".android.tsx",
    ].find((ending) => x.absolutePath!.endsWith(ending))
  ) {
    return false;
  }

  return true;
};
/**
# Solve for duplicate naming

This function finds duplicate names across the entire codebase...

- Don't read in `.native.ts(x)` files if we search for statements, they are confused for duplicate names. We do need to fix imports in those though
- Really fix all duplicate naming, it's better to have unique naming across the entire monorepo (this will take some time).
- Ensure we don't have root-level statement destructures, as this is not supoprted (e.g. `export const {`) and also no duplicate names.
*/
export const findDuplicateNames = async (operations: {
  [key: string]: string;
}) => {
  const { statements } = await getTypescriptData({
    basePath: undefined,
    operations,
  });
  if (!statements) {
    return;
  }
  const loc = sum(statements.map((x) => x.raw.split("\n").length));
  console.log({ loc });
  const statementsWithoutSpecialFiles = statements.filter(
    statementNoSpecialFileFilter,
  );
  const duplicates = statementsWithoutSpecialFiles
    .filter(onlyDuplicates<SwcStatement>((a, b) => a.name === b.name))
    .map((x) => x.name)
    .filter(onlyUnique)
    .filter((x) => !["getStaticProps", "getStaticPaths"].includes(x))
    .map((name) => {
      const theseStatements = statementsWithoutSpecialFiles.filter(
        (x) => x.name === name,
      );

      return {
        name,
        count: theseStatements.length,
        paths: theseStatements.map((x) => x.absolutePath),
      };
    });

  console.log(`duplicates:`, duplicates);

  return duplicates;
};
