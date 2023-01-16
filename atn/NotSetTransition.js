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
import { Override, NotNull, Nullable } from "../Decorators";
import { SetTransition } from "./SetTransition";
let NotSetTransition = class NotSetTransition extends SetTransition {
    constructor(target, set) {
        super(target, set);
    }
    get serializationType() {
        return 8 /* TransitionType.NOT_SET */;
    }
    matches(symbol, minVocabSymbol, maxVocabSymbol) {
        return symbol >= minVocabSymbol
            && symbol <= maxVocabSymbol
            && !super.matches(symbol, minVocabSymbol, maxVocabSymbol);
    }
    toString() {
        return "~" + super.toString();
    }
};
__decorate([
    Override
], NotSetTransition.prototype, "serializationType", null);
__decorate([
    Override
], NotSetTransition.prototype, "matches", null);
__decorate([
    Override
], NotSetTransition.prototype, "toString", null);
NotSetTransition = __decorate([
    __param(0, NotNull),
    __param(1, Nullable)
], NotSetTransition);
export { NotSetTransition };
//# sourceMappingURL=NotSetTransition.js.map