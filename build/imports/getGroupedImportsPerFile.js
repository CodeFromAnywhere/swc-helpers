/**
group imports per file
 */
export const getGroupedImportsPerFile = (imports) => {
    const groupedImportsPerFile = {};
    imports.map((item) => {
        if (!item.absolutePath) {
            return;
        }
        if (!groupedImportsPerFile[item.absolutePath]) {
            groupedImportsPerFile[item.absolutePath] = [];
        }
        groupedImportsPerFile[item.absolutePath].push(item);
    });
    return groupedImportsPerFile;
};
//# sourceMappingURL=getGroupedImportsPerFile.js.map