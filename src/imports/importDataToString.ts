import { SwcImport } from "../types/types.js";

/**
 * Based on the values of the import, generates it.
 *
 * NB: does not support multiple named imports in a single import as it's deemed unneccessary
 */
export const importDataToString = (item: SwcImport) => {
  const typeString = item.isTypeImport ? " type" : "";

  if (item.isNamespaceImport) {
    return `import${typeString} * as ${item.name} from "${item.module}";`;
  }

  if (item.isDefaultImport) {
    return `import${typeString} ${item.name} from "${item.module}";`;
  }

  if (item.alias) {
    return `import${typeString} { ${item.name} as ${item.alias} } from "${item.module}";`;
  }

  return `import${typeString} { ${item.name} } from "${item.module}";`;
};
