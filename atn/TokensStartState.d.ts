/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATNStateType } from "./ATNStateType.js";
import { DecisionState } from "./DecisionState.js";
/** The Tokens rule start state linking to each lexer rule start state */
export declare class TokensStartState extends DecisionState {
    get stateType(): ATNStateType;
}
