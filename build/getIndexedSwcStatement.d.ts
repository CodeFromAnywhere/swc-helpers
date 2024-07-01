import { SwcStatement } from "./types/types.js";
/**
 * NB: assumes server restarts after statements are changed!
 */
export declare const getIndexedSwcStatement: <T extends SwcStatement>(statementName: string) => Promise<T | undefined>;
//# sourceMappingURL=getIndexedSwcStatement.d.ts.map