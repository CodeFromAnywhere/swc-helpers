import { getDependenciesPerOperation } from "./getDependenciesPerOperation.js";
const test = async () => {
    console.time();
    await getDependenciesPerOperation(Object.keys({}), {});
    console.timeEnd();
};
test();
//# sourceMappingURL=getDependenciesPerOperation.test.js.map