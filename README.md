# es-comments

Parses a list of comments from an ECMAScript (JavaScript) source file.

## Install

```sh
npm install es-comments
```

## Usage

```js
const parseESComments = require('es-comments');
const someSourceCode = `
    // Some single line comment
    console.log('hello world');
`;
const comments = parseESComments(someSourceCode);
/* Outputs:
    [
      {
        "value": "// Some single line comment",
        "start": 9,
        "end": 36
      }
    ]
*/
```
