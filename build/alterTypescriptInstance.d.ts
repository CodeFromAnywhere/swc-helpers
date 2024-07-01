import { SwcStatement } from "./types/types.js";
/**
Function to alter your code

- should take care of removing it from the old file, if location changes
- should take care of altering all imports elsewhere if the location/name changes
- should alter the code as suggested in the instance
*/
export declare const alterTypescriptInstance: (absoluteFilePath: string, name: string, map: (old?: SwcStatement) => SwcStatement) => Promise<void>;
//# sourceMappingURL=alterTypescriptInstance.d.ts.map