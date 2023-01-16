/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATNConfigSet } from "./atn/ATNConfigSet.js";
import { BitSet } from "./misc/BitSet.js";
import { DFA } from "./dfa/DFA.js";
import { Parser } from "./Parser.js";
import { ProxyErrorListener } from "./ProxyErrorListener.js";
import { ParserErrorListener } from "./ParserErrorListener.js";
import { SimulatorState } from "./atn/SimulatorState.js";
import { Token } from "./Token.js";
/**
 * @author Sam Harwell
 */
export declare class ProxyParserErrorListener extends ProxyErrorListener<Token, ParserErrorListener> implements ParserErrorListener {
    constructor(delegates: ParserErrorListener[]);
    reportAmbiguity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, exact: boolean, ambigAlts: BitSet | undefined, configs: ATNConfigSet): void;
    reportAttemptingFullContext(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, conflictingAlts: BitSet | undefined, conflictState: SimulatorState): void;
    reportContextSensitivity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, prediction: number, acceptState: SimulatorState): void;
}
