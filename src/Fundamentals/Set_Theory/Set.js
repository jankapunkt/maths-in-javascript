const OriginalSet = Set
Set = function Set (elements, rulesFct) {
  const original = new OriginalSet()
  original.rulesFct = rulesFct
  if (elements)
    elements.forEach(element => original.add(element))
  return original
}
Set.prototype = OriginalSet.prototype

Set.prototype.add = (function () {
  const originalAdd = Set.prototype.add
  return function add (value) {
    if (!this.rulesFct.call(null, value)) {
      throw new Error(`Value [${value}] does not match ruleset.`)
    }
    return originalAdd.call(this, value)
  }
})()

Set.prototype.isSupersetOf = function isSuperset (set) {
  const iterator = set.values()
  let value
  while (value = iterator.next().value) {
    if (!this.has(value)) return false
  }
  return true
}

Set.prototype.isSubsetOf = function isSubset (set) {
  return set.isSupersetOf(this)
}

Set.prototype.mequal = function equal (set) {
  if (this.size !== set.size) {
    return false
  }
  return this.isSubsetOf(set)
}