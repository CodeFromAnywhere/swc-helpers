# dangle-fixing-span-problems

I have tried the whole day to get this thing done (12-4-2023) However, there seem to be some severe limitations to this library.

1. Span keeps counting through, and trailing comments are omitted.

- when going sync, it's very buggy and imperformant
- when going async, there's no way to detect dangles

A solution may be to ensure there are never any `endDangles`. We can then assume everything that is longer is a start dangle.

## Update (14:17)

It is working. I successfully removed the need for tracking the offset of the previous file by calculating the dangle in a more simple way. I even succeeded to still calculate the end-dangle, but didn't add it yet.

It's very tricky to get the code from the spans, because the compiler keeps counting upon parsing, which makes it very hard. However, you can get it if you do a smart calculation without keeping track of it in variables and such.

We have it working in async mode! Perfect.

## Update 16 june 2023

It still wasnt' fixed for end dangles. However, I came with the ingenious idea of rendering a "true;" at the end of the file before parsing it, without adding it to the src content. This made sure there is never an end-dangle, because "true" is always parsed, and thus also the comments before it need to be taken into account. Pretty nifty!

I wonder if this might break anywhere. But for now it seems like a good idea.
