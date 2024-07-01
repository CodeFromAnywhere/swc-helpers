import { getDependenciesPerOperation } from "./getDependenciesPerOperation.js";
import { mergeObjectsArray } from "from-anywhere";
/**
 * WORKS!!!!!
 *
 * DEPRECATED: `simpleCircularDependencyFinder` is better
 */
export const findCircularDependency = async (
  startOperationName: string,
  operations: { [key: string]: string },
) => {
  const dependenciesPerOperation = await getDependenciesPerOperation(
    Object.keys(operations),
    operations,
  );

  const dependenciesPerOperationObject = mergeObjectsArray(
    dependenciesPerOperation.map((x) => ({
      [x.operationName]: x.dependencies || [],
    })),
  );

  const dependencies = dependenciesPerOperationObject[startOperationName] as
    | string[]
    | undefined;

  if (!dependencies) {
    console.log(`can't find operation ${startOperationName}!!`);
    return;
  }

  //   writeToAssets(
  //     __filename,
  //     dependenciesPerOperationObject,
  //     "dep-oper-obj.json"
  //   );
  if (dependencies.includes(startOperationName)) {
    console.log("Dependency on yourself");
    return;
  }

  const result = dependencies.map((dependency, index) => {
    // console.log(`${index + 1}:${dependency}...`);
    return findCircularDependencyRecursive(dependenciesPerOperationObject, [
      startOperationName,
      dependency,
    ]);
  });
  return result.flat();
};

export const findCircularDependencyRecursive = (
  dependenciesPerOperationObject: {
    [x: string]: string[];
  },
  /**
   * NB: must start with an operation
   */
  stack: string[],
): string[] => {
  if (stack.length === 0) {
    console.log(`Provide an operation in the stack!`);

    return stack;
  }
  const last = stack[stack.length - 1];

  const dependencies = dependenciesPerOperationObject[last] as
    | string[]
    | undefined;

  if (!dependencies) {
    console.log(`you don't have ${last} operation in here`);
    return stack;
  }
  const stackDep = stack.find((s) => dependencies.includes(s));

  if (stackDep) {
    const startIndex = stack.findIndex((x) => x === stackDep);
    const irrelevantPart = stack.slice(0, startIndex);
    const relevantPart = stack.slice(startIndex).concat(stackDep);
    // other dep in stack
    console.log(`${relevantPart.join(" 🔗 ")}`);
    return [...stack, stackDep];
  }

  //   none. recurse
  const result = dependencies.map((dep) => {
    return findCircularDependencyRecursive(dependenciesPerOperationObject, [
      ...stack,
      dep,
    ]);
  });

  return result.flat();
};
