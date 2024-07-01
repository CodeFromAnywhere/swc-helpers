import { notEmpty } from "from-anywhere";
export const getDifferenceString = (changes) => {
    if (!changes) {
        return undefined;
    }
    return changes
        .map((change) => change.added
        ? `+ ${change.value}`
        : change.removed
            ? `- ${change.value}`
            : undefined)
        .filter(notEmpty)
        .join("");
};
//# sourceMappingURL=getDifferenceString.js.map