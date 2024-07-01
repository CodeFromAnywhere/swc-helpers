import { generateUniqueId } from "from-anywhere/node";
import { getNewPerformance } from "from-anywhere/node";
import { cleanupTimer } from "from-anywhere/node";
const test = async () => {
    const executionId = generateUniqueId();
    const performance = [];
    getNewPerformance("start", executionId, true);
    const code = `
    import { getLastFolder, path } from "from-anywhere/node";
    import { operations } from "sdk-operations";
    import { getProjectRoot } from "./getProjectRoot.js";
    
    /*
    
    Gets a path of any operation in the project
    
    */
    export const getOperationPath = async (
      /**
       * specify the operation folder name
       */
      operationName: string,
      config?: {
        manualProjectRoot?: string;
        /**
         * if true, will not use sdk (defaults to using it first...)
         */
        notUseSdk?: boolean;
      }
    ): Promise<string | undefined> => {
      const oper = config?.manualProjectRoot
        ? require(config.manualProjectRoot +
            "packages/generated/sdk-operations/build/sdk-operations.js")
        : operations;
    
      // NB: In case of manualProjectRoot, we should not use the SDK! The sdk is from our own project root.
      if (!config?.notUseSdk && !config?.manualProjectRoot) {
        const projectRelativeOperationPath =
          operations[operationName as keyof typeof operations];
        const projectRoot = getProjectRoot();
        if (projectRelativeOperationPath && projectRoot) {
          return path.join(projectRoot, projectRelativeOperationPath);
        }
      }
    
      // if that didn't work, let's find it in realtime
    
      return undefined;
    
      // const basePath = getPathsWithOperations({
      //   manualProjectRoot: config?.manualProjectRoot,
      // });
    
      // const operationPaths: string[] = await exploreOperationFolders({ basePath });
    
      // if (operationPaths.length === 0) {
      //   log("No operations available", { type: "error" });
      //   return;
      // }
      // const operationPathsWithTheirFolder = await Promise.all(
      //   operationPaths.map(async (p) => ({
      //     path: p,
      //     folderName: getLastFolder(p),
      //   }))
      // );
    
      // const foundPath = operationPathsWithTheirFolder.find(
      //   (f) => f.folderName === operationName
      // )?.path;
    
      // return foundPath;
    };
    
`;
    await Promise.all(new Array(10000).fill(null).map(async () => {
        //const ast = await getSwcImports(code);
    }));
    performance.push(getNewPerformance("parse and map to imports", executionId));
    cleanupTimer(executionId);
    console.log({ performance });
    // writeToAssets(__filename, ast, "test2.json");
};
test();
//# sourceMappingURL=getImports.test.js.map