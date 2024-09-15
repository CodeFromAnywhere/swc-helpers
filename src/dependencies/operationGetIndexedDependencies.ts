import { Operation } from "edge-util";
import path from "node:path";
import { getProjectRoot, readJsonFile } from "edge-util";
/**
 * Get dependencies via package.json
 */
export const operationGetIndexedDependencies = async (
  operationName: string,
  operations: { [key: string]: string },
) => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) return;

  const projectRelativeOperationPath =
    operations[operationName as keyof typeof operations] || undefined;
  if (!projectRelativeOperationPath) return;

  const operationBasePath = path.join(
    projectRoot,
    projectRelativeOperationPath,
  );

  const packageJsonPath = path.join(operationBasePath, "package.json");

  const operation = await readJsonFile<Operation>(packageJsonPath);
  if (!operation) return;
  if (!operation.dependencies) return [];
  return Object.keys(operation.dependencies);
};
