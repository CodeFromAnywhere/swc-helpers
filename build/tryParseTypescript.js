import swcCore from "@swc/core";
export const tryParseTypescript = async (src) => {
    try {
        const parsed = await swcCore.parse(src, { syntax: "typescript" });
        return src;
    }
    catch (e) {
        return;
    }
};
//# sourceMappingURL=tryParseTypescript.js.map