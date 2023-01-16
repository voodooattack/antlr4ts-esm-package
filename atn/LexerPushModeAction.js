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
import { MurmurHash } from "../misc/MurmurHash";
import { NotNull, Override } from "../Decorators";
/**
 * Implements the `pushMode` lexer action by calling
 * {@link Lexer#pushMode} with the assigned mode.
 *
 * @author Sam Harwell
 * @since 4.2
 */
export class LexerPushModeAction {
    /**
     * Constructs a new `pushMode` action with the specified mode value.
     * @param mode The mode value to pass to {@link Lexer#pushMode}.
     */
    constructor(mode) {
        this._mode = mode;
    }
    /**
     * Get the lexer mode this action should transition the lexer to.
     *
     * @returns The lexer mode for this `pushMode` command.
     */
    get mode() {
        return this._mode;
    }
    /**
     * {@inheritDoc}
     * @returns This method returns {@link LexerActionType#PUSH_MODE}.
     */
    get actionType() {
        return 5 /* LexerActionType.PUSH_MODE */;
    }
    /**
     * {@inheritDoc}
     * @returns This method returns `false`.
     */
    get isPositionDependent() {
        return false;
    }
    /**
     * {@inheritDoc}
     *
     * This action is implemented by calling {@link Lexer#pushMode} with the
     * value provided by {@link #getMode}.
     */
    execute(lexer) {
        lexer.pushMode(this._mode);
    }
    hashCode() {
        let hash = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.actionType);
        hash = MurmurHash.update(hash, this._mode);
        return MurmurHash.finish(hash, 2);
    }
    equals(obj) {
        if (obj === this) {
            return true;
        }
        else if (!(obj instanceof LexerPushModeAction)) {
            return false;
        }
        return this._mode === obj._mode;
    }
    toString() {
        return `pushMode(${this._mode})`;
    }
}
__decorate([
    Override
], LexerPushModeAction.prototype, "actionType", null);
__decorate([
    Override
], LexerPushModeAction.prototype, "isPositionDependent", null);
__decorate([
    Override,
    __param(0, NotNull)
], LexerPushModeAction.prototype, "execute", null);
__decorate([
    Override
], LexerPushModeAction.prototype, "hashCode", null);
__decorate([
    Override
], LexerPushModeAction.prototype, "equals", null);
__decorate([
    Override
], LexerPushModeAction.prototype, "toString", null);
//# sourceMappingURL=LexerPushModeAction.js.map