import swcCore from "@swc/core";
export const trySwcParse = async (src, isJavascript) => {
    try {
        const parseResult = await swcCore.parse(src, {
            syntax: isJavascript ? "ecmascript" : "typescript",
            comments: true,
            script: true,
            tsx: true,
            decorators: true,
        });
        return { isSuccessful: true, parseResult, message: "Successful" };
    }
    catch (e) {
        console.log(e);
        return { isSuccessful: false, message: "Error" };
    }
};
//# sourceMappingURL=trySwcParse.js.map