import { dbGetStatementHere } from "./dbGetStatementHere.js";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);

export const test1234 = (parameter1: string, parameter2?: number) => {
  console.time();
  dbGetStatementHere(__filename, "test1234").then((result) => {
    console.dir(result, { depth: 6 });
    console.timeEnd();
  });
};

test1234("", 6);
