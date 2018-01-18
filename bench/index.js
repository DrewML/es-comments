const { join } = require('path');
const BenchTable = require('benchtable');
const { readFileSync } = require('fs');
const parseESComments = require('..');
const extractComments = require('extract-comments');
const getComments = require('get-comments');
const commentRegex = require('comment-regex');

const jQuery = readFileSync(
    join(__dirname, 'fixtures/jquery-1.7.2.js'),
    'utf8'
);
const suite = new BenchTable('Comment Parsers', { isTransposed: true });

suite.addFunction('es-comments (this package)', src => {
    parseESComments(src);
});
suite.addFunction('extract-comments', src => {
    extractComments(src);
});
suite.addFunction('get-comments', src => {
    getComments(src, true);
});
suite.addFunction('comment-regex', src => {
    src.match(commentRegex());
});

suite.addInput('jQuery 1.7.2', [jQuery]);

suite
    .on('cycle', function(event) {
        console.log(event.target.toString());
    })
    .on('error', function(event) {
        throw event.target.error;
    })
    .on('complete', function() {
        console.log(suite.table.toString());
    })
    .run({ async: false });
