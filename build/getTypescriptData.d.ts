import { TypescriptFileConfig } from "./TypescriptFileConfig.js";
import { SwcImport, SwcStatement } from "./types/types.js";
/**
Function that parses Typescript in real time so it's super easy to work with code

NB: this doesn't get all stats and extra data sources like `getStatements`! it just simplifies the swc-parse that is done on the code in realtime. It can do 3MB of code in under 500MS on an M1, which is pretty spectacular... I wonder how it will be in bun ^^
 */
export declare const getTypescriptData: (config: {
    operations: {
        [key: string]: string;
    };
    /**
     * File or folder path containing typescript code (.ts, .tsx)
     *
     * By default, will use project root
     */
    basePath: string | string[] | undefined;
    /**
     * function to filter files based on their path
     */
    pathFilter?: ((absolutePath: string) => boolean) | undefined;
} & TypescriptFileConfig) => Promise<{
    isSuccessful: boolean;
    message: string;
    statements: SwcStatement[];
    imports: SwcImport[];
}>;
//# sourceMappingURL=getTypescriptData.d.ts.map