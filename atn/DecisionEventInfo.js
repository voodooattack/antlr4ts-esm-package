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
// ConvertTo-TS run at 2016-10-04T11:26:28.2401032-07:00
import { NotNull } from "../Decorators.js";
/**
 * This is the base class for gathering detailed information about prediction
 * events which occur during parsing.
 *
 * Note that we could record the parser call stack at the time this event
 * occurred but in the presence of left recursive rules, the stack is kind of
 * meaningless. It's better to look at the individual configurations for their
 * individual stacks. Of course that is a {@link PredictionContext} object
 * not a parse tree node and so it does not have information about the extent
 * (start...stop) of the various subtrees. Examining the stack tops of all
 * configurations provide the return states for the rule invocations.
 * From there you can get the enclosing rule.
 *
 * @since 4.3
 */
let DecisionEventInfo = class DecisionEventInfo {
    /**
     * The invoked decision number which this event is related to.
     *
     * @see ATN#decisionToState
     */
    decision;
    /**
     * The simulator state containing additional information relevant to the
     * prediction state when the current event occurred, or `undefined` if no
     * additional information is relevant or available.
     */
    state;
    /**
     * The input token stream which is being parsed.
     */
    input;
    /**
     * The token index in the input stream at which the current prediction was
     * originally invoked.
     */
    startIndex;
    /**
     * The token index in the input stream at which the current event occurred.
     */
    stopIndex;
    /**
     * `true` if the current event occurred during LL prediction;
     * otherwise, `false` if the input occurred during SLL prediction.
     */
    fullCtx;
    constructor(decision, state, input, startIndex, stopIndex, fullCtx) {
        this.decision = decision;
        this.fullCtx = fullCtx;
        this.stopIndex = stopIndex;
        this.input = input;
        this.startIndex = startIndex;
        this.state = state;
    }
};
__decorate([
    NotNull
], DecisionEventInfo.prototype, "input", void 0);
DecisionEventInfo = __decorate([
    __param(2, NotNull)
], DecisionEventInfo);
export { DecisionEventInfo };
//# sourceMappingURL=DecisionEventInfo.js.map