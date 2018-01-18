# es-comments

Parses a list of comments from an ECMAScript (JavaScript) source file. 0 dependencies, 417 bytes minified + gzipped.

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

## Benchmarks

Benchmarks run on a mid-2015 MacBook Pro. Benchmarks compare running time to other similar npm packages.

```sh
+--------------+----------------------------+------------------+---------------+---------------+
|              │ es-comments (this package) │ extract-comments │ get-comments  │ comment-regex |
+--------------+----------------------------+------------------+---------------+---------------+
| jQuery 1.7.2 │ 49.36 ops/sec              │ 9.27 ops/sec     │ 22.05 ops/sec │ 1,474 ops/sec |
+--------------+----------------------------+------------------+---------------+---------------+
```

tl;dr: If location information is not necessary, and some [misses](https://github.com/sindresorhus/comment-regex/issues/1) are ok, use a RegExp. Otherwise, this package is a good alternative.
