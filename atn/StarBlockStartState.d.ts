/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATNStateType } from "./ATNStateType.js";
import { BlockStartState } from "./BlockStartState.js";
/** The block that begins a closure loop. */
export declare class StarBlockStartState extends BlockStartState {
    get stateType(): ATNStateType;
}
