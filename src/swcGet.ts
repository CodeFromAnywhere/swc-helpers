import { getStatements } from "./getStatements.js";
import { GetSwcStatementsFilter } from "./types/GetSwcStatementsFilter.js";
import {
  SwcFunction,
  SwcInterface,
  SwcModels,
  SwcVariable,
} from "./types/types.js";
export const dbGetSwcFunctions = async (
  operations: { [key: string]: string },
  filter?: GetSwcStatementsFilter,
) => {
  const { statements } = await getStatements(operations, filter);

  return statements?.filter((x) => x.modelName === "SwcFunction") as
    | SwcFunction[]
    | undefined;
};

export const dbGetSwcInterfaces = async (
  operations: { [key: string]: string },
  filter?: GetSwcStatementsFilter,
) => {
  const { statements } = await getStatements(operations, filter);

  return statements?.filter((x) => x.modelName === "SwcInterface") as
    | SwcInterface[]
    | undefined;
};

export const dbGetSwcVariables = async (
  operations: { [key: string]: string },
  filter?: GetSwcStatementsFilter,
) => {
  const { statements } = await getStatements(operations, filter);

  return statements?.filter((x) => x.modelName === "SwcVariable") as
    | SwcVariable[]
    | undefined;
};

/**
 * General purpose function to get stuff from the typescript stored "db" (that is your code)
 */
export const swcGet = async <
  TModel extends
    | "SwcStatement"
    | "SwcFunction"
    | "SwcInterface"
    | "SwcVariable",
>(
  operations: { [key: string]: string },

  model: TModel,
  filter?: GetSwcStatementsFilter,
): Promise<SwcModels[TModel][] | undefined> => {
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
