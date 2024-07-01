/**
 * Splitting up a file with multiple statements into a file for every statement.
 */
export const splitTypescriptFile = (projectRelativeTypescriptFilePath) => {
    // 1) use `typescriptDb` for a file to get all its statements
    // 2) every statement can be its own file, but every of those files needs all imports still, and also import each other
    // 3) try removing all unneeded imports. simple hack: see if the word occurs only once, or more.
};
//# sourceMappingURL=splitTypescriptFile.js.map