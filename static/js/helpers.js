import {containerNode} from "./index.js";

export const getMatrix = (arr) => {
  const matrix = [[], [], [], []];
  let y = 0;
  let x = 0;

  for (let i= 0; i < arr.length; i++) {
    if (x>=4) {
      y++;
      x = 0;
    }
    matrix[y][x] =  arr[i];
    x++;
  }
  return matrix;
}

export const setPositionItems = (matrix, itemNodes) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}

export const setNodeStyles = (node, x, y) => {
  const shiftPs = 100;
  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`
}

export const findCoordinatesByNumber = (number, matrix) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return {x, y};
      }
    }
  }
  return null;
}

export const isValidForSwap = (coords1, coords2) => {
  const diffX = Math.abs(coords1.x - coords2.x);
  const diffY = Math.abs(coords1.y - coords2.y);

  return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}

export const swap = (coords1, coords2, matrix) => {
  const coords1Number = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coords1Number;

  if (isWon(matrix)) {
    addWonClass();
  }
}

const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1);
const isWon = (matrix) => {
  const flatMatrix = matrix.flat();

  for (let i = 0; i < winFlatArr.length; i++) {
    if (flatMatrix[i] !== winFlatArr[i]) {
      return false;
    }
  }

  return true;
}

export const addWonClass = () => {
  setTimeout(() => {
    containerNode.classList.add('fifteenWon');

    setTimeout(() => {
      containerNode.classList.remove('fifteenWon')
    }, 1000);
  }, 200)
}

export const shuffleArray = (arr) => {
  return arr
    .map(value => ({ value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

let blockCoords = null;
export const randomSwap = (matrix, blankNumber) => {
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const validCoords = findValidCoords({
    blankCoords,
    matrix,
    blockCoords,
  })

  const swapCoords = validCoords[Math.floor(Math.random() * validCoords.length)];

  swap(blankCoords, swapCoords, matrix);
  blockCoords = blankCoords;
}

const findValidCoords = ({ blankCoords, matrix, blockCoords}) => {
  const validCoords = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (isValidForSwap({x, y}, blankCoords)) {
        if (!blockCoords || !(blockCoords.x === x && blockCoords.y === y)) {
          validCoords.push({x, y});
        }
      }
    }
  }

  return validCoords;
}

