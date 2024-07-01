import { SwcImport } from "../types/types.js";
/**
Import re-generation: Useful function to map over imports and have them be edited in realtime.

# What it does

- For all imports in a file, take the raw
- Take the file string and replace all raw with empty string
- Now there are no more imports
- Recreate imports at the beginning of the file
- It works for all types of imports including default and namespaces

 */
export declare const regenerateImports: (operations: {
    [key: string]: string;
}, basePath: string | string[] | undefined, map?: ((item: SwcImport, index: number, imports: SwcImport[]) => SwcImport | null) | undefined, isDryrun?: boolean) => Promise<{
    absolutePath: string;
    needsUpdate: boolean;
    difference: string | undefined;
}[] | undefined>;
//# sourceMappingURL=regenerateImports.d.ts.map