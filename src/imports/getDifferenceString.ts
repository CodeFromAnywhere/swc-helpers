import { Change } from "diff";
import { notEmpty } from "from-anywhere";
export const getDifferenceString = (changes?: Change[]) => {
  if (!changes) {
    return undefined;
  }
  return changes
    .map((change) =>
      change.added
        ? `+ ${change.value}`
        : change.removed
          ? `- ${change.value}`
          : undefined,
    )
    .filter(notEmpty)
    .join("");
};
