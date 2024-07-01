export const fileGetContentsWithoutTopStatements = (src: string) => {
  const lines = src.split("\n");
  const firstLine = lines[0];
  const hasShebang = firstLine.startsWith("#!");
  const contentWithoutShebang = hasShebang ? lines.slice(1) : lines;
  const shebang = hasShebang ? firstLine : undefined;
  const firstLineWithoutShebang = contentWithoutShebang[0];
  const isFirstLineComment = firstLineWithoutShebang.startsWith("//");
  const comment = isFirstLineComment ? firstLineWithoutShebang : undefined;
  const linesResult = isFirstLineComment
    ? contentWithoutShebang.slice(1)
    : contentWithoutShebang;
  const content = linesResult.join("\n");
  return { shebang, comment, content };
};
