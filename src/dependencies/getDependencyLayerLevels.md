It would be good to have an algorithm that can help to find ways to minimise dependencies.

# Operation based leveling

What about this:

## Step 1: sorting on layer amount of dependencies

- iterate over operations
- take the ones without dependencies
- write them away, remove those, and repeat

## Step 2

- for every operation on every level, I need to know
  - how many functions do we have total?
  - how many different dependencies total?
  - for every dependency, how many different named imports, and how many are there total in that operation?

That would probably be quite insightful!

However, consider the following idea:

# Function based leveling

- split up all code into statements with their dependant statements instead of having many of them in each file
- ensure there are no unused imports, so I'm sure a functional dependency tree will arise
- ensure to detect whether or not a function uses a nodejs or react global
- now do the level thing again (see above). I bet now there are way less levels.
- restructure the functions into packages where there's a maximum of two levels depth with very little interconnectedness between operations

This would definitely be a good way to get a better structure and remove all these loops.

One more idea: what about putting everything in one place?

# Zero leveling

We have node, javascript, react and next.js code. We might as well just put it all in a next.js project. If you put all statements in the same operation, there is also no dependency hell. In the end, how large is my codebase anyway? Not too big I think, so who cares?

I still can't do this with bun because they have no watcher, but isn't next.js good enough?

The problem with next.js is that it doesn't create a `build` folder so it's not possible to launch things like watchers, cronjobs, and databases from a next project.

# Low leveling

What if I use this:

- `fe` package for all react code
- `web` project for the website, which is next.js
- `server` package for all server stuff (watching, cron, db, cli) and node code
- `cjs` package for all cjs code

This seems like sensible v1, but in addition I would use `swc` to create deployed snippets and packages. I would also not use a monorepo for most things. Instead I would simply have some `tsconfig` shortcuts to have simple imports like `rwn/alert` and `rwn/big-button` etc. The api would live in the `fe` or so.
