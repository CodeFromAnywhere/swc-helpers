import { Change } from "diff";
import { notEmpty } from "from-anywhere";
export const getDifferenceFileString = (changes?: Change[]) => {
  if (!changes) {
    return undefined;
  }
  return changes
    .map((change) =>
      change.added
        ? `// ADDED next line:\n ${change.value}`
        : change.removed
          ? `// REMOVED this line: ${change.value}`
          : change.value,
    )
    .join("\n");
};
