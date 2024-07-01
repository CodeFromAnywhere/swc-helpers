import { getTypescriptData } from "./getTypescriptData.js";
console.time();
getTypescriptData({ basePath: "/Users/king/os/packages", operations: {} }).then((res) => {
    console.log({
        imports: res.imports.length,
        statements: res.statements.length,
    });
    console.timeEnd();
});
//# sourceMappingURL=getTypescriptData.test.js.map