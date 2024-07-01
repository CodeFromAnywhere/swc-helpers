export const tryRequire = async (absoluteTsPath) => {
    // console.log("tryRequire:", { absoluteTsPath });
    if (!absoluteTsPath) {
        return;
    }
    const finalPath = process.isBun
        ? absoluteTsPath
        : absoluteTsPath
            .replace("/src/", "/build/")
            .replace(".tsx", ".js")
            .replace(".ts", ".js");
    try {
        // console.log(`require:${absoluteTsPath}`);
        return await import(finalPath);
    }
    catch (e) {
        console.log(`COULD NOT REQUIRE. Recommended to build everything and fix build errors. Path: ${absoluteTsPath}`, { type: "warning" });
        console.log(e);
        return undefined;
    }
};
//# sourceMappingURL=tryRequire.js.map