/**


For every function, I'd like to know:

- does it use node.js stuff, and what (look at imports in file)?
- which functions does it rely on?
- how often is it imported elsewhere, and which functions import it? make them clickable
- what is its purpose?
- part of which operation and categories, and is it an important function (needed to be documented / user facing / api facing?)
- configuration
- potential ways to improve it
- todo
- status
- based on my conventions and coding principles, am I violating anything?
- are there any functions in the codebase that seem to have a similar purpose?
- how many tokens big is this function, and how many tokens would it cost to explain it in its entirety, including the dependencies with a short description?

For every interface, I want to know the following

- what is its purpose, where is it used
- does it have generics and why
- which interfaces does it rely on
- part of which operation and categories?
- does there seem to be anything unfinished here?
- todo
- status
- are there interfaces in the codebase that seem to have a similar purpose?


It seems my codebase is becoming ever-more messy... Answering these questions on the function level will be super useful to systematically improve the codebase. It would be nice to answer some of these question by calculating and some of them with the use of chatgpt/gpt4.

Measuring needs to take place on every filesave I'd say, to be most efficient. Initially we can have a watcher for that. Eventually it needs to be done using the save function on the browser.

Also: https://github.com/getcursor/cursor-codemirror (or use monaco editor)

# About writing in portuguese

It would be insanely cool if I could change the base language of my code and also all written documentation. It would be even cooler to somehow create identical translations for multiple languages and make it able to quickly swap. The latter would obviously be more expensive, but would be beneficial in teams.

If I could do a 1:1 translation of an entire codebase, that, in itself, would be a very cool product, that would help any developer to quickly learn a language. But of course, this is a whole other cutting edge challenge... Let's keep some focus...


*/

export const codeInsights = () => {};
