import { tryRequireFunctionsWithConfig } from "./tryRequireFunctionsWithConfig.js";
/**
 * BOOM! Gets all plugin functions in under "42.042ms"
 *
 * Hmmm... it's 800ms in bun :/
 *
 * Can't be coincidence 🤯
 */
const test = () => {
  console.time();
  tryRequireFunctionsWithConfig(([name, item]) => {
    return !!item.config?.isPublic;
  }).then((result) => {
    console.timeEnd();
    console.log({ result: result?.length });
  });
};
test();
