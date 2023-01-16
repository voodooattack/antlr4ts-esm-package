/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { RecognitionException } from "./RecognitionException.js";
import { Parser } from "./Parser.js";
import { ParserRuleContext } from "./ParserRuleContext.js";
/** This signifies any kind of mismatched input exceptions such as
 *  when the current input does not match the expected token.
 */
export declare class InputMismatchException extends RecognitionException {
    constructor(/*@NotNull*/ recognizer: Parser);
    constructor(/*@NotNull*/ recognizer: Parser, state: number, context: ParserRuleContext);
}
