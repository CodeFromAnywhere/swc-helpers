import { makeRelative } from "from-anywhere";
import { getObjectKeysArray } from "from-anywhere";
import { isAbsoluteImport } from "from-anywhere";
import { getRealSpan } from "./getRealSpan.js";
/**
 * Takes swcModuleItems, and returns an array of imports (name + module)
 */
export const getSwcImports = (src, swcModuleItems, absolutePath, projectRoot, fileSpan, operations) => {
    const allOperations = Object.keys(operations);
    const projectRelativePath = absolutePath && projectRoot
        ? makeRelative(absolutePath, projectRoot)
        : undefined;
    const packageName = getObjectKeysArray(operations).find((key) => projectRelativePath?.startsWith(`${operations[key]}/`));
    const imports = swcModuleItems
        .filter((item) => {
        return item.type === "ImportDeclaration";
    })
        .map((moduleItem) => {
        return moduleItem;
    })
        .map((importDeclaration) => {
        // console.dir({ importDeclaration }, { depth: 99 });
        const span = getRealSpan(importDeclaration.span, fileSpan);
        const { start, end, relevantCode } = span;
        const length = end - start;
        const module = importDeclaration.source.value;
        const isTypeImport = importDeclaration.typeOnly;
        const isAbsolute = isAbsoluteImport(module);
        const isModuleFromMonorepo = isAbsolute
            ? allOperations.includes(module)
            : true;
        // console.log({ length, start, end });
        const importSoFar = {
            modelName: "SwcImport",
            absolutePath,
            projectRelativePath,
            packageName,
            module,
            isModuleFromMonorepo,
            isAbsolute,
            isTypeImport,
            start,
            end,
            length,
            raw: relevantCode,
        };
        const imports = importDeclaration.specifiers.map((specifier) => {
            if (specifier.type === "ImportDefaultSpecifier") {
                const importDefaultSpecifier = specifier;
                const swcImport = {
                    ...importSoFar,
                    name: importDefaultSpecifier.local.value,
                    isOptional: importDefaultSpecifier.local.optional,
                    isDefaultImport: true,
                };
                return swcImport;
            }
            if (specifier.type === "ImportNamespaceSpecifier") {
                const importNamespaceSpecifier = specifier;
                const swcImport = {
                    ...importSoFar,
                    name: importNamespaceSpecifier.local.value,
                    isOptional: importNamespaceSpecifier.local.optional,
                    isNamespaceImport: true,
                };
                return swcImport;
            }
            const namedImportSpecifier = specifier;
            const swcImport = {
                ...importSoFar,
                name: namedImportSpecifier.imported?.value ||
                    namedImportSpecifier.local.value,
                alias: namedImportSpecifier.imported?.value
                    ? namedImportSpecifier.local.value
                    : undefined,
                isOptional: namedImportSpecifier.local.optional,
            };
            return swcImport;
        });
        return imports;
    })
        .flat();
    return imports;
};
//# sourceMappingURL=getSwcImports.js.map