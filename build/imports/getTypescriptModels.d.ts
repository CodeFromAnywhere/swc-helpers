/// <reference types="node" />
import { SwcFileParse } from "../types/types.js";
export declare const getMonorepoModules: (operations: {
    [key: string]: string;
}, absolutePath: string) => Promise<{
    module: string;
    isModule: boolean;
}[] | undefined>;
export declare const parseIndexTsFile: (item: {
    absoluteIndexTsPath: string;
    projectRelativeOperationPath: string;
    module: string;
    isModule: boolean;
}) => Promise<{
    swcFileParse: SwcFileParse;
    absoluteIndexTsPath: string;
    projectRelativeOperationPath: string;
    module: string;
    isModule: boolean;
} | undefined>;
export declare const swcParseGetExportAllDefinitionFilePaths: (item: {
    swcFileParse: SwcFileParse;
    absoluteIndexTsPath: string;
    projectRelativeOperationPath: string;
    module: string;
    isModule: boolean;
}) => {
    absoluteTsPath: string;
    swcFileParse: SwcFileParse;
    absoluteIndexTsPath: string;
    projectRelativeOperationPath: string;
    module: string;
    isModule: boolean;
}[] | undefined;
export declare const getPathContents: (item: {
    absoluteTsPath: string;
    swcFileParse: SwcFileParse;
    absoluteIndexTsPath: string;
    projectRelativeOperationPath: string;
    module: string;
    isModule: boolean;
}, config: {
    projectRoot: string;
}) => Promise<{
    contents: string;
    uri: string;
}[] | undefined>;
export declare const packageNameGetProjectRelativeOperationPath: (item: {
    module: string;
    isModule: boolean;
}, config: {
    operations: {
        [key: string]: string | undefined;
    };
}) => {
    projectRelativeOperationPath: string | undefined;
    module: string;
    isModule: boolean;
};
export declare const getAbsoluteIndexTsPath: (item: {
    projectRelativeOperationPath: string | undefined;
    module: string;
    isModule: boolean;
}, config: {
    projectRoot: string;
}) => {
    absoluteIndexTsPath: string;
    projectRelativeOperationPath: string | undefined;
    module: string;
    isModule: boolean;
} | undefined;
export declare const getTypescriptModels: (absolutePath: string, operations: {
    [key: string]: string;
}) => Promise<TypescriptModel[] | undefined>;
export type TypescriptModel = {
    uri: string;
    contents: string;
};
export declare const getTypescriptModelsWithContext: (projectRelativePath: string, operations: {
    [key: string]: string;
}) => Promise<{
    isSuccessful: boolean;
    message: string;
    typescriptModels?: undefined;
    operations?: undefined;
} | {
    isSuccessful: boolean;
    typescriptModels: TypescriptModel[] | undefined;
    operations: {
        [key: string]: string;
    };
    message?: undefined;
} | undefined>;
//# sourceMappingURL=getTypescriptModels.d.ts.map