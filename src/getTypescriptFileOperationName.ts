import { fs } from "edge-util";
import { makeRelative } from "edge-util";
import { getProjectRoot } from "edge-util";
import { getObjectKeysArray } from "edge-util";
/**
 * Returns the operationName for a typescript file path.
 *
 * uses `sdk-operations`.
 *
 * TODO: can also just recursively go up in the fs until a package.json is found that seems an operation root. This would be much better since now we rely on `sdk-operations` being indexed all the time; not a good reliability...
 *
 */
export const getTypescriptFileOperationName = (
  absoluteTypescriptFilePath: string,
  operations: { [key: string]: string },
): string | undefined => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) return;

  if (!fs.existsSync(absoluteTypescriptFilePath)) {
    return;
  }
  const projectRelativePath = makeRelative(
    absoluteTypescriptFilePath,
    projectRoot,
  );

  const operationName: string | undefined = getObjectKeysArray(operations).find(
    (operationName) => {
      return projectRelativePath.startsWith(`${operations[operationName]}/`);
    },
  );

  return operationName;
};
