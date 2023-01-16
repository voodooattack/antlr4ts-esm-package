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
import { ParserRuleContext } from "../../ParserRuleContext.js";
import { Override } from "../../Decorators.js";
import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";
export class XPathRuleElement extends XPathElement {
    ruleIndex;
    constructor(ruleName, ruleIndex) {
        super(ruleName);
        this.ruleIndex = ruleIndex;
    }
    evaluate(t) {
        // return all children of t that match nodeName
        let nodes = [];
        for (let c of Trees.getChildren(t)) {
            if (c instanceof ParserRuleContext) {
                if ((c.ruleIndex === this.ruleIndex && !this.invert) ||
                    (c.ruleIndex !== this.ruleIndex && this.invert)) {
                    nodes.push(c);
                }
            }
        }
        return nodes;
    }
}
__decorate([
    Override
], XPathRuleElement.prototype, "evaluate", null);
//# sourceMappingURL=XPathRuleElement.js.map