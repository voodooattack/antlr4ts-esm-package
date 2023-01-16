/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { RuleContext } from "../RuleContext.js";
import { ParseTree } from "./ParseTree.js";
import { ParseTreeVisitor } from "./ParseTreeVisitor.js";
import { Parser } from "../Parser.js";
import { Interval } from "../misc/Interval.js";
export declare abstract class RuleNode implements ParseTree {
    abstract readonly ruleContext: RuleContext;
    abstract readonly parent: RuleNode | undefined;
    abstract setParent(parent: RuleContext): void;
    abstract getChild(i: number): ParseTree;
    abstract accept<T>(visitor: ParseTreeVisitor<T>): T;
    abstract readonly text: string;
    abstract toStringTree(parser?: Parser | undefined): string;
    abstract readonly sourceInterval: Interval;
    abstract readonly payload: any;
    abstract readonly childCount: number;
}
