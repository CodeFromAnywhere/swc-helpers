# Local OpenAPIs

Later, `edge-util` could be a great example of a local OpenAPI. Maybe I can adapt the OpenAPI standard to also include code from files and create a server for that too. This way I can use the same AI search for local functions as well. It's a bit more work, but could be very fruitful. 🚀 Main thing that would be needed would be the ability to dynamic-import functions locally to be able to run them locally in the browser. This way, we can set up a nice next-project too which hosts that. Needs more thought though...

1. edge function to get code from npm package at version (or latest)
2. follow `main` and/or `exports` or `files` according to package.json spec to find available code to import, then filter on `.d.ts` files.
3. in order of least dependencies, use `swc-helpers` (or AI) to parse all `.d.ts` into JSONSchema
4. Turn the JSON Schema into a semantic OpenAPI and from that, an openapi.
5. DONE! We can use this for agents to write perfect JS. Also, we can create a server that can run js-code dynamically.
6. Alternatively, we might want to parse JSON Schema to `.d.ts` with our simplified schema to give a better context for codegen. https://www.npmjs.com/package/json-schema-to-dts

# TODO

Cleanup os/packages:

text-or-binary
marked-util
schema-util --> schema-helpers
swc-util --> swc-helpers

Go over swc-helpers and find the useful functions for a potential openapi

Check if it runs on vercel and make a composable thing that works with the github files checker.

Make swc-util able to generate an openapi for any functional package.

remove all un-needed wrapping of things

makeRelative is nothing

generateRandomString is just half of the first line

Some are missing randomly... report when it can't be found

See https://claude.ai/chat/b087059f-64b5-434b-9423-f974ffd742db and try to make something like this but without too much LLM work. The ability to analyze code and turn it into an openapi spec, even if it's not entirely functional, is truly useful for refactors.
