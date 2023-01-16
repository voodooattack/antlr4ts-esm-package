/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { DFA } from "./DFA.js";
import { DFASerializer } from "./DFASerializer.js";
export declare class LexerDFASerializer extends DFASerializer {
    constructor(dfa: DFA);
    protected getEdgeLabel(i: number): string;
}
