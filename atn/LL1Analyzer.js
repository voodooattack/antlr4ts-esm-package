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
// ConvertTo-TS run at 2016-10-04T11:26:30.4445360-07:00
import { AbstractPredicateTransition } from "./AbstractPredicateTransition.js";
import { Array2DHashSet } from "../misc/Array2DHashSet.js";
import { ATNConfig } from "./ATNConfig.js";
import { BitSet } from "../misc/BitSet.js";
import { IntervalSet } from "../misc/IntervalSet.js";
import { NotNull } from "../Decorators.js";
import { NotSetTransition } from "./NotSetTransition.js";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator.js";
import { PredictionContext } from "./PredictionContext.js";
import { RuleStopState } from "./RuleStopState.js";
import { RuleTransition } from "./RuleTransition.js";
import { Token } from "../Token.js";
import { WildcardTransition } from "./WildcardTransition.js";
let LL1Analyzer = class LL1Analyzer {
    /** Special value added to the lookahead sets to indicate that we hit
     *  a predicate during analysis if `seeThruPreds==false`.
     */
    static HIT_PRED = Token.INVALID_TYPE;
    atn;
    constructor(atn) { this.atn = atn; }
    /**
     * Calculates the SLL(1) expected lookahead set for each outgoing transition
     * of an {@link ATNState}. The returned array has one element for each
     * outgoing transition in `s`. If the closure from transition
     * *i* leads to a semantic predicate before matching a symbol, the
     * element at index *i* of the result will be `undefined`.
     *
     * @param s the ATN state
     * @returns the expected symbols for each outgoing transition of `s`.
     */
    getDecisionLookahead(s) {
        //		System.out.println("LOOK("+s.stateNumber+")");
        if (s == null) {
            return undefined;
        }
        let look = new Array(s.numberOfTransitions);
        for (let alt = 0; alt < s.numberOfTransitions; alt++) {
            let current = new IntervalSet();
            look[alt] = current;
            let lookBusy = new Array2DHashSet(ObjectEqualityComparator.INSTANCE);
            let seeThruPreds = false; // fail to get lookahead upon pred
            this._LOOK(s.transition(alt).target, undefined, PredictionContext.EMPTY_LOCAL, current, lookBusy, new BitSet(), seeThruPreds, false);
            // Wipe out lookahead for this alternative if we found nothing
            // or we had a predicate when we !seeThruPreds
            if (current.size === 0 || current.contains(LL1Analyzer.HIT_PRED)) {
                current = undefined;
                look[alt] = current;
            }
        }
        return look;
    }
    LOOK(s, ctx, stopState) {
        if (stopState === undefined) {
            if (s.atn == null) {
                throw new Error("Illegal state");
            }
            stopState = s.atn.ruleToStopState[s.ruleIndex];
        }
        else if (stopState === null) {
            // This is an explicit request to pass undefined as the stopState to _LOOK. Used to distinguish an overload
            // from the method which simply omits the stopState parameter.
            stopState = undefined;
        }
        let r = new IntervalSet();
        let seeThruPreds = true; // ignore preds; get all lookahead
        let addEOF = true;
        this._LOOK(s, stopState, ctx, r, new Array2DHashSet(), new BitSet(), seeThruPreds, addEOF);
        return r;
    }
    /**
     * Compute set of tokens that can follow `s` in the ATN in the
     * specified `ctx`.
     * <p/>
     * If `ctx` is {@link PredictionContext#EMPTY_LOCAL} and
     * `stopState` or the end of the rule containing `s` is reached,
     * {@link Token#EPSILON} is added to the result set. If `ctx` is not
     * {@link PredictionContext#EMPTY_LOCAL} and `addEOF` is `true`
     * and `stopState` or the end of the outermost rule is reached,
     * {@link Token#EOF} is added to the result set.
     *
     * @param s the ATN state.
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx The outer context, or {@link PredictionContext#EMPTY_LOCAL} if
     * the outer context should not be used.
     * @param look The result lookahead set.
     * @param lookBusy A set used for preventing epsilon closures in the ATN
     * from causing a stack overflow. Outside code should pass
     * `new HashSet<ATNConfig>` for this argument.
     * @param calledRuleStack A set used for preventing left recursion in the
     * ATN from causing a stack overflow. Outside code should pass
     * `new BitSet()` for this argument.
     * @param seeThruPreds `true` to true semantic predicates as
     * implicitly `true` and "see through them", otherwise `false`
     * to treat semantic predicates as opaque and add {@link #HIT_PRED} to the
     * result if one is encountered.
     * @param addEOF Add {@link Token#EOF} to the result if the end of the
     * outermost context is reached. This parameter has no effect if `ctx`
     * is {@link PredictionContext#EMPTY_LOCAL}.
     */
    _LOOK(s, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF) {
        //		System.out.println("_LOOK("+s.stateNumber+", ctx="+ctx);
        let c = ATNConfig.create(s, 0, ctx);
        if (!lookBusy.add(c)) {
            return;
        }
        if (s === stopState) {
            if (PredictionContext.isEmptyLocal(ctx)) {
                look.add(Token.EPSILON);
                return;
            }
            else if (ctx.isEmpty) {
                if (addEOF) {
                    look.add(Token.EOF);
                }
                return;
            }
        }
        if (s instanceof RuleStopState) {
            if (ctx.isEmpty && !PredictionContext.isEmptyLocal(ctx)) {
                if (addEOF) {
                    look.add(Token.EOF);
                }
                return;
            }
            let removed = calledRuleStack.get(s.ruleIndex);
            try {
                calledRuleStack.clear(s.ruleIndex);
                for (let i = 0; i < ctx.size; i++) {
                    if (ctx.getReturnState(i) === PredictionContext.EMPTY_FULL_STATE_KEY) {
                        continue;
                    }
                    let returnState = this.atn.states[ctx.getReturnState(i)];
                    //					System.out.println("popping back to "+retState);
                    this._LOOK(returnState, stopState, ctx.getParent(i), look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                }
            }
            finally {
                if (removed) {
                    calledRuleStack.set(s.ruleIndex);
                }
            }
        }
        let n = s.numberOfTransitions;
        for (let i = 0; i < n; i++) {
            let t = s.transition(i);
            if (t instanceof RuleTransition) {
                if (calledRuleStack.get(t.ruleIndex)) {
                    continue;
                }
                let newContext = ctx.getChild(t.followState.stateNumber);
                try {
                    calledRuleStack.set(t.ruleIndex);
                    this._LOOK(t.target, stopState, newContext, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                }
                finally {
                    calledRuleStack.clear(t.ruleIndex);
                }
            }
            else if (t instanceof AbstractPredicateTransition) {
                if (seeThruPreds) {
                    this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                }
                else {
                    look.add(LL1Analyzer.HIT_PRED);
                }
            }
            else if (t.isEpsilon) {
                this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
            }
            else if (t instanceof WildcardTransition) {
                look.addAll(IntervalSet.of(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType));
            }
            else {
                //				System.out.println("adding "+ t);
                let set = t.label;
                if (set != null) {
                    if (t instanceof NotSetTransition) {
                        set = set.complement(IntervalSet.of(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType));
                    }
                    look.addAll(set);
                }
            }
        }
    }
};
__decorate([
    NotNull
], LL1Analyzer.prototype, "atn", void 0);
__decorate([
    NotNull,
    __param(0, NotNull),
    __param(1, NotNull)
], LL1Analyzer.prototype, "LOOK", null);
__decorate([
    __param(0, NotNull),
    __param(2, NotNull),
    __param(3, NotNull),
    __param(4, NotNull),
    __param(5, NotNull)
], LL1Analyzer.prototype, "_LOOK", null);
LL1Analyzer = __decorate([
    __param(0, NotNull)
], LL1Analyzer);
export { LL1Analyzer };
//# sourceMappingURL=LL1Analyzer.js.map