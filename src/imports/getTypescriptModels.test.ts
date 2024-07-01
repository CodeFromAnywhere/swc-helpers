import { getTypescriptModels } from "./getTypescriptModels.js";
const test = async () => {
  const x = await getTypescriptModels(
    "/Users/king/os/operations/tools/user-facing/explorer-functions/src/getFileContentsWithContext.ts",
    {},
  );
  console.log(x);
};
test();
