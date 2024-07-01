export const fileGetContentWithoutImports = (content, importsThisFile) => {
    // console.log({ raws: importsThisFile.map((x) => x.raw) });
    const contentWithoutImports = importsThisFile.reduce((previousContent, currentImport) => {
        return previousContent.replaceAll(currentImport.raw, "");
    }, content);
    return contentWithoutImports.trim().concat("\n");
};
//# sourceMappingURL=fileGetContentWithoutImports.js.map