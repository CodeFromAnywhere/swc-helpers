import { notEmpty } from "from-anywhere";
import { getSchema } from "schema-helpers";
export const getPossibleRefs = (schemaItem) => {
    if (!schemaItem.schema?.definitions) {
        return [];
    }
    const possibleRefs = Object.keys(schemaItem.schema.definitions)
        .map((name) => {
        const schema = getSchema(schemaItem.schema?.definitions?.[name]);
        if (!schema) {
            return null;
        }
        return { name, schema };
    })
        .filter(notEmpty);
    return possibleRefs;
};
//# sourceMappingURL=getPossibleRefs.js.map