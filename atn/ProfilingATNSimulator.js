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
// ConvertTo-TS run at 2016-10-04T11:26:36.4188352-07:00
import { AmbiguityInfo } from "./AmbiguityInfo.js";
import { ATN } from "./ATN.js";
import { ATNSimulator } from "./ATNSimulator.js";
import { ContextSensitivityInfo } from "./ContextSensitivityInfo.js";
import { DecisionInfo } from "./DecisionInfo.js";
import { ErrorInfo } from "./ErrorInfo.js";
import { NotNull, Override } from "../Decorators.js";
import { LookaheadEventInfo } from "./LookaheadEventInfo.js";
import { ParserATNSimulator } from "./ParserATNSimulator.js";
import { PredicateEvalInfo } from "./PredicateEvalInfo.js";
import { SemanticContext } from "./SemanticContext.js";
import { SimulatorState } from "./SimulatorState.js";
/**
 * @since 4.3
 */
export class ProfilingATNSimulator extends ParserATNSimulator {
    decisions;
    numDecisions;
    _input;
    _startIndex = 0;
    _sllStopIndex = 0;
    _llStopIndex = 0;
    currentDecision = 0;
    currentState;
    /** At the point of LL failover, we record how SLL would resolve the conflict so that
     *  we can determine whether or not a decision / input pair is context-sensitive.
     *  If LL gives a different result than SLL's predicted alternative, we have a
     *  context sensitivity for sure. The converse is not necessarily true, however.
     *  It's possible that after conflict resolution chooses minimum alternatives,
     *  SLL could get the same answer as LL. Regardless of whether or not the result indicates
     *  an ambiguity, it is not treated as a context sensitivity because LL prediction
     *  was not required in order to produce a correct prediction for this decision and input sequence.
     *  It may in fact still be a context sensitivity but we don't know by looking at the
     *  minimum alternatives for the current input.
     */
    conflictingAltResolvedBySLL = 0;
    constructor(parser) {
        super(parser.interpreter.atn, parser);
        this.optimize_ll1 = false;
        this.reportAmbiguities = true;
        this.numDecisions = this.atn.decisionToState.length;
        this.decisions = [];
        for (let i = 0; i < this.numDecisions; i++) {
            this.decisions.push(new DecisionInfo(i));
        }
    }
    adaptivePredict(input, decision, outerContext, useContext) {
        if (useContext !== undefined) {
            return super.adaptivePredict(input, decision, outerContext, useContext);
        }
        try {
            this._input = input;
            this._startIndex = input.index;
            // it's possible for SLL to reach a conflict state without consuming any input
            this._sllStopIndex = this._startIndex - 1;
            this._llStopIndex = -1;
            this.currentDecision = decision;
            this.currentState = undefined;
            this.conflictingAltResolvedBySLL = ATN.INVALID_ALT_NUMBER;
            let start = process.hrtime();
            let alt = super.adaptivePredict(input, decision, outerContext);
            let stop = process.hrtime();
            let nanoseconds = (stop[0] - start[0]) * 1000000000;
            if (nanoseconds === 0) {
                nanoseconds = stop[1] - start[1];
            }
            else {
                // Add nanoseconds from start to end of that second, plus start of the end second to end
                nanoseconds += (1000000000 - start[1]) + stop[1];
            }
            this.decisions[decision].timeInPrediction += nanoseconds;
            this.decisions[decision].invocations++;
            let SLL_k = this._sllStopIndex - this._startIndex + 1;
            this.decisions[decision].SLL_TotalLook += SLL_k;
            this.decisions[decision].SLL_MinLook = this.decisions[decision].SLL_MinLook === 0 ? SLL_k : Math.min(this.decisions[decision].SLL_MinLook, SLL_k);
            if (SLL_k > this.decisions[decision].SLL_MaxLook) {
                this.decisions[decision].SLL_MaxLook = SLL_k;
                this.decisions[decision].SLL_MaxLookEvent =
                    new LookaheadEventInfo(decision, undefined, alt, input, this._startIndex, this._sllStopIndex, false);
            }
            if (this._llStopIndex >= 0) {
                let LL_k = this._llStopIndex - this._startIndex + 1;
                this.decisions[decision].LL_TotalLook += LL_k;
                this.decisions[decision].LL_MinLook = this.decisions[decision].LL_MinLook === 0 ? LL_k : Math.min(this.decisions[decision].LL_MinLook, LL_k);
                if (LL_k > this.decisions[decision].LL_MaxLook) {
                    this.decisions[decision].LL_MaxLook = LL_k;
                    this.decisions[decision].LL_MaxLookEvent =
                        new LookaheadEventInfo(decision, undefined, alt, input, this._startIndex, this._llStopIndex, true);
                }
            }
            return alt;
        }
        finally {
            this._input = undefined;
            this.currentDecision = -1;
        }
    }
    getStartState(dfa, input, outerContext, useContext) {
        let state = super.getStartState(dfa, input, outerContext, useContext);
        this.currentState = state;
        return state;
    }
    computeStartState(dfa, globalContext, useContext) {
        let state = super.computeStartState(dfa, globalContext, useContext);
        this.currentState = state;
        return state;
    }
    computeReachSet(dfa, previous, t, contextCache) {
        if (this._input === undefined) {
            throw new Error("Invalid state");
        }
        let reachState = super.computeReachSet(dfa, previous, t, contextCache);
        if (reachState == null) {
            // no reach on current lookahead symbol. ERROR.
            this.decisions[this.currentDecision].errors.push(new ErrorInfo(this.currentDecision, previous, this._input, this._startIndex, this._input.index));
        }
        this.currentState = reachState;
        return reachState;
    }
    getExistingTargetState(previousD, t) {
        if (this.currentState === undefined || this._input === undefined) {
            throw new Error("Invalid state");
        }
        // this method is called after each time the input position advances
        if (this.currentState.useContext) {
            this._llStopIndex = this._input.index;
        }
        else {
            this._sllStopIndex = this._input.index;
        }
        let existingTargetState = super.getExistingTargetState(previousD, t);
        if (existingTargetState != null) {
            // this method is directly called by execDFA; must construct a SimulatorState
            // to represent the current state for this case
            this.currentState = new SimulatorState(this.currentState.outerContext, existingTargetState, this.currentState.useContext, this.currentState.remainingOuterContext);
            if (this.currentState.useContext) {
                this.decisions[this.currentDecision].LL_DFATransitions++;
            }
            else {
                this.decisions[this.currentDecision].SLL_DFATransitions++; // count only if we transition over a DFA state
            }
            if (existingTargetState === ATNSimulator.ERROR) {
                let state = new SimulatorState(this.currentState.outerContext, previousD, this.currentState.useContext, this.currentState.remainingOuterContext);
                this.decisions[this.currentDecision].errors.push(new ErrorInfo(this.currentDecision, state, this._input, this._startIndex, this._input.index));
            }
        }
        return existingTargetState;
    }
    computeTargetState(dfa, s, remainingGlobalContext, t, useContext, contextCache) {
        let targetState = super.computeTargetState(dfa, s, remainingGlobalContext, t, useContext, contextCache);
        if (useContext) {
            this.decisions[this.currentDecision].LL_ATNTransitions++;
        }
        else {
            this.decisions[this.currentDecision].SLL_ATNTransitions++;
        }
        return targetState;
    }
    evalSemanticContextImpl(pred, parserCallStack, alt) {
        if (this.currentState === undefined || this._input === undefined) {
            throw new Error("Invalid state");
        }
        let result = super.evalSemanticContextImpl(pred, parserCallStack, alt);
        if (!(pred instanceof SemanticContext.PrecedencePredicate)) {
            let fullContext = this._llStopIndex >= 0;
            let stopIndex = fullContext ? this._llStopIndex : this._sllStopIndex;
            this.decisions[this.currentDecision].predicateEvals.push(new PredicateEvalInfo(this.currentState, this.currentDecision, this._input, this._startIndex, stopIndex, pred, result, alt));
        }
        return result;
    }
    reportContextSensitivity(dfa, prediction, acceptState, startIndex, stopIndex) {
        if (this._input === undefined) {
            throw new Error("Invalid state");
        }
        if (prediction !== this.conflictingAltResolvedBySLL) {
            this.decisions[this.currentDecision].contextSensitivities.push(new ContextSensitivityInfo(this.currentDecision, acceptState, this._input, startIndex, stopIndex));
        }
        super.reportContextSensitivity(dfa, prediction, acceptState, startIndex, stopIndex);
    }
    reportAttemptingFullContext(dfa, conflictingAlts, conflictState, startIndex, stopIndex) {
        if (conflictingAlts != null) {
            this.conflictingAltResolvedBySLL = conflictingAlts.nextSetBit(0);
        }
        else {
            this.conflictingAltResolvedBySLL = conflictState.s0.configs.getRepresentedAlternatives().nextSetBit(0);
        }
        this.decisions[this.currentDecision].LL_Fallback++;
        super.reportAttemptingFullContext(dfa, conflictingAlts, conflictState, startIndex, stopIndex);
    }
    reportAmbiguity(dfa, D, startIndex, stopIndex, exact, ambigAlts, configs) {
        if (this.currentState === undefined || this._input === undefined) {
            throw new Error("Invalid state");
        }
        let prediction;
        if (ambigAlts != null) {
            prediction = ambigAlts.nextSetBit(0);
        }
        else {
            prediction = configs.getRepresentedAlternatives().nextSetBit(0);
        }
        if (this.conflictingAltResolvedBySLL !== ATN.INVALID_ALT_NUMBER && prediction !== this.conflictingAltResolvedBySLL) {
            // Even though this is an ambiguity we are reporting, we can
            // still detect some context sensitivities.  Both SLL and LL
            // are showing a conflict, hence an ambiguity, but if they resolve
            // to different minimum alternatives we have also identified a
            // context sensitivity.
            this.decisions[this.currentDecision].contextSensitivities.push(new ContextSensitivityInfo(this.currentDecision, this.currentState, this._input, startIndex, stopIndex));
        }
        this.decisions[this.currentDecision].ambiguities.push(new AmbiguityInfo(this.currentDecision, this.currentState, ambigAlts, this._input, startIndex, stopIndex));
        super.reportAmbiguity(dfa, D, startIndex, stopIndex, exact, ambigAlts, configs);
    }
    // ---------------------------------------------------------------------
    getDecisionInfo() {
        return this.decisions;
    }
    getCurrentState() {
        return this.currentState;
    }
}
__decorate([
    Override,
    __param(0, NotNull)
], ProfilingATNSimulator.prototype, "adaptivePredict", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "getStartState", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "computeStartState", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "computeReachSet", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "getExistingTargetState", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "computeTargetState", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "evalSemanticContextImpl", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "reportContextSensitivity", null);
__decorate([
    Override
], ProfilingATNSimulator.prototype, "reportAttemptingFullContext", null);
__decorate([
    Override,
    __param(0, NotNull),
    __param(5, NotNull),
    __param(6, NotNull)
], ProfilingATNSimulator.prototype, "reportAmbiguity", null);
//# sourceMappingURL=ProfilingATNSimulator.js.map