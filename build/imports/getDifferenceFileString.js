export const getDifferenceFileString = (changes) => {
    if (!changes) {
        return undefined;
    }
    return changes
        .map((change) => change.added
        ? `// ADDED next line:\n ${change.value}`
        : change.removed
            ? `// REMOVED this line: ${change.value}`
            : change.value)
        .join("\n");
};
//# sourceMappingURL=getDifferenceFileString.js.map