import fs from "node:fs";
const fsPromises = fs.promises;
import { isPathRelative } from "edge-util";
import path from "path";
import { getProjectRoot } from "edge-util";
import { getObjectKeysArray } from "edge-util";
import { notEmpty } from "edge-util";
import { onlyUnique } from "edge-util";
import { onlyUnique2 } from "edge-util";
import { pipelinify } from "edge-util";
import { getTypescriptFileData } from "../getTypescriptFileData.js";
import { trySwcParseFile } from "../trySwcParseFile.js";
import { ExportAllDeclaration } from "@swc/core";
import { SwcFileParse } from "../types/types.js";

export const getMonorepoModules = async (
  operations: { [key: string]: string },
  absolutePath: string,
) => {
  const { imports } = await getTypescriptFileData(operations, absolutePath);
  if (!imports) {
    return;
  }

  const modules = imports
    .filter((x) => x.isModuleFromMonorepo)
    .map((x) => x.module)
    .filter((x) => !isPathRelative(x))
    .filter(onlyUnique)
    .map((x) => ({ module: x, isModule: true }));

  if (imports[0]?.packageName) {
    modules.push({ module: imports[0]?.packageName, isModule: false });
  }

  return modules;
};

export const parseIndexTsFile = async (item: {
  absoluteIndexTsPath: string;
  projectRelativeOperationPath: string;
  module: string;
  isModule: boolean;
}) => {
  const swcFileParse = (await trySwcParseFile(item.absoluteIndexTsPath)).result;
  if (!swcFileParse) {
    return;
  }
  return {
    ...item,
    swcFileParse,
  };
};

export const swcParseGetExportAllDefinitionFilePaths = (item: {
  swcFileParse: SwcFileParse;
  absoluteIndexTsPath: string;
  projectRelativeOperationPath: string;
  module: string;
  isModule: boolean;
}) => {
  const absoluteIndexPath = item.swcFileParse.absolutePath;

  const relativePaths = item.swcFileParse.body
    .filter((x) => x.type === "ExportAllDeclaration")
    ?.map((x) => (x as ExportAllDeclaration | undefined)?.source?.value)
    .filter(notEmpty);

  const absoluteTsPaths = relativePaths
    .map((p) => [
      path.join(path.parse(absoluteIndexPath).dir, `${p}.ts`),
      path.join(path.parse(absoluteIndexPath).dir, `${p}.tsx`),
    ])
    .flat()
    .filter(fs.existsSync);

  if (absoluteTsPaths.length === 0) {
    return;
  }
  return absoluteTsPaths.map((p) => ({
    ...item,
    absoluteTsPath: p,
  }));
};

export const getPathContents = async (
  item: {
    absoluteTsPath: string;
    swcFileParse: SwcFileParse;
    absoluteIndexTsPath: string;
    projectRelativeOperationPath: string;
    module: string;
    isModule: boolean;
  },
  config: { projectRoot: string },
) => {
  if (!fs.existsSync(item.absoluteTsPath)) {
    return;
  }

  const afterSrcPath = item.absoluteTsPath.split("/src/")?.[1];

  return [
    {
      contents: await fsPromises.readFile(item.absoluteTsPath, "utf8"),
      uri: item.isModule
        ? `/node_modules/${item.module}/${afterSrcPath}`
        : afterSrcPath,
    },
    item.isModule
      ? {
          contents: await fsPromises.readFile(item.absoluteIndexTsPath, "utf8"),
          uri: `/node_modules/${item.module}/index.ts`,
        }
      : undefined,
  ].filter(notEmpty);
};

export const packageNameGetProjectRelativeOperationPath = (
  item: { module: string; isModule: boolean },
  config: { operations: { [key: string]: string | undefined } },
) => {
  return {
    ...item,
    projectRelativeOperationPath:
      config.operations[item.module as keyof typeof config.operations],
  };
};

export const getAbsoluteIndexTsPath = (
  item: {
    projectRelativeOperationPath: string | undefined;
    module: string;
    isModule: boolean;
  },
  config: { projectRoot: string },
) => {
  if (!item.projectRelativeOperationPath) {
    return;
  }

  const absoluteIndexTsPath = path.join(
    config.projectRoot,
    item.projectRelativeOperationPath,
    "src",
    "index.ts",
  );

  if (!fs.existsSync(absoluteIndexTsPath)) {
    return;
  }

  return { ...item, absoluteIndexTsPath };
};

export const getTypescriptModels = async (
  absolutePath: string,
  operations: { [key: string]: string },
) => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) return;

  const results = await pipelinify<TypescriptModel>(
    absolutePath,
    [
      getMonorepoModules,
      packageNameGetProjectRelativeOperationPath,
      getAbsoluteIndexTsPath,
      parseIndexTsFile,
      swcParseGetExportAllDefinitionFilePaths,
      getPathContents,
    ],
    { projectRoot, operations },
    { showErrors: true },
  );

  console.log(results?.errors);
  return results?.output
    .filter(notEmpty)
    .filter(onlyUnique2<TypescriptModel>((a, b) => a.uri === b.uri));
};

export type TypescriptModel = {
  uri: string;
  contents: string;
};

export const getTypescriptModelsWithContext = async (
  projectRelativePath: string,
  operations: { [key: string]: string },
) => {
  // 1) ensure it's allowed to get this file first.
  if (!projectRelativePath) {
    return {
      isSuccessful: false,
      message: "No path",
    };
  }
  console.log("gettsmodels", { projectRelativePath });
  const projectRoot = getProjectRoot();

  if (!projectRoot) {
    return { isSuccessful: false, message: "No project root" };
  }

  const absolutePath = path.join(projectRoot, projectRelativePath);

  if (!fs.existsSync(absolutePath)) {
    return { isSuccessful: false, message: "File doesn't exist" };
  }

  const stats = fs.existsSync(absolutePath)
    ? await fsPromises.stat(absolutePath)
    : undefined;

  if (!stats) {
    return;
  }

  if (stats.size > 1024 * 1024 || stats.isDirectory()) {
    return {
      isSuccessful: false,
      message: "That's a directory or bigger than 1MB",
    };
  }

  const extension = absolutePath.split(".").pop();
  const languages = {
    typescript: ["ts", "tsx"],
    markdown: ["md"],
    json: ["json"],
  };
  const language = extension
    ? getObjectKeysArray(languages).find((key) =>
        languages[key].includes(extension),
      )
    : undefined;

  if (language !== "typescript") {
    return {
      isSuccessful: false,
      message: "Must be typescript",
    };
  }

  const typescriptModels = await getTypescriptModels(absolutePath, operations);

  return { isSuccessful: true, typescriptModels, operations };
};
