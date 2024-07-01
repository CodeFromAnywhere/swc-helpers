import { StatementIndexItem } from "./types/types.js";
/**
 * Beautiful function that uses the statement index to quicly filter on the config to retreive required functions. Can't get it more performant than this!
 */
export declare const tryRequireFunctionsWithConfig: (filterFn: (value: [string, StatementIndexItem]) => boolean | undefined) => Promise<(StatementIndexItem & {
    fn: (...parameters: any[]) => any;
    name: string;
})[] | undefined>;
//# sourceMappingURL=tryRequireFunctionsWithConfig.d.ts.map