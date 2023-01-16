/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ParseTree } from "../ParseTree.js";
import { XPathElement } from "./XPathElement.js";
export declare class XPathTokenElement extends XPathElement {
    protected tokenType: number;
    constructor(tokenName: string, tokenType: number);
    evaluate(t: ParseTree): ParseTree[];
}
