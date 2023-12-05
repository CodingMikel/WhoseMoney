function isEmptyObject(obj) {
  if (obj === null || obj === undefined) {
    return true;
  }
  return Object.keys(obj).length === 0;
}

// function compareObjects(a, b) {
//   for (const key of Object.keys(a)) {
//     if (a[key] !== b[key]) {
//       return false;
//     }
//   }
//   return true;
// }

// False mean that 2 object or not equal
const compareObj = (obj1, obj2) => {
  for (const [key, value] of Object.entries(obj1)) {
    if (Array.isArray(value) && Array.isArray(obj2[key])) {
      if (
        value.length !== obj2[key].length ||
        !value.every((val, index) => val === obj2[key][index])
      ) {
        return false;
      }
    } else if (obj2[key] !== value) {
      return false;
    }
  }
  return true;
};

export default {
  isEmptyObject,
  compareObj,
};
