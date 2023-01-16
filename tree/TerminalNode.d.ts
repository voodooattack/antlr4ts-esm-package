/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Interval } from "../misc/Interval.js";
import { Parser } from "../Parser.js";
import { ParseTree } from "./ParseTree.js";
import { ParseTreeVisitor } from "./ParseTreeVisitor.js";
import { RuleContext } from "../RuleContext.js";
import { RuleNode } from "./RuleNode.js";
import { Token } from "../Token.js";
export declare class TerminalNode implements ParseTree {
    _symbol: Token;
    _parent: RuleNode | undefined;
    constructor(symbol: Token);
    getChild(i: number): never;
    get symbol(): Token;
    get parent(): RuleNode | undefined;
    setParent(parent: RuleContext): void;
    get payload(): Token;
    get sourceInterval(): Interval;
    get childCount(): number;
    accept<T>(visitor: ParseTreeVisitor<T>): T;
    get text(): string;
    toStringTree(parser?: Parser): string;
    toString(): string;
}
