import { trySwcParseFile } from "./trySwcParseFile.js";
const test = async () => {
    const result2 = await trySwcParseFile("/Users/king/os/packages/typescript-swc/swc-util/src/trySwcParseFile.test.ts");
    console.dir({
        result2: result2.result,
    }, { depth: 10 });
};
test();
//# sourceMappingURL=trySwcParseFile.test.js.map