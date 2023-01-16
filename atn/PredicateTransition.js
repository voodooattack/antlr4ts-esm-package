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
// ConvertTo-TS run at 2016-10-04T11:26:35.2826960-07:00
import { AbstractPredicateTransition } from "./AbstractPredicateTransition";
import { NotNull, Override } from "../Decorators";
import { SemanticContext } from "./SemanticContext";
/** TODO: this is old comment:
 *  A tree of semantic predicates from the grammar AST if label==SEMPRED.
 *  In the ATN, labels will always be exactly one predicate, but the DFA
 *  may have to combine a bunch of them as it collects predicates from
 *  multiple ATN configurations into a single DFA state.
 */
let PredicateTransition = class PredicateTransition extends AbstractPredicateTransition {
    constructor(target, ruleIndex, predIndex, isCtxDependent) {
        super(target);
        this.ruleIndex = ruleIndex;
        this.predIndex = predIndex;
        this.isCtxDependent = isCtxDependent;
    }
    get serializationType() {
        return 4 /* TransitionType.PREDICATE */;
    }
    get isEpsilon() { return true; }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
        return false;
    }
    get predicate() {
        return new SemanticContext.Predicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }
    toString() {
        return "pred_" + this.ruleIndex + ":" + this.predIndex;
    }
};
__decorate([
    Override
], PredicateTransition.prototype, "serializationType", null);
__decorate([
    Override
], PredicateTransition.prototype, "isEpsilon", null);
__decorate([
    Override
], PredicateTransition.prototype, "matches", null);
__decorate([
    Override,
    NotNull
], PredicateTransition.prototype, "toString", null);
PredicateTransition = __decorate([
    __param(0, NotNull)
], PredicateTransition);
export { PredicateTransition };
//# sourceMappingURL=PredicateTransition.js.map