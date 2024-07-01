import { getStatementIndex } from "./getStatementIndex.js";
import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { notEmpty } from "from-anywhere";
import { tryRequire } from "./tryRequire.js";
/**
 * Beautiful function that uses the statement index to quicly filter on the config to retreive required functions. Can't get it more performant than this!
 */
export const tryRequireFunctionsWithConfig = async (filterFn) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return;
    }
    const index = await getStatementIndex();
    if (!index) {
        console.log("NO statement-index.json found.");
        return;
    }
    const indexEntries = Object.entries(index);
    const filtered = indexEntries.filter(filterFn);
    // console.log({ indexEntries: indexEntries.length, filtered: filtered.length });
    const functions = (await Promise.all(filtered.map(async ([key, value]) => {
        if (!value.packageCategory ||
            !value.packageName ||
            !value.operationRelativeFilePath) {
            console.log("invalid statementIndex items...");
            return;
        }
        const absoluteTsPath = path.join(projectRoot, "packages", value.packageCategory, value.packageName, value.operationRelativeFilePath);
        //console.log({ absoluteTsPath });
        const file = await tryRequire(absoluteTsPath);
        const fn = file?.[key];
        const result = {
            ...value,
            fn,
            name: key,
        };
        return result;
    }))).filter(notEmpty);
    return functions;
};
//# sourceMappingURL=tryRequireFunctionsWithConfig.js.map