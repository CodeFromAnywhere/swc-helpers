import { SwcImport, SwcStatement } from "./types/types.js";
import { GetSwcStatementsFilter } from "./types/GetSwcStatementsFilter.js";
/**

Fetch all functions and attach config and function to it if requested

NB: please note that this gives a huge advantage as it does not require the SDK to embed the function. We need to be careful about this, however, since it can be slow with large amount of functions, also loops might occur if you need a function that uses the db stuff. Therefore, it can be disabled by stating "omitRequire" in the filter.


# THOUGHTS

Now I think we have all we need for getting rid of TsInterface and TsFunction, and with that basically anything legacy. This is a huge cleanup.

Potentially I can now make everything execute in the frontend, for example for validation and generating forms! This would be insane.

 */
export declare const getStatements: (operations: {
    [key: string]: string;
}, filter?: GetSwcStatementsFilter) => Promise<{
    statements?: SwcStatement[] | undefined;
    imports?: SwcImport[] | undefined;
}>;
//# sourceMappingURL=getStatements.d.ts.map