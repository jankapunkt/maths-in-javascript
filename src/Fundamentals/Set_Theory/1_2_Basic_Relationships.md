### 1.2. Basic Relationships

#### Subset / Superset

A set `A` is subset of a set `B` if every element of `A` is part of `B`. Consequentially `B` is thus the superset of `A`.

We can extend our `Set` class by using the code from our previously implemented `mequal` method:

```javascript
Set.prototype.isSupersetOf = function isSuperset(set) {
  const iterator = set.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
  	if (!this.has(value)) return false
  }
  return true
}

Set.prototype.isSubsetOf = function isSubset(set) {
	return set.isSupersetOf(this)
}

const isInt = n => Number.isInteger(n)
const set1 = new Set([1,2,3,4], isInt)
const set2 = new Set([1,2], isInt)

console.log(set1.isSupersetOf(set2)) // true
console.log(set2.isSubsetOf(set1))   // true

console.log(set2.isSupersetOf(set1)) // false
console.log(set1.isSubsetOf(set2))   // false
```

#### Equality

If `A` is subset of `B` and `B` is subset of `A` we can assume them to be equal.
By using the `Set` Object we can save one iteration by checking only for the following rules:

* Is one of `A` and `B` a subset of one another and
* Do both have the same size (number of elements)

Our new `mequal` function is therefore:

```javascript
Set.prototype.mequal = function equal (set) {
	if (this.size !== set.size) {
    return false
  }
  return this.isSubsetOf(set)
}

const isInt = n => Number.isInteger(n)
const set1 = new Set([1,2], isInt)
const set2 = new Set([1,2], isInt)

console.log(set1.mequal(set2)) // true
console.log(set2.mequal(set1)) // true
```

#### Proper subset / superset

A proper subset is given if `A` is a subset of `B` but they are not equal. The same applies for being a proper superset.
The implementation for this can easily check for this by adding the condition of different size (as opposed to same size when being equal):

```javascript
Set.prototype.properSupersetOf = function isSuperset(set) {
	return this.size !== set.size && this.isSupersetOf(set)
}

Set.prototype.properSubsetOf = function isSubset(set) {
	return this.size !== set.size && this.isSubsetOf(set)
}

const isInt = n => Number.isInteger(n)
const set1 = new Set([1,2,3], isInt)
const set2 = new Set([1,2], isInt)

console.log(set1.isSupersetOf(set2))     // true
console.log(set1.properSupersetOf(set2)) // true

console.log(set2.isSubsetOf(set1))     // true
console.log(set2.properSubsetOf(set1)) // true

console.log(set1.mequal(set2))           // false
```


#### Readings:
* https://en.wikipedia.org/wiki/Subset