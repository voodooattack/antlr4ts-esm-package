/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
// ConvertTo-TS run at 2016-10-04T11:26:25.5488013-07:00
import { Array2DHashMap } from "../misc/Array2DHashMap.js";
import { Array2DHashSet } from "../misc/Array2DHashSet.js";
import { ArrayEqualityComparator } from "../misc/ArrayEqualityComparator.js";
import { ATN } from "./ATN.js";
import { ATNConfig } from "./ATNConfig.js";
import { BitSet } from "../misc/BitSet.js";
import { NotNull, Override } from "../Decorators.js";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator.js";
import { PredictionContext } from "./PredictionContext.js";
import { PredictionContextCache } from "./PredictionContextCache.js";
import { SemanticContext } from "./SemanticContext.js";
import { strict as assert } from 'assert';
import * as Utils from "../misc/Utils.js";
class KeyTypeEqualityComparer {
    hashCode(key) {
        return key.state ^ key.alt;
    }
    equals(a, b) {
        return a.state === b.state && a.alt === b.alt;
    }
    static INSTANCE = new KeyTypeEqualityComparer();
}
function NewKeyedConfigMap(map) {
    if (map) {
        return new Array2DHashMap(map);
    }
    else {
        return new Array2DHashMap(KeyTypeEqualityComparer.INSTANCE);
    }
}
/**
 * Represents a set of ATN configurations (see `ATNConfig`). As configurations are added to the set, they are merged
 * with other `ATNConfig` instances already in the set when possible using the graph-structured stack.
 *
 * An instance of this class represents the complete set of positions (with context) in an ATN which would be associated
 * with a single DFA state. Its internal representation is more complex than traditional state used for NFA to DFA
 * conversion due to performance requirements (both improving speed and reducing memory overhead) as well as supporting
 * features such as semantic predicates and non-greedy operators in a form to support ANTLR's prediction algorithm.
 *
 * @author Sam Harwell
 */
export class ATNConfigSet {
    /**
     * This maps (state, alt) -> merged {@link ATNConfig}. The key does not account for
     * the {@link ATNConfig#getSemanticContext} of the value, which is only a problem if a single
     * `ATNConfigSet` contains two configs with the same state and alternative
     * but different semantic contexts. When this case arises, the first config
     * added to this map stays, and the remaining configs are placed in {@link #unmerged}.
     *
     * This map is only used for optimizing the process of adding configs to the set,
     * and is `undefined` for read-only sets stored in the DFA.
     */
    mergedConfigs;
    /**
     * This is an "overflow" list holding configs which cannot be merged with one
     * of the configs in {@link #mergedConfigs} but have a colliding key. This
     * occurs when two configs in the set have the same state and alternative but
     * different semantic contexts.
     *
     * This list is only used for optimizing the process of adding configs to the set,
     * and is `undefined` for read-only sets stored in the DFA.
     */
    unmerged;
    /**
     * This is a list of all configs in this set.
     */
    configs;
    _uniqueAlt = 0;
    _conflictInfo;
    // Used in parser and lexer. In lexer, it indicates we hit a pred
    // while computing a closure operation.  Don't make a DFA state from this.
    _hasSemanticContext = false;
    _dipsIntoOuterContext = false;
    /**
     * When `true`, this config set represents configurations where the entire
     * outer context has been consumed by the ATN interpreter. This prevents the
     * {@link ParserATNSimulator#closure} from pursuing the global FOLLOW when a
     * rule stop state is reached with an empty prediction context.
     *
     * Note: `outermostConfigSet` and {@link #dipsIntoOuterContext} should never
     * be true at the same time.
     */
    outermostConfigSet = false;
    cachedHashCode = -1;
    constructor(set, readonly) {
        if (!set) {
            this.mergedConfigs = NewKeyedConfigMap();
            this.unmerged = [];
            this.configs = [];
            this._uniqueAlt = ATN.INVALID_ALT_NUMBER;
        }
        else {
            if (readonly) {
                this.mergedConfigs = undefined;
                this.unmerged = undefined;
            }
            else if (!set.isReadOnly) {
                this.mergedConfigs = NewKeyedConfigMap(set.mergedConfigs);
                this.unmerged = set.unmerged.slice(0);
            }
            else {
                this.mergedConfigs = NewKeyedConfigMap();
                this.unmerged = [];
            }
            this.configs = set.configs.slice(0);
            this._dipsIntoOuterContext = set._dipsIntoOuterContext;
            this._hasSemanticContext = set._hasSemanticContext;
            this.outermostConfigSet = set.outermostConfigSet;
            if (readonly || !set.isReadOnly) {
                this._uniqueAlt = set._uniqueAlt;
                this._conflictInfo = set._conflictInfo;
            }
            // if (!readonly && set.isReadOnly) -> addAll is called from clone()
        }
    }
    /**
     * Get the set of all alternatives represented by configurations in this
     * set.
     */
    getRepresentedAlternatives() {
        if (this._conflictInfo != null) {
            return this._conflictInfo.conflictedAlts.clone();
        }
        let alts = new BitSet();
        for (let config of this) {
            alts.set(config.alt);
        }
        return alts;
    }
    get isReadOnly() {
        return this.mergedConfigs == null;
    }
    get isOutermostConfigSet() {
        return this.outermostConfigSet;
    }
    set isOutermostConfigSet(outermostConfigSet) {
        if (this.outermostConfigSet && !outermostConfigSet) {
            throw new Error("IllegalStateException");
        }
        assert(!outermostConfigSet || !this._dipsIntoOuterContext);
        this.outermostConfigSet = outermostConfigSet;
    }
    getStates() {
        let states = new Array2DHashSet(ObjectEqualityComparator.INSTANCE);
        for (let c of this.configs) {
            states.add(c.state);
        }
        return states;
    }
    optimizeConfigs(interpreter) {
        if (this.configs.length === 0) {
            return;
        }
        for (let config of this.configs) {
            config.context = interpreter.atn.getCachedContext(config.context);
        }
    }
    clone(readonly) {
        let copy = new ATNConfigSet(this, readonly);
        if (!readonly && this.isReadOnly) {
            copy.addAll(this.configs);
        }
        return copy;
    }
    get size() {
        return this.configs.length;
    }
    get isEmpty() {
        return this.configs.length === 0;
    }
    contains(o) {
        if (!(o instanceof ATNConfig)) {
            return false;
        }
        if (this.mergedConfigs && this.unmerged) {
            let config = o;
            let configKey = this.getKey(config);
            let mergedConfig = this.mergedConfigs.get(configKey);
            if (mergedConfig != null && this.canMerge(config, configKey, mergedConfig)) {
                return mergedConfig.contains(config);
            }
            for (let c of this.unmerged) {
                if (c.contains(o)) {
                    return true;
                }
            }
        }
        else {
            for (let c of this.configs) {
                if (c.contains(o)) {
                    return true;
                }
            }
        }
        return false;
    }
    *[_a = Symbol.iterator]() {
        yield* this.configs;
    }
    toArray() {
        return this.configs;
    }
    add(e, contextCache) {
        this.ensureWritable();
        if (!this.mergedConfigs || !this.unmerged) {
            throw new Error("Covered by ensureWritable but duplicated here for strict null check limitation");
        }
        assert(!this.outermostConfigSet || !e.reachesIntoOuterContext);
        if (contextCache == null) {
            contextCache = PredictionContextCache.UNCACHED;
        }
        let addKey;
        let key = this.getKey(e);
        let mergedConfig = this.mergedConfigs.get(key);
        addKey = (mergedConfig == null);
        if (mergedConfig != null && this.canMerge(e, key, mergedConfig)) {
            mergedConfig.outerContextDepth = Math.max(mergedConfig.outerContextDepth, e.outerContextDepth);
            if (e.isPrecedenceFilterSuppressed) {
                mergedConfig.isPrecedenceFilterSuppressed = true;
            }
            let joined = PredictionContext.join(mergedConfig.context, e.context, contextCache);
            this.updatePropertiesForMergedConfig(e);
            if (mergedConfig.context === joined) {
                return false;
            }
            mergedConfig.context = joined;
            return true;
        }
        for (let i = 0; i < this.unmerged.length; i++) {
            let unmergedConfig = this.unmerged[i];
            if (this.canMerge(e, key, unmergedConfig)) {
                unmergedConfig.outerContextDepth = Math.max(unmergedConfig.outerContextDepth, e.outerContextDepth);
                if (e.isPrecedenceFilterSuppressed) {
                    unmergedConfig.isPrecedenceFilterSuppressed = true;
                }
                let joined = PredictionContext.join(unmergedConfig.context, e.context, contextCache);
                this.updatePropertiesForMergedConfig(e);
                if (unmergedConfig.context === joined) {
                    return false;
                }
                unmergedConfig.context = joined;
                if (addKey) {
                    this.mergedConfigs.put(key, unmergedConfig);
                    this.unmerged.splice(i, 1);
                }
                return true;
            }
        }
        this.configs.push(e);
        if (addKey) {
            this.mergedConfigs.put(key, e);
        }
        else {
            this.unmerged.push(e);
        }
        this.updatePropertiesForAddedConfig(e);
        return true;
    }
    updatePropertiesForMergedConfig(config) {
        // merged configs can't change the alt or semantic context
        this._dipsIntoOuterContext = this._dipsIntoOuterContext || config.reachesIntoOuterContext;
        assert(!this.outermostConfigSet || !this._dipsIntoOuterContext);
    }
    updatePropertiesForAddedConfig(config) {
        if (this.configs.length === 1) {
            this._uniqueAlt = config.alt;
        }
        else if (this._uniqueAlt !== config.alt) {
            this._uniqueAlt = ATN.INVALID_ALT_NUMBER;
        }
        this._hasSemanticContext = this._hasSemanticContext || !SemanticContext.NONE.equals(config.semanticContext);
        this._dipsIntoOuterContext = this._dipsIntoOuterContext || config.reachesIntoOuterContext;
        assert(!this.outermostConfigSet || !this._dipsIntoOuterContext);
    }
    canMerge(left, leftKey, right) {
        if (left.state.stateNumber !== right.state.stateNumber) {
            return false;
        }
        if (leftKey.alt !== right.alt) {
            return false;
        }
        return left.semanticContext.equals(right.semanticContext);
    }
    getKey(e) {
        return { state: e.state.stateNumber, alt: e.alt };
    }
    containsAll(c) {
        for (let o of c) {
            if (!(o instanceof ATNConfig)) {
                return false;
            }
            if (!this.contains(o)) {
                return false;
            }
        }
        return true;
    }
    addAll(c, contextCache) {
        this.ensureWritable();
        let changed = false;
        for (let group of c) {
            if (this.add(group, contextCache)) {
                changed = true;
            }
        }
        return changed;
    }
    clear() {
        this.ensureWritable();
        if (!this.mergedConfigs || !this.unmerged) {
            throw new Error("Covered by ensureWritable but duplicated here for strict null check limitation");
        }
        this.mergedConfigs.clear();
        this.unmerged.length = 0;
        this.configs.length = 0;
        this._dipsIntoOuterContext = false;
        this._hasSemanticContext = false;
        this._uniqueAlt = ATN.INVALID_ALT_NUMBER;
        this._conflictInfo = undefined;
    }
    equals(obj) {
        if (this === obj) {
            return true;
        }
        if (!(obj instanceof ATNConfigSet)) {
            return false;
        }
        return this.outermostConfigSet === obj.outermostConfigSet
            && Utils.equals(this._conflictInfo, obj._conflictInfo)
            && ArrayEqualityComparator.INSTANCE.equals(this.configs, obj.configs);
    }
    hashCode() {
        if (this.isReadOnly && this.cachedHashCode !== -1) {
            return this.cachedHashCode;
        }
        let hashCode = 1;
        hashCode = 5 * hashCode ^ (this.outermostConfigSet ? 1 : 0);
        hashCode = 5 * hashCode ^ ArrayEqualityComparator.INSTANCE.hashCode(this.configs);
        if (this.isReadOnly) {
            this.cachedHashCode = hashCode;
        }
        return hashCode;
    }
    toString(showContext) {
        if (showContext == null) {
            showContext = false;
        }
        let buf = "";
        let sortedConfigs = this.configs.slice(0);
        sortedConfigs.sort((o1, o2) => {
            if (o1.alt !== o2.alt) {
                return o1.alt - o2.alt;
            }
            else if (o1.state.stateNumber !== o2.state.stateNumber) {
                return o1.state.stateNumber - o2.state.stateNumber;
            }
            else {
                return o1.semanticContext.toString().localeCompare(o2.semanticContext.toString());
            }
        });
        buf += ("[");
        for (let i = 0; i < sortedConfigs.length; i++) {
            if (i > 0) {
                buf += (", ");
            }
            buf += (sortedConfigs[i].toString(undefined, true, showContext));
        }
        buf += ("]");
        if (this._hasSemanticContext) {
            buf += (",hasSemanticContext=") + (this._hasSemanticContext);
        }
        if (this._uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
            buf += (",uniqueAlt=") + (this._uniqueAlt);
        }
        if (this._conflictInfo != null) {
            buf += (",conflictingAlts=") + (this._conflictInfo.conflictedAlts);
            if (!this._conflictInfo.isExact) {
                buf += ("*");
            }
        }
        if (this._dipsIntoOuterContext) {
            buf += (",dipsIntoOuterContext");
        }
        return buf.toString();
    }
    get uniqueAlt() {
        return this._uniqueAlt;
    }
    get hasSemanticContext() {
        return this._hasSemanticContext;
    }
    set hasSemanticContext(value) {
        this.ensureWritable();
        this._hasSemanticContext = value;
    }
    get conflictInfo() {
        return this._conflictInfo;
    }
    set conflictInfo(conflictInfo) {
        this.ensureWritable();
        this._conflictInfo = conflictInfo;
    }
    get conflictingAlts() {
        if (this._conflictInfo == null) {
            return undefined;
        }
        return this._conflictInfo.conflictedAlts;
    }
    get isExactConflict() {
        if (this._conflictInfo == null) {
            return false;
        }
        return this._conflictInfo.isExact;
    }
    get dipsIntoOuterContext() {
        return this._dipsIntoOuterContext;
    }
    get(index) {
        return this.configs[index];
    }
    ensureWritable() {
        if (this.isReadOnly) {
            throw new Error("This ATNConfigSet is read only.");
        }
    }
}
__decorate([
    NotNull
], ATNConfigSet.prototype, "getRepresentedAlternatives", null);
__decorate([
    Override
], ATNConfigSet.prototype, "size", null);
__decorate([
    Override
], ATNConfigSet.prototype, "isEmpty", null);
__decorate([
    Override
], ATNConfigSet.prototype, "contains", null);
__decorate([
    Override
], ATNConfigSet.prototype, _a, null);
__decorate([
    Override
], ATNConfigSet.prototype, "toArray", null);
__decorate([
    Override
], ATNConfigSet.prototype, "containsAll", null);
__decorate([
    Override
], ATNConfigSet.prototype, "clear", null);
__decorate([
    Override
], ATNConfigSet.prototype, "equals", null);
__decorate([
    Override
], ATNConfigSet.prototype, "hashCode", null);
//# sourceMappingURL=ATNConfigSet.js.map