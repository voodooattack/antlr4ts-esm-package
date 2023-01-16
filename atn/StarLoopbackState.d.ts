/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATNState } from "./ATNState.js";
import { ATNStateType } from "./ATNStateType.js";
import { StarLoopEntryState } from "./StarLoopEntryState.js";
export declare class StarLoopbackState extends ATNState {
    get loopEntryState(): StarLoopEntryState;
    get stateType(): ATNStateType;
}
