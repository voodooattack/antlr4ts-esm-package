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
import { IntervalSet } from "../misc/IntervalSet.js";
import { Override, NotNull } from "../Decorators.js";
import { Transition } from "./Transition.js";
let RangeTransition = class RangeTransition extends Transition {
    from;
    to;
    constructor(target, from, to) {
        super(target);
        this.from = from;
        this.to = to;
    }
    get serializationType() {
        return 2 /* TransitionType.RANGE */;
    }
    get label() {
        return IntervalSet.of(this.from, this.to);
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
        return symbol >= this.from && symbol <= this.to;
    }
    toString() {
        return "'" + String.fromCodePoint(this.from) + "'..'" + String.fromCodePoint(this.to) + "'";
    }
};
__decorate([
    Override
], RangeTransition.prototype, "serializationType", null);
__decorate([
    Override,
    NotNull
], RangeTransition.prototype, "label", null);
__decorate([
    Override
], RangeTransition.prototype, "matches", null);
__decorate([
    Override,
    NotNull
], RangeTransition.prototype, "toString", null);
RangeTransition = __decorate([
    __param(0, NotNull)
], RangeTransition);
export { RangeTransition };
//# sourceMappingURL=RangeTransition.js.map