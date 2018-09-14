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
console.log(set3) // Set(6) [ 1, 2, 3, 0, 4, 5
```

