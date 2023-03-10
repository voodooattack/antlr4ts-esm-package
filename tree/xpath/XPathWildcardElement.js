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
// CONVERSTION complete, Burt Harris 10/14/2016
import { Override } from "../../Decorators.js";
import { Trees } from "../Trees.js";
import { XPath } from "./XPath.js";
import { XPathElement } from "./XPathElement.js";
export class XPathWildcardElement extends XPathElement {
    constructor() {
        super(XPath.WILDCARD);
    }
    evaluate(t) {
        let kids = [];
        if (this.invert) {
            // !* is weird but valid (empty)
            return kids;
        }
        for (let c of Trees.getChildren(t)) {
            kids.push(c);
        }
        return kids;
    }
}
__decorate([
    Override
], XPathWildcardElement.prototype, "evaluate", null);
//# sourceMappingURL=XPathWildcardElement.js.map