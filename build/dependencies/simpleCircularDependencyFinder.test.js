import { simpleCircularDependencyFinderRecursive } from "./simpleCircularDependencyFinder.js";
const test = async () => {
    console.time();
    const x = await simpleCircularDependencyFinderRecursive({});
    console.dir(x, { maxArrayLength: 999 });
    console.timeEnd();
};
test();
//# sourceMappingURL=simpleCircularDependencyFinder.test.js.map