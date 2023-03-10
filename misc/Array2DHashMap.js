/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { Array2DHashSet } from "./Array2DHashSet.js";
class MapKeyEqualityComparator {
    keyComparator;
    constructor(keyComparator) {
        this.keyComparator = keyComparator;
    }
    hashCode(obj) {
        return this.keyComparator.hashCode(obj.key);
    }
    equals(a, b) {
        return this.keyComparator.equals(a.key, b.key);
    }
}
export class Array2DHashMap {
    backingStore;
    constructor(keyComparer) {
        if (keyComparer instanceof Array2DHashMap) {
            this.backingStore = new Array2DHashSet(keyComparer.backingStore);
        }
        else {
            this.backingStore = new Array2DHashSet(new MapKeyEqualityComparator(keyComparer));
        }
    }
    clear() {
        this.backingStore.clear();
    }
    containsKey(key) {
        return this.backingStore.contains({ key });
    }
    get(key) {
        let bucket = this.backingStore.get({ key });
        if (!bucket) {
            return undefined;
        }
        return bucket.value;
    }
    get isEmpty() {
        return this.backingStore.isEmpty;
    }
    put(key, value) {
        let element = this.backingStore.get({ key, value });
        let result;
        if (!element) {
            this.backingStore.add({ key, value });
        }
        else {
            result = element.value;
            element.value = value;
        }
        return result;
    }
    putIfAbsent(key, value) {
        let element = this.backingStore.get({ key, value });
        let result;
        if (!element) {
            this.backingStore.add({ key, value });
        }
        else {
            result = element.value;
        }
        return result;
    }
    get size() {
        return this.backingStore.size;
    }
    hashCode() {
        return this.backingStore.hashCode();
    }
    equals(o) {
        if (!(o instanceof Array2DHashMap)) {
            return false;
        }
        return this.backingStore.equals(o.backingStore);
    }
}
//# sourceMappingURL=Array2DHashMap.js.map