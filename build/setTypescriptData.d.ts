import { TypescriptFileData } from "./types/types.js";
/**
 * set all typescript code. can be used in conjunction with getTypescriptData to do huge updates
 *
 * NB: overwrites if file already exists, otherwise creates. because `TsInstance` has information about the file location, you don't need to provide this separately
 *
 * NB: imports are omitted and re-calculated based on the `TsInstance`s
 */
export declare const setTypescriptData: (data: TypescriptFileData, config: {
    absoluteFilePath?: string;
    operationName?: string;
    filename?: string;
    /**
    If true, should split the statements into one statement per file
     */
    isSplit?: boolean;
}) => void;
//# sourceMappingURL=setTypescriptData.d.ts.map