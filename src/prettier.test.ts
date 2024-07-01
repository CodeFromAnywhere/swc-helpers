import fs from "node:fs";
import prettier from "prettier";
const test = async () => {
  const result = prettier.format(
    fs.readFileSync(
      "/Users/king/os/operations/tools/typescript-swc/swc-util/src/imports/regenerateImports.ts",
      "utf8",
    ),
    { parser: "typescript" },
  );
  console.log({ result });
};
test();
