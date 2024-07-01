import { SwcImport, SwcStatement } from "./types/types.js";
import { O } from "from-anywhere";
/**
 * Takes an absolute path to a json and a type generic and provides a map function with which you can alter that JSON (read, map, save)
 */
export declare const mapObjectJson: <T extends O, U>(absolutePath: string, mapFunction: (item: T) => U, createObjectIfNonExistent?: T | undefined) => Promise<boolean | undefined>;
export declare const storeResult: (context: {
    finalStatements: SwcStatement[];
    finalImports: SwcImport[];
    projectRelativeBasePath?: string | string[];
    absoluteOperationPathsInScope: string[];
}) => Promise<void>;
//# sourceMappingURL=storeResult.d.ts.map