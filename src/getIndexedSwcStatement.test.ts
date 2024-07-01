import { getIndexedSwcStatement } from "./getIndexedSwcStatement.js";
import { SwcFunction } from "./types/types.js";

getIndexedSwcStatement<SwcFunction>("actionSchemaCreate").then((res) => {
  console.log(res?.parameters?.[0]?.schema);
});
