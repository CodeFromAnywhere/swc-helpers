import { StandardFunctionConfig } from "edge-util";
import { getTypescriptFileData } from "./getTypescriptFileData.js";
export function exportedRegularFunction() {
  console.log("Thing");
}

function regularFunction() {
  console.log("Thing");
}
regularFunction.config = {} satisfies StandardFunctionConfig;

const noExportArrowFunction = async () => {
  console.log("THING");
};

export const exportedArrowFunction = async () => {
  const paths = [
    "/Users/king/os/packages/control-fs/get-path/src/getProjectRoot.ts",
  ];

  const res = await Promise.all(
    paths.map((p) => {
      return getTypescriptFileData({}, p);
    }),
  );

  console.dir(
    res.map((x) => x.statements),
    { depth: 4 },
  );
};

exportedArrowFunction.config = {
  isPublic: true,
} satisfies StandardFunctionConfig;

exportedArrowFunction();

// test
// regenerateImports(
//   "/Users/king/os/operations/tools/typescript/swc-util/src/imports/regenerateImports.ts",
//   (item) => (item.isNamespaceImport ? null : item)
// );
