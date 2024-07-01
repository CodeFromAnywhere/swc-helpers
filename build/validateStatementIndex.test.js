import { getStatementIndex } from "./getStatementIndex.js";
const test = async () => {
    const index = await getStatementIndex();
    if (!index) {
        console.log("NO INDEX", 0);
        return 0;
    }
    const amountConfig = Object.values(index).filter((x) => !!x.config).length;
    console.log("INDEX WITH CONFIGS", amountConfig);
    return amountConfig;
};
test();
//# sourceMappingURL=validateStatementIndex.test.js.map