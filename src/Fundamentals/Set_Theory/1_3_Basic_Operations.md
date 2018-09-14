### 1.3. Basic Operations

#### Unions

> The union of A and B, denoted by A ∪ B, is the set of all things that are members of either A or B.

In order to prevent mutation, we don't implement union as a function on the Set's `prototype` but as a static function.
The result will be a new `Set` instance, leaving the source Sets "untouched". Read more on pure functions [here](https://en.wikipedia.org/wiki/Pure_function).

```javascript
Set.union = function union (set1, set2, rulesFct) {
  const set3 = new Set(set1, rulesFct)
  const iterator = set2.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
  	set3.add(value)
  }
  return set3
}

const isInt = n => Number.isInteger(n)
const set1 = new Set([1,2,3], isInt)
const set2 = new Set([0,4,5], isInt)

const set3 = Set.union(set1, set2)
console.log(set3) // Set(6) [ 1, 2, 3, 0, 4, 5]
```

Note, that the rulesFct is optional. If a rules function is provided it should be your competency to write it in a way, that it will apply to all elements of both sets.
Otherwise the union will not succeed.

A very simple solution would be to wrap the rules functions into another function:

```javascript
const isInt = n => Number.isInteger(n)
const isFloat = n => n % 1 !== 0
const set1 = new Set([1,2,3], isInt)
const set2 = new Set([1.1,2.2,3.3], isFloat)

const intOrFloat = n => isInt(n) || isFloat(n)
const set3 = Set.union(set1, set2, intOrFloat)
console.log(set3) // Set(6) [ 1, 2, 3, 1.1, 2.2, 3.3 ]
``` 

#### Intersection

> The intersection of A and B, denoted by A ∩ B, is the set of all things that are members of both A and B.

We will also implement a static method in order to preserve the original sets:

```javascript
Set.intersect = function intersect (set1, set2) {
  const set3 = new Set([])
  const iterator = set1.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
  	if (set2.has(value)) {
      set3.add(value)
    }
  }
  return set3
}

const set1 = new Set([1,2,3])
const set2 = new Set([3,4,5])

const set3 = Set.intersect(set1, set2)
console.log(set3) // Set [ 3 ]
```

> If A ∩ B = ∅, then A and B are said to be disjoint.

We can easily reuse our `Set.intersect` function and additionally check, whether it's result has a size of zero:

```javascript
Set.disjoint = function disjoint (set1, set2) {
  return Set.intersect(set1, set2).size === 0
}

const set1 = new Set([1,2,3])
const set2 = new Set([3,4,5])
const set3 = new Set([4,5,6])

console.log(Set.disjoint(set1, set2)) // false
console.log(Set.disjoint(set1, set3)) // true
console.log(Set.disjoint(set2, set3)) // false
```

#### Complement

>  The relative complement of B in A (also called the set-theoretic difference of A and B), denoted by A \ B (or A − B), is the set of all elements that are members of A but not members of B.

In our computantional appraoch we only need to iterate all elements of `A` and check if the current element is not in `B` (it is already part of `A` because we iterate `A`):

```javascript
Set.complement = function complement (set1, set2) {
  const set3 = new Set([])
  const iterator = set1.values()
  let value
  while ((value = iterator.next().value) !== void 0) {
  	if (!set2.has(value)) {
      set3.add(value)
    }
  }
  return set3
}

const set1 = new Set([1,2,3])
const set2 = new Set([3,4,5])
const set3 = new Set([1,2,3])

console.log(Set.complement(set1, set2)) // Set [ 1, 2 ]
console.log(Set.complement(set1, set3)) // Set []
console.log(Set.complement(set2, set3)) // Set [ 4, 5 ]
```

#### Symmetric Difference

> In mathematics, the symmetric difference, also known as the disjunctive union, of two sets is the set of elements which are in either of the sets and not in their intersection.

In this case we will iterate both sets in order to check if the elements are only contained in their own set:

```javascript
Set.symDiff = function symmetricDifference (set1, set2) {
	const set3 = new Set([])
  
  function addToSet (source, compare, target) {
    const iterator = source.values()
    let value
    while ((value = iterator.next().value) !== void 0) {
  	  if (!compare.has(value)) {
        target.add(value)
      }
    }
  }
  
  addToSet(set1, set2, set3)
  addToSet(set2, set1, set3)
  return set3
}

const set1 = new Set([1,2,3])
const set2 = new Set([3,4])
const set3 = new Set([1,2,3])

console.log(Set.symDiff(set1, set2)) // Set(3) [ 1, 2, 4 ]
console.log(Set.symDiff(set1, set3)) // Set []
console.log(Set.symDiff(set2, set3)) // Set(3) [ 4, 1, 2 ]
```