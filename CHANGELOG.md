# swc-util

useful things on top of swc

UPDATE: since I did a big refactor of code-types, almost all types are broken as soon as I'll import stuff from code-types that aren't types. This sucks! Let's fucking fix this once and for all, before I continue with the MVP.

GOAL: autofix all imports by using swc-util to update imports to come from the correct place if the import seems to be incorrect

make todolist!

======

# Cleanup + dev experience goals

Finish `swc-util` and replace `TsFunction`/`TsImport`/`TsExport`. This should:

- fix `generateSdkOperations` often occuring problem of non-existing stuff.
- add ability to quickly rename/move function/operation
- fix import loops much more quickly

Get to a point to easily check dependants / dependencies for every function and every operation.

Add the possibility to add a `modelConfig` constant besides the model, with the name `[modelName]Config` that satisfies the `SwcInterfaceConfig` interface. If we can get this in realtime from the .ts file, we've won.

If performance needs to be higher, we can skip scanning non-capitalised files and tsx files when searching for all TsInterfaces. To increase performance even more, we can skip if there's no attached .json, .md, or .csv file with the same name, because this indicates there's no data (as long as we're going to use this convention)

## Metacoding:

- get all function names from all code
- get all type names from all code
- if moved, remove function
- if moved, create function in its own file in new location
- if renamed, rename function
- if renamed and filename was the same as the function name, rename file too
- re-generate index
- find all imports of that function and remove them
- instead of the ones removed, add a new one with correct name and module (and relative imports in the same operation)
- `buildEverything`

Use the `/operations` ui to move and rename functions until the codebase has:

- ZERO circular dependencies
- ZERO duplicate namings
- Super small bundlesize per operation

# Getting schemas and simplified schemas:

I get the error for a simple function with generics (`searchGoogle`): `TypeError: Cannot read properties of undefined (reading 'getId')` (got this for parsing searchGoogle serp-wrapper)

After googling it, and checking out vega ts-json-schema-generator, there is no-one with this problem. No solution. Also there seems to be no good alternative.

What about parsing the simplified schema from swc myself? All the information is there, right? It's a cool idea. Or maybe I should just get rid of Generics... It is a big complexity that simply won't work on the form.

# NB: Update: 24-08-2023

Newest version doesn't work. I therefore have pinned version at `"@swc/core": "1.3.71"`

# Update: july 1st 2024

I've cleaned up my monorepo a bit more and turned this into a functioning standalone package. Of course, there's still a lot of trash inhere, but at least everything is accessible.
