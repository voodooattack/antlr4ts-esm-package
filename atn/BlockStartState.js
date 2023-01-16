/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { DecisionState } from "./DecisionState.js";
/**  The start of a regular `(...)` block. */
export class BlockStartState extends DecisionState {
    // This is always set during ATN deserialization
    endState;
}
//# sourceMappingURL=BlockStartState.js.map