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
import { NotNull } from "../Decorators.js";
/** An ATN transition between any two ATN states.  Subclasses define
 *  atom, set, epsilon, action, predicate, rule transitions.
 *
 *  This is a one way link.  It emanates from a state (usually via a list of
 *  transitions) and has a target state.
 *
 *  Since we never have to change the ATN transitions once we construct it,
 *  we can fix these transitions as specific classes. The DFA transitions
 *  on the other hand need to update the labels as it adds transitions to
 *  the states. We'll use the term Edge for the DFA to distinguish them from
 *  ATN transitions.
 */
let Transition = class Transition {
    static serializationNames = [
        "INVALID",
        "EPSILON",
        "RANGE",
        "RULE",
        "PREDICATE",
        "ATOM",
        "ACTION",
        "SET",
        "NOT_SET",
        "WILDCARD",
        "PRECEDENCE",
    ];
    // @SuppressWarnings("serial")
    // static serializationTypes: Map<Class<? extends Transition>, number> =
    // 	Collections.unmodifiableMap(new HashMap<Class<? extends Transition>, Integer>() {{
    // 		put(EpsilonTransition.class, EPSILON);
    // 		put(RangeTransition.class, RANGE);
    // 		put(RuleTransition.class, RULE);
    // 		put(PredicateTransition.class, PREDICATE);
    // 		put(AtomTransition.class, ATOM);
    // 		put(ActionTransition.class, ACTION);
    // 		put(SetTransition.class, SET);
    // 		put(NotSetTransition.class, NOT_SET);
    // 		put(WildcardTransition.class, WILDCARD);
    // 		put(PrecedencePredicateTransition.class, PRECEDENCE);
    // 	}});
    /** The target of this transition. */
    target;
    constructor(target) {
        if (target == null) {
            throw new Error("target cannot be null.");
        }
        this.target = target;
    }
    /**
     * Determines if the transition is an "epsilon" transition.
     *
     * The default implementation returns `false`.
     *
     * @returns `true` if traversing this transition in the ATN does not
     * consume an input symbol; otherwise, `false` if traversing this
     * transition consumes (matches) an input symbol.
     */
    get isEpsilon() {
        return false;
    }
    get label() {
        return undefined;
    }
};
__decorate([
    NotNull
], Transition.prototype, "target", void 0);
Transition = __decorate([
    __param(0, NotNull)
], Transition);
export { Transition };
//# sourceMappingURL=Transition.js.map