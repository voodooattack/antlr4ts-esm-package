/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Interval } from "./misc/Interval.js";
import { NotNull, Override } from "./Decorators.js";
import { Token } from "./Token.js";
let CommonToken = class CommonToken {
    /**
     * An empty {@link Tuple2} which is used as the default value of
     * {@link #source} for tokens that do not have a source.
     */
    static EMPTY_SOURCE = { source: undefined, stream: undefined };
    /**
     * This is the backing field for `type`.
     */
    _type;
    /**
     * This is the backing field for {@link #getLine} and {@link #setLine}.
     */
    _line = 0;
    /**
     * This is the backing field for {@link #getCharPositionInLine} and
     * {@link #setCharPositionInLine}.
     */
    _charPositionInLine = -1; // set to invalid position
    /**
     * This is the backing field for {@link #getChannel} and
     * {@link #setChannel}.
     */
    _channel = Token.DEFAULT_CHANNEL;
    /**
     * This is the backing field for {@link #getTokenSource} and
     * {@link #getInputStream}.
     *
     * These properties share a field to reduce the memory footprint of
     * {@link CommonToken}. Tokens created by a {@link CommonTokenFactory} from
     * the same source and input stream share a reference to the same
     * {@link Tuple2} containing these values.
     */
    source;
    /**
     * This is the backing field for {@link #getText} when the token text is
     * explicitly set in the constructor or via {@link #setText}.
     *
     * @see `text`
     */
    _text;
    /**
     * This is the backing field for `tokenIndex`.
     */
    index = -1;
    /**
     * This is the backing field for `startIndex`.
     */
    start;
    /**
     * This is the backing field for `stopIndex`.
     */
    stop;
    constructor(type, text, source = CommonToken.EMPTY_SOURCE, channel = Token.DEFAULT_CHANNEL, start = 0, stop = 0) {
        this._text = text;
        this._type = type;
        this.source = source;
        this._channel = channel;
        this.start = start;
        this.stop = stop;
        if (source.source != null) {
            this._line = source.source.line;
            this._charPositionInLine = source.source.charPositionInLine;
        }
    }
    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     * If `oldToken` is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link #text} field and
     * the {@link Tuple2} stored in {@link #source}. Otherwise, {@link #text} will
     * be assigned the result of calling {@link #getText}, and {@link #source}
     * will be constructed from the result of {@link Token#getTokenSource} and
     * {@link Token#getInputStream}.
     *
     * @param oldToken The token to copy.
     */
    static fromToken(oldToken) {
        let result = new CommonToken(oldToken.type, undefined, CommonToken.EMPTY_SOURCE, oldToken.channel, oldToken.startIndex, oldToken.stopIndex);
        result._line = oldToken.line;
        result.index = oldToken.tokenIndex;
        result._charPositionInLine = oldToken.charPositionInLine;
        if (oldToken instanceof CommonToken) {
            result._text = oldToken._text;
            result.source = oldToken.source;
        }
        else {
            result._text = oldToken.text;
            result.source = { source: oldToken.tokenSource, stream: oldToken.inputStream };
        }
        return result;
    }
    get type() {
        return this._type;
    }
    // @Override
    set type(type) {
        this._type = type;
    }
    get line() {
        return this._line;
    }
    // @Override
    set line(line) {
        this._line = line;
    }
    get text() {
        if (this._text != null) {
            return this._text;
        }
        let input = this.inputStream;
        if (input == null) {
            return undefined;
        }
        let n = input.size;
        if (this.start < n && this.stop < n) {
            return input.getText(Interval.of(this.start, this.stop));
        }
        else {
            return "<EOF>";
        }
    }
    /**
     * Explicitly set the text for this token. If {code text} is not
     * `undefined`, then {@link #getText} will return this value rather than
     * extracting the text from the input.
     *
     * @param text The explicit text of the token, or `undefined` if the text
     * should be obtained from the input along with the start and stop indexes
     * of the token.
     */
    // @Override
    set text(text) {
        this._text = text;
    }
    get charPositionInLine() {
        return this._charPositionInLine;
    }
    // @Override
    set charPositionInLine(charPositionInLine) {
        this._charPositionInLine = charPositionInLine;
    }
    get channel() {
        return this._channel;
    }
    // @Override
    set channel(channel) {
        this._channel = channel;
    }
    get startIndex() {
        return this.start;
    }
    set startIndex(start) {
        this.start = start;
    }
    get stopIndex() {
        return this.stop;
    }
    set stopIndex(stop) {
        this.stop = stop;
    }
    get tokenIndex() {
        return this.index;
    }
    // @Override
    set tokenIndex(index) {
        this.index = index;
    }
    get tokenSource() {
        return this.source.source;
    }
    get inputStream() {
        return this.source.stream;
    }
    toString(recognizer) {
        let channelStr = "";
        if (this._channel > 0) {
            channelStr = ",channel=" + this._channel;
        }
        let txt = this.text;
        if (txt != null) {
            txt = txt.replace(/\n/g, "\\n");
            txt = txt.replace(/\r/g, "\\r");
            txt = txt.replace(/\t/g, "\\t");
        }
        else {
            txt = "<no text>";
        }
        let typeString = String(this._type);
        if (recognizer) {
            typeString = recognizer.vocabulary.getDisplayName(this._type);
        }
        return "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" + txt + "',<" + typeString + ">" + channelStr + "," + this._line + ":" + this.charPositionInLine + "]";
    }
};
__decorate([
    NotNull
], CommonToken.prototype, "source", void 0);
__decorate([
    Override
], CommonToken.prototype, "type", null);
__decorate([
    Override
], CommonToken.prototype, "line", null);
__decorate([
    Override
], CommonToken.prototype, "text", null);
__decorate([
    Override
], CommonToken.prototype, "charPositionInLine", null);
__decorate([
    Override
], CommonToken.prototype, "channel", null);
__decorate([
    Override
], CommonToken.prototype, "startIndex", null);
__decorate([
    Override
], CommonToken.prototype, "stopIndex", null);
__decorate([
    Override
], CommonToken.prototype, "tokenIndex", null);
__decorate([
    Override
], CommonToken.prototype, "tokenSource", null);
__decorate([
    Override
], CommonToken.prototype, "inputStream", null);
__decorate([
    Override
], CommonToken.prototype, "toString", null);
__decorate([
    __param(0, NotNull)
], CommonToken, "fromToken", null);
CommonToken = __decorate([
    __param(2, NotNull)
], CommonToken);
export { CommonToken };
//# sourceMappingURL=CommonToken.js.map