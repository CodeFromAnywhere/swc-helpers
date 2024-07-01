import swcCore from "@swc/core";
export const tryParseTypescript = async (
  src: string,
): Promise<string | undefined> => {
  try {
    const parsed = await swcCore.parse(src, { syntax: "typescript" });

    return src;
  } catch (e) {
    return;
  }
};
