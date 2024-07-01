import { mergeNestedObject } from "from-anywhere";
import { mergeObjectsArray } from "from-anywhere";
import { mapMany } from "from-anywhere";
import { writeToAssets } from "from-anywhere/node";
import { detectCircularDependencies } from "./detectCircularDependencies.js";
import { update } from "fsorm";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);

export const reindexAllOperationsCircularDependencies = async (
  operations: { [key: string]: string },
  isDryrun?: boolean,
) => {
  const cirularDependenciesObject = mergeObjectsArray(
    await mapMany(
      Object.keys(operations),
      async (operationName, index) => {
        console.log(`detecting ${index}: ${operationName}`);
        const circularDependencies = await detectCircularDependencies(
          operations,
          operationName,
        );

        return { [operationName]: circularDependencies };
      },
      10,
    ),
  );

  if (isDryrun) {
    writeToAssets(__filename, cirularDependenciesObject, "circdeps.json");
    return;
  }

  const updateResult = await update(
    "Operation",
    (old) =>
      mergeNestedObject(old, {
        operation: {
          circularDependencies: old.name
            ? cirularDependenciesObject[old.name]
            : undefined,
        },
      }),
    undefined,
    undefined,
  );

  return { isSuccessful: updateResult?.isSuccessful };
};
