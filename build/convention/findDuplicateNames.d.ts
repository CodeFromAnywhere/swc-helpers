import { SwcStatement } from "../types/types.js";
export declare const statementNoSpecialFileFilter: (x: SwcStatement) => boolean;
/**
# Solve for duplicate naming

This function finds duplicate names across the entire codebase...

- Don't read in `.native.ts(x)` files if we search for statements, they are confused for duplicate names. We do need to fix imports in those though
- Really fix all duplicate naming, it's better to have unique naming across the entire monorepo (this will take some time).
- Ensure we don't have root-level statement destructures, as this is not supoprted (e.g. `export const {`) and also no duplicate names.
*/
export declare const findDuplicateNames: (operations: {
    [key: string]: string;
}) => Promise<{
    name: string;
    count: number;
    paths: (string | undefined)[];
}[] | undefined>;
//# sourceMappingURL=findDuplicateNames.d.ts.map