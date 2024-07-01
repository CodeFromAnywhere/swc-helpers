import { getIndexedSwcStatement } from "./getIndexedSwcStatement.js";
getIndexedSwcStatement("actionSchemaCreate").then((res) => {
    console.log(res?.parameters?.[0]?.schema);
});
//# sourceMappingURL=getIndexedSwcStatement.test.js.map