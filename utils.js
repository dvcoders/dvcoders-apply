'use strict'

// Merges the elements of obj2 into obj1
exports.merge = (obj1, obj2) => {
  for (let item in obj2) {
    if (obj2.hasOwnProperty(item) && !obj1.hasOwnProperty(item)) {
      obj1[item] = obj2[item]
    }
  }
  return obj1
}
