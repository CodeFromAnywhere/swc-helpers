import { SwcStatement } from "./types/types.js";

/**
 * Function to alter an entire file
 */
export const alterTypescriptFile = (
  absoluteFilePath: string,
  /**
   * content of the typescript file
   *
   * - imports can be done automatically if they're missing
   *
   * - if you already have some of the statements provided elsewhere in your codebase, they can either be omitted or overwritten
   */
  map: (old: SwcStatement[]) => SwcStatement[],
) => {
  // if location changes, instance(s) can be omitted
  // if location doesn't exist, operation/file can be created
  // can use alterTypescriptInstance
};
