/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATNState } from "./ATNState.js";
import { Transition } from "./Transition.js";
/**
 *
 * @author Sam Harwell
 */
export declare abstract class AbstractPredicateTransition extends Transition {
    constructor(target: ATNState);
}
