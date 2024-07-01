import { update } from "fsorm";
import { mergeNestedObject } from "from-anywhere";
import { detectCircularDependencies } from "./detectCircularDependencies.js";
/**Have a function `reindexCircularDependencies` that puts that on `Operation` again for one or for all operations.*/
export const reindexCircularDependencies = async (
  operationName: string,
  operations: { [key: string]: string },
) => {
  const circularDependencies = await detectCircularDependencies(
    operations,
    operationName,
  );
  const updateResult = await update(
    "Operation",
    (old) => mergeNestedObject(old, { operation: { circularDependencies } }),
    { slug: operationName },
    (item) => {
      return item.name === operationName;
    },
  );

  return { isSuccessful: updateResult?.isSuccessful };
};
