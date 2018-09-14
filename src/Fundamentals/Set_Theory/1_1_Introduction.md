### 1.1. Introduction

#### Definition

> In mathematics, a set is a collection of distinct objects, considered as an object in its own right. ([Wikipedia](https://en.wikipedia.org/wiki/Set_(mathematics)))

The term "distinct bjects" in context of sets and Javascript applies to all primitive and complex types.


```javascript
const nums   = [1,2,3]
const fruits = ['apple', 'orange']
const empty1 = []
const empty2 = {}
```

While a set is considered an "object in it's own right", we can create sets of sets:

```javascript
const setOfSets = [ nums, fruits, empty1, empty2 ]
```  


#### Size of a set

The size of a set is determined by it's elements but does not consider, if the elements are sets themselves (children don't count):

```javascript
const nums   = [ 1, 2, 3 ]         // length: 3
const fruits = ['apple', 'orange'] // length: 2
const setOfSets = [ nums, fruits ] // length: 2
```

#### Single occurrence of elements (overloading)

In a (mathematical) set, every distinct element occurs only once, even if declared twice. 
The [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) implementation explicitly respects this law:

```javascript
const set1 = new Set([1, 2, 1, 1, 1])
console.log(set1) //  [ 1, 2 ]
```

#### Problems with Objects

* You have to explicitly define key-value pairs:

```javascript
const set = {'0':'apple', '1':'orange'}
console.log(set) // Object [ "apple", "orange" ]
```

* Overloading is possible but not a good practice with Objects and can cause confusion:

```javascript
const set = {'0':'apple', '1':'orange', '1':'cherry'}
console.log(set) // Object [ "cherry", "orange" ]
```

#### Problems with Arrays

* Overloading is not possible:

```javascript
const set = [ 0, 1, 1, 2 ]
console.log(set) // Array(4) [ 0, 1, 1, 2 ] <- NOT OK!
```

There are also more issues when using Arrays and Objects which will be explaines in the next sections.

#### Member of a set

If an element is in a set, it is considered to be a member of the set.

*Example using Arrays*

```javascript
const set = [ 3, 4, 5]
console.log(set.indexOf(3)) // returns index 0 <- OK
console.log(set.indexOf(4)) // returns index 1 <- OK
console.log(set.indexOf(5)) // returns index 2 <- OK
console.log(set.indexOf(1)) // returns index -1 <- OK
```

*Example using Objects*

```javascript
const set = {0:0,1:1,2:2}
console.log(set[0]) // 0 <- OK
console.log(set[1]) // 1 <- OK
console.log(set[2]) // 2 <- OK
console.log(set[3]) // undefined <- OK
```

* Example using Set*

```javascript
const set1 = new Set([1, 2, 1, 1, 1]) // [ 1, 2 ]
console.log(set1.has(1)) //  true <- OK!
console.log(set1.has(2)) //  true <- OK!
console.log(set1.has(3)) //  false <- OK!
```


#### Equality of sets

If two sets contain the exact same elements, they are considered to be equal.

```javascript
const nums1   = [ 1, 2, 3 ]
const nums2   = [ 1, 2, 3 ]
// mathematically equal sets
```

Note, that we talk about mathematical equality. 
The following sets are mathematically equal but different to the Javascript interpreter:

```javascript
const nums1   = [ 1, 2, 3 ]
const nums2   = [ 1, 2, 3 ]
console.log(nums1 === nums2) // false
console.log(nums1 == nums2)  // false
```

A simple implementation on `Set` can solve this problem:

```javascript
Set.prototype.mequal = function equal (set) {
  if (this.size !== set.size) return false
  
  const iterator = set.values()
  let value
  while (value = iterator.next().value) {
  	if (!this.has(value)) return false
  }
   
  return true
}

const set1 = new Set([1, 2, 1, 1, 1])
const set2 = new Set([1, 2])

console.log(set1 == set2)      // false
console.log(set1 === set2)     // false
console.log(set1.mequal(set2)) // true
```

Here we simply check a) that the sets have the same size and b) iterate all given values of the given set and check if our set contains the exact same value.
If both conditions are met, we can assume both sets to be mathematically equal.

*Please Note:* To check, whether to sets are equal we will use a more distinct method in the next chapter.


#### Properties

A set is usually defined with some properties that describe rules.
Only elements that obey these rules are considered members of the set.

Neither Arrays or Objects, nor Set implementations do a typecheck by default. However, there are many options to do so manually.

Arrays, for example, have several implementations, that allow a more rule-based adding or removal of elements. 
Since we already found Arrays to be not satisfactory to meet the needs of sets, we may stick to our `Set` implementation.

##### Extending Set to be rule-based

We can extend the `Set` class and introduce a function-based rule that needs to apply to every element.
If the rule fails on a single element, we can let the set throw an error:

```javascript
const OriginalSet = Set
Set = function Set(elements, rulesFct) {
  if (elements && rulesFct)	{
    elements.forEach(element => {
      if (!rulesFct.call(null, element)) {
        throw new Error(`Element [${element}] does not match ruleset.`)
      }
    })
  }
  return new OriginalSet(elements)
}
Set.prototype = OriginalSet.prototype


const isInt = n => Number.isInteger(n)
const set1 = new Set([1,2,3,4], isInt)   // passes
const set2 = new Set([1,2,3,4.5], isInt) // throws error
```

This behavior can also be implemented on the `add` function *PLUS* because the original constructor of `Set` internally calls the `add` function, we can move the rule-check there to ensure a single point of failure:

```javascript
// Replacing constructor with extended version
const OriginalSet = Set
Set = function Set(elements, rulesFct) {
  const original = new OriginalSet()
  original.rulesFct = rulesFct
  if (elements) {
  	elements.forEach(element => original.add(element))
  }	
  return original
}
Set.prototype = OriginalSet.prototype

// Replacing add function with extended version
Set.prototype.add = (function(){
	const originalAdd = Set.prototype.add	
  return function add (value) {
  	if (this.rulesFct && !this.rulesFct.call(null, value)) {
    	throw new Error(`Value [${value}] does not match ruleset.`)
  	}
  	return originalAdd.call(this, value)
	}
})()

const isInt = n => Number.isInteger(n)
const set1 = new Set([1,2,3,4], isInt)   // passes
const set2 = new Set([1,2,3,4.5], isInt) // throws error

set1.add(5)   // OK
set1.add('5') // throws error
```