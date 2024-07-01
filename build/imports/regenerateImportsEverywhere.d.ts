/**
Scan all monorepo files within basePath(s)

Go over every file: look if imports that were stated actually seem to be correct, or not. If not, find the statement in the list with the same name, and replace the import with a correct import.

Policy:

- Run buildEverythingInRightOrder
- Run this after big refactors (moving files around in the fs).
- Ensures all imports are correct based on the detected location of all functions/interfaces/variables.

Please note:
- it does not work if it imports from a non-existing package. Therefore, ensure to move the function away from a package first, before actually removing the entire package.
- it doesn't do anything for imports from non-monorepo packages
- it doens't do anything if the name of the statement changed. Only same name, different location.

# Import updates

When recreating imports, have the ability to:

1. Alter any renamed package or renamed function or moved function.
2. List all altered packages and rebuild them in the right order

Recipes (less important):

- rename package: find all ts-files that import this as module, update this to new name, build all packages in right order
- rename function: find all ts-files that import the function from monorepo, update the import there, but also update functionName( or functionName< to `newFunctionName</(` in the same file. In the same package, we need to also change the filename if this didn't happen yet, and also import the new function name from the new relative file location.
- move function to other package: you get the idea

It's hard:

Testcases:

- There's a file dangle at the end or at the start and the raw is incorrect.
- There are imports that aren't from monorepo
- Imports of JSON files, images, css, etc
- Same import commented out, above actual import

*/
export declare const regenerateImportsEverywhere: (operations: {
    [key: string]: string;
}, basePath?: string | string[] | undefined, isDryrun?: boolean) => Promise<{
    unresolved: string[];
    duplicates: string[];
    updatedAmount: number;
    result?: {
        absolutePath: string;
        needsUpdate: boolean;
        difference?: string | undefined;
    }[] | undefined;
} | undefined>;
//# sourceMappingURL=regenerateImportsEverywhere.d.ts.map