import { findTypescriptCodeInMarkdown } from "./findTypescriptCodeInMarkdown.js";
const test = async () => {
    const x = await findTypescriptCodeInMarkdown(`
Hey look at this code

\`\`\`js

const {plugins}= require("sdk-plugins");
console.log("duhhh")
\`\`\`

wow amazing! it should work try it`);
    const y = await findTypescriptCodeInMarkdown(`
\`\`\`js
const { plugins } = require("sdk-plugins");

(async () => {
      const [_, foxUrl] = await plugins.googleImageSearch('fox');
      await plugins.postLinkedin('Take a look at this cute fox!', foxUrl);
      })()
\`\`\`

`);
    console.log({ x, y });
};
test();
//# sourceMappingURL=findTypescriptCodeInMarkdown.test.js.map