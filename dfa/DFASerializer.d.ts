/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATN } from "../atn/ATN.js";
import { DFA } from "./DFA.js";
import { DFAState } from "./DFAState.js";
import { Recognizer } from "../Recognizer.js";
import { Vocabulary } from "../Vocabulary.js";
/** A DFA walker that knows how to dump them to serialized strings. */
export declare class DFASerializer {
    private dfa;
    private vocabulary;
    ruleNames?: string[];
    atn?: ATN;
    constructor(/*@NotNull*/ dfa: DFA, /*@NotNull*/ vocabulary: Vocabulary);
    constructor(/*@NotNull*/ dfa: DFA, /*@Nullable*/ parser: Recognizer<any, any> | undefined);
    constructor(/*@NotNull*/ dfa: DFA, /*@NotNull*/ vocabulary: Vocabulary, /*@Nullable*/ ruleNames: string[] | undefined, /*@Nullable*/ atn: ATN | undefined);
    toString(): string;
    protected getContextLabel(i: number): string;
    protected getEdgeLabel(i: number): string;
    getStateString(s: DFAState): string;
}
