/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATNState } from "./ATNState.js";
import { RuleStartState } from "./RuleStartState.js";
import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";
/** */
export declare class RuleTransition extends Transition {
    /** Ptr to the rule definition object for this rule ref */
    ruleIndex: number;
    precedence: number;
    /** What node to begin computations following ref to rule */
    followState: ATNState;
    tailCall: boolean;
    optimizedTailCall: boolean;
    constructor(ruleStart: RuleStartState, ruleIndex: number, precedence: number, followState: ATNState);
    get serializationType(): TransitionType;
    get isEpsilon(): boolean;
    matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
}
