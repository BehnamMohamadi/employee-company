const arr1 = [1, 2, 3];
const arr2 = [1, 2, 4];

const difference = (arr1, arr2) => {
  const diffArr = [];

  for (const item of arr1) {
    if (!arr2.includes(item)) {
      diffArr.push(item);
    }
  }

  for (const item of arr2) {
    if (!arr1.includes(item)) {
      diffArr.push(item);
    }
  }

  return diffArr;
};

console.log(difference(arr1, arr2));
