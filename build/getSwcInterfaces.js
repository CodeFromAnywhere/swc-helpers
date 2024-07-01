import { makeRelative } from "from-anywhere";
import { notEmpty } from "from-anywhere";
import { getModuleItemName } from "./getModuleItemName.js";
import { getRealSpan } from "./getRealSpan.js";
/**
For now, gets only names/locations and isExported  :) it's enough
 */
export const getSwcInterfaces = (src, swcModuleItems, absolutePath, projectRoot, fileSpan) => {
    const interfaceModuleItems = swcModuleItems.filter((x) => {
        if (["TsInterfaceDeclaration", "TsTypeAliasDeclaration"].includes(x.type)) {
            return true;
        }
        if (x.type === "ExportDeclaration") {
            if (["TsInterfaceDeclaration", "TsTypeAliasDeclaration"].includes(x.declaration.type)) {
                return true;
            }
        }
        return false;
    });
    const swcInterfaces = interfaceModuleItems
        .map((moduleItem) => {
        const name = getModuleItemName(moduleItem);
        if (!name) {
            return;
        }
        const { start, end, relevantCode } = getRealSpan(moduleItem.span, fileSpan);
        const length = end - start;
        const projectRelativePath = absolutePath && projectRoot
            ? makeRelative(absolutePath, projectRoot)
            : undefined;
        const isExported = moduleItem.type === "ExportDeclaration";
        const swcInterface = {
            modelName: "SwcInterface",
            name,
            start,
            end,
            raw: relevantCode,
            length,
            absolutePath,
            projectRelativePath,
            isExported,
        };
        return swcInterface;
    })
        .filter(notEmpty);
    return swcInterfaces;
};
//# sourceMappingURL=getSwcInterfaces.js.map