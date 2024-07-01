import { getStatements } from "./getStatements.js";
const test = async () => {
    // console.time("cache");
    // const { statements: s, imports: i } = await getStatements({});
    // console.timeEnd("cache");
    // const raws = (s || []).concat(i || []).map((x) => x.raw);
    // console.log({
    //   statements: s?.length,
    //   imports: i?.length,
    //   lines: sum(raws.map((x) => x.split("\n").length)),
    //   chars: sum(raws.map((x) => x.length)),
    // });
    const operations = {};
    console.time("no-cache");
    const { statements, imports } = await getStatements(operations, {
        isCacheDisabled: true,
        projectRelativeBasePath: "packages",
    });
    console.timeEnd("no-cache");
    console.log({
        statementsFoundAmount: statements?.length,
        importsFoundAmount: imports?.length,
        statementsWithConfigAmount: statements?.filter((x) => !!x.config).length,
    });
};
test();
//# sourceMappingURL=getStatements.test.js.map