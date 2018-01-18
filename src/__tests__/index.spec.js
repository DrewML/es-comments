const esCommentsParser = require('..');
const { join } = require('path');
const { readFileSync } = require('fs');

const jQuery = readFileSync(
    join(__dirname, '../../bench/fixtures/jquery-1.7.2.js'),
    'utf8'
);

test('Parses single-line comment when source-file is only one line', () => {
    const [comment] = esCommentsParser('// foo');
    expect(comment.value).toBe('// foo');
});

test('Parses single-line comment when source-file is multiple lines', () => {
    const [comment] = esCommentsParser(`
        alert('hey');
        // single line comment
        alert('heyo');
    `);
    expect(comment.value).toBe('// single line comment');
});

test('Parses multiple single-line comments separated by code', () => {
    const [comment1, comment2] = esCommentsParser(`
        alert('hey');
        // single line comment
        alert('heyo');
        // another single line
    `);

    expect(comment1.value).toBe('// single line comment');
    expect(comment2.value).toBe('// another single line');
});

test('Parses multi-line comment on single-line', () => {
    const [comment] = esCommentsParser(`
        /* foo bar */
    `);
    expect(comment.value).toBe('/* foo bar */');
});

test('Parses multi-line comment acorss multiple lines', () => {
    const [comment] = esCommentsParser(`
        someCode();
        /*
            foo
            bizz
        */
    `);

    expect(comment.value.trim()).toBe(
        `
        /*
            foo
            bizz
        */
    `.trim()
    );
});

test('Parses as 1 comment when single-line comment is used within multiline comment', () => {
    const [comment] = esCommentsParser(`
        /* foo // bar */
    `);
    expect(comment.value).toBe('/* foo // bar */');
});

test('Parses as 1 comment when multi-line comment is used within single-line comment', () => {
    const [comment] = esCommentsParser(`
        someCode();
        // foo /* bar */ test/
        someOtherCode();
    `);
    expect(comment.value).toBe('// foo /* bar */ test/');
});

test('Parses comments in jQuery source without exploding', () => {
    const comments = esCommentsParser(jQuery);
    expect(comments.length).toBe(1153);
});

test('Does not parse multiline comments within string literals with single quote', () => {
    const comments = esCommentsParser(`foo('/* do not parse me */'); `);
    expect(comments.length).toBe(0);
});

test('Does not parse multiline comments within string literals with double quote', () => {
    const comments = esCommentsParser(`foo("/* do not parse me */"); `);
    expect(comments.length).toBe(0);
});

test('Does not parse single line comments within string literals with single quote', () => {
    const comments = esCommentsParser(`foo('// foo'); `);
    expect(comments.length).toBe(0);
});

test('Does not parse single line comments within string literals with double quote', () => {
    const comments = esCommentsParser(`foo("// foo"); `);
    expect(comments.length).toBe(0);
});

test('Reported location is correct for single-line comment', () => {
    const str = `
        // single line comment
        foo();
    `;
    const [comment] = esCommentsParser(str);
    expect(comment.value).toBe(str.substring(comment.start, comment.end));
});

test('Reported location is correct for multi-line comment', () => {
    const str = `
       /*
           foo
         bizz
       */
      foo();
    `;
    const [comment] = esCommentsParser(str);
    expect(comment.value).toBe(str.substring(comment.start, comment.end));
});
