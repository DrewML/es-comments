const esCommentsParser = require('..');

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
