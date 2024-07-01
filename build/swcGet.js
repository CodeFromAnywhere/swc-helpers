import { getStatements } from "./getStatements.js";
export const dbGetSwcFunctions = async (operations, filter) => {
    const { statements } = await getStatements(operations, filter);
    return statements?.filter((x) => x.modelName === "SwcFunction");
};
export const dbGetSwcInterfaces = async (operations, filter) => {
    const { statements } = await getStatements(operations, filter);
    return statements?.filter((x) => x.modelName === "SwcInterface");
};
export const dbGetSwcVariables = async (operations, filter) => {
    const { statements } = await getStatements(operations, filter);
    return statements?.filter((x) => x.modelName === "SwcVariable");
};
/**
 * General purpose function to get stuff from the typescript stored "db" (that is your code)
 */
export const swcGet = async (operations, model, filter) => {
    if (model === "SwcStatement") {
        return (await getStatements(operations, filter)).statements;
    }
    if (model === "SwcFunction") {
        return dbGetSwcFunctions(operations, filter);
    }
    if (model === "SwcInterface") {
        return dbGetSwcInterfaces(operations, filter);
    }
    return dbGetSwcVariables(operations, filter);
};
//# sourceMappingURL=swcGet.js.map