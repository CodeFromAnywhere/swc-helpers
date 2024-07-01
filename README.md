Initial attempt at using swc to create a CRUD database that uses Typescript as it's storage, without further indexed storage.

Given the speed of swc, this becomes a viable option, and this makes it possible to have a much faster and more stable typerepo!

Also refactors become way easier this way and potentially it can be de foundation of a new IDE that lets you do alterations (with or without AI) to a huge codebase in with high speed and reliability

Motivation:

- good foundation for a framework for metacoding (code that writes code)
- parse a statement dependency tree, file dependency tree, and operation dependency tree
- simplify huge rewrites and refactors, e.g.:
  - changing a functionName everywhere in the codebase
  - moving statements around the codebase
- make the migration to other programming languages or to other Javascript runtimes (e.g. bun.sh) easier
- keep a strict convention of your code
