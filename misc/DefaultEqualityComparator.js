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
import { Override } from "../Decorators";
import { MurmurHash } from "./MurmurHash";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";
/**
 * This default implementation of {@link EqualityComparator} uses object equality
 * for comparisons by calling {@link Object#hashCode} and {@link Object#equals}.
 *
 * @author Sam Harwell
 */
export class DefaultEqualityComparator {
    /**
     * {@inheritDoc}
     *
     * This implementation returns
     * `obj.`{@link Object#hashCode hashCode()}.
     */
    hashCode(obj) {
        if (obj == null) {
            return 0;
        }
        else if (typeof obj === "string" || typeof obj === "number") {
            return MurmurHash.hashCode([obj]);
        }
        else {
            return ObjectEqualityComparator.INSTANCE.hashCode(obj);
        }
    }
    /**
     * {@inheritDoc}
     *
     * This implementation relies on object equality. If both objects are
     * `undefined` or `null`, this method returns `true`. Otherwise if only
     * `a` is `undefined` or `null`, this method returns `false`. Otherwise,
     * this method returns the result of
     * `a.`{@link Object#equals equals}`(b)`.
     */
    equals(a, b) {
        if (a == null) {
            return b == null;
        }
        else if (typeof a === "string" || typeof a === "number") {
            return a === b;
        }
        else {
            return ObjectEqualityComparator.INSTANCE.equals(a, b);
        }
    }
}
DefaultEqualityComparator.INSTANCE = new DefaultEqualityComparator();
__decorate([
    Override
], DefaultEqualityComparator.prototype, "hashCode", null);
__decorate([
    Override
], DefaultEqualityComparator.prototype, "equals", null);
//# sourceMappingURL=DefaultEqualityComparator.js.map