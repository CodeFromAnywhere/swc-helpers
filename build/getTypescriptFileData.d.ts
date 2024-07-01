import { TypescriptFileConfig } from "./TypescriptFileConfig.js";
import { TypescriptFileData } from "./types/types.js";
/**
 Returns the `TypescriptInstance`[] for a piece of typescript code, using swc to parse it.

 TODO: get the playground for some of my own files, until I understand well enough how the AST works. isn't there a SWC vscode plugin, in the meantime?

 */
export declare const getTypescriptFileData: (operations: {
    [key: string]: string;
}, absolutePath: string, config?: TypescriptFileConfig) => Promise<{
    isSuccessful: boolean;
    message?: string;
} & Partial<TypescriptFileData>>;
//# sourceMappingURL=getTypescriptFileData.d.ts.map