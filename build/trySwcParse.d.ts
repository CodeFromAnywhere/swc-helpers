import swcCore from "@swc/core";
export declare const trySwcParse: (src: string, isJavascript?: boolean) => Promise<{
    isSuccessful: boolean;
    parseResult: swcCore.Module;
    message: string;
} | {
    isSuccessful: boolean;
    message: string;
    parseResult?: undefined;
}>;
//# sourceMappingURL=trySwcParse.d.ts.map