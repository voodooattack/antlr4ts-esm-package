/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Parser } from "./Parser.js";
import { ParserRuleContext } from "./ParserRuleContext.js";
/**
 *
 * @author Sam Harwell
 */
export declare function RuleVersion(version: number): <T extends ParserRuleContext>(target: Parser, propertyKey: PropertyKey, propertyDescriptor: TypedPropertyDescriptor<(...args: any[]) => T>) => void;
