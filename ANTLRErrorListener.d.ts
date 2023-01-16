/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
/** How to emit recognition errors. */
import { Recognizer } from "./Recognizer.js";
import { RecognitionException } from "./RecognitionException.js";
export interface ANTLRErrorListener<TSymbol> {
    /**
     * Upon syntax error, notify any interested parties. This is not how to
     * recover from errors or compute error messages. {@link ANTLRErrorStrategy}
     * specifies how to recover from syntax errors and how to compute error
     * messages. This listener's job is simply to emit a computed message,
     * though it has enough information to create its own message in many cases.
     *
     * The {@link RecognitionException} is non-`undefined` for all syntax errors except
     * when we discover mismatched token errors that we can recover from
     * in-line, without returning from the surrounding rule (via the single
     * token insertion and deletion mechanism).
     *
     * @param recognizer
     *        What parser got the error. From this
     * 		  object, you can access the context as well
     * 		  as the input stream.
     * @param offendingSymbol
     *        The offending token in the input token
     * 		  stream, unless recognizer is a lexer (then it's `undefined`). If
     * 		  no viable alternative error, `e` has token at which we
     * 		  started production for the decision.
     * @param line
     * 		  The line number in the input where the error occurred.
     * @param charPositionInLine
     * 		  The character position within that line where the error occurred.
     * @param msg
     * 		  The message to emit.
     * @param e
     *        The exception generated by the parser that led to
     *        the reporting of an error. It is `undefined` in the case where
     *        the parser was able to recover in line without exiting the
     *        surrounding rule.
     */
    syntaxError?: <T extends TSymbol>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined) => void;
}
