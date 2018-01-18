class ESCommentsParser {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.comments = [];
    }

    get isDone() {
        return this.position > this.input.length;
    }

    get currentChar() {
        return this.input[this.position];
    }

    prior() {
        return this.input[this.position - 1];
    }

    next(moveForwardBy = 1) {
        this.position = this.position + moveForwardBy;
    }

    parse() {
        while (!this.isDone && this.currentChar !== '/') this.next();
        // Exhausted the file, didn't find a comment
        if (this.isDone) return this;

        const next = this.input[this.position + 1];
        if (next === '/') {
            this.parseSingleLineComment();
        } else if (next === '*') {
            this.parseMultilineComment();
        } else {
            this.next();
        }

        return this.isDone ? this : this.parse();
    }

    parseSingleLineComment() {
        const buf = [];
        const { position: start } = this;

        while (!this.isDone && !/\n/.test(this.currentChar)) {
            buf.push(this.currentChar);
            this.next();
        }

        this.comments.push({
            value: buf.join(''),
            start,
            end: this.position
        });
    }

    parseMultilineComment() {
        const buf = ['/*'];
        const { position: start } = this;
        // Skip first two characters already in buf
        this.next(2);

        while (true) {
            if (this.isDone) break;

            const { currentChar } = this;
            const atCommentEnd = currentChar === '/' && this.prior() === '*';

            buf.push(currentChar);
            this.next();

            if (atCommentEnd) break;
        }

        this.comments.push({
            value: buf.join(''),
            start,
            end: this.position
        });
    }
}

/**
 * Given a string of ECMAScript code, will return the value of all comments,
 * and their respective ranges
 *
 * It is a deliberate design choice not to handle parsing the following productions
 * specified in the spec within Annex B:
 *    - SingleLineHTMLOpenComment
 *    - SingleLineHTMLCloseComment
 */
module.exports = function esCommentsParser(input) {
    const parser = new ESCommentsParser(input);
    return parser.parse().comments;
};
