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
import { Override, NotNull } from "../Decorators.js";
import { Transition } from "./Transition.js";
/** */
let RuleTransition = class RuleTransition extends Transition {
    /** Ptr to the rule definition object for this rule ref */
    ruleIndex; // no Rule object at runtime
    precedence;
    /** What node to begin computations following ref to rule */
    followState;
    tailCall = false;
    optimizedTailCall = false;
    constructor(ruleStart, ruleIndex, precedence, followState) {
        super(ruleStart);
        this.ruleIndex = ruleIndex;
        this.precedence = precedence;
        this.followState = followState;
    }
    get serializationType() {
        return 3 /* TransitionType.RULE */;
    }
    get isEpsilon() {
        return true;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
        return false;
    }
};
__decorate([
    NotNull
], RuleTransition.prototype, "followState", void 0);
__decorate([
    Override
], RuleTransition.prototype, "serializationType", null);
__decorate([
    Override
], RuleTransition.prototype, "isEpsilon", null);
__decorate([
    Override
], RuleTransition.prototype, "matches", null);
RuleTransition = __decorate([
    __param(0, NotNull),
    __param(3, NotNull)
], RuleTransition);
export { RuleTransition };
//# sourceMappingURL=RuleTransition.js.map