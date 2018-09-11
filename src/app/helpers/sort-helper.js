/**
 * 
 * @param {Array} arr 
 * @param {number} rowLength 
 * @returns {Array}
 */
export function toZigzag(arr, rowLength) {
  const reordered = new Array(arr.length);
  let reorderedX = 0, reorderedY = 0;
  let direction = 'up';

  for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
    reordered[reorderedX + reorderedY * rowLength] = arr[arrIndex];

    if (direction === 'up') {
      if (reorderedX === rowLength - 1) {
        reorderedY += 1;
        direction = 'down';
      } else if (reorderedY === 0) {
        reorderedX += 1;
        direction = 'down';
      } else {
        reorderedX += 1;
        reorderedY -= 1;
      }
    } else {
      if (reorderedY === rowLength - 1) {
        reorderedX += 1;
        direction = 'up';
      } else if (reorderedX === 0) {
        reorderedY += 1;
        direction = 'up';
      } else {
        reorderedX -= 1;
        reorderedY += 1;
      }
    }
  }

  return reordered;
}

export function fromZigzag(arr, rowLength) {
  const reordered = new Array(arr.length);
  let reorderedX = 0, reorderedY = 0;
  let direction = 'up';

  for (let arrIndex = 0; arrIndex < arr.length; arrIndex++) {
    reordered[arrIndex] = arr[reorderedX + reorderedY * rowLength];

    if (direction === 'up') {
      if (reorderedX === rowLength - 1) {
        reorderedY += 1;
        direction = 'down';
      } else if (reorderedY === 0) {
        reorderedX += 1;
        direction = 'down';
      } else {
        reorderedX += 1;
        reorderedY -= 1;
      }
    } else {
      if (reorderedY === rowLength - 1) {
        reorderedX += 1;
        direction = 'up';
      } else if (reorderedX === 0) {
        reorderedY += 1;
        direction = 'up';
      } else {
        reorderedX -= 1;
        reorderedY += 1;
      }
    }
  }
  return reordered;
}