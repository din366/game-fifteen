import {findCoordinatesByNumber, getMatrix, isValidForSwap, setPositionItems, shuffleArray, swap} from "./helpers.js";

export const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item')); // convert to true array
const countItems = 16;

/* * Position */
if (itemNodes.length !== 16) {
  throw new Error(`Должно быть ровно ${countItems} элементов в HTML`);
}

itemNodes[countItems - 1].style.display = 'none'; // hide block 16;

let matrix = getMatrix(
  itemNodes.map(item => Number(item.dataset.matrixId))
);

setPositionItems(matrix, itemNodes); // set initial positions for elements


/* * Shuffle */
document.getElementById('shuffle').addEventListener('click', () => {
  const shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix, itemNodes);
})

/* * Change position by click */
const blankNumber = 16;
containerNode.addEventListener('click', (e) => {
  const button = e.target.closest('button');

  if (!button) return;

  const buttonNumber = Number(button.dataset.matrixId);
  const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix)
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix)

  const isValid = isValidForSwap(buttonCoords, blankCoords);

  if (isValid) {
    swap(blankCoords, buttonCoords, matrix);
    setPositionItems(matrix, itemNodes);
  }
})

/* * Change position by arrows */

window.addEventListener('keydown', (e) => {
  if (!e.key.includes('Arrow')) {
    return;
  }

  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const buttonCoords = { // new object
    x: blankCoords.x,
    y: blankCoords.y
  }

  const direction = e.key.split('Arrow')[1].toLowerCase();
  const maxIndexMatrix = matrix.length;

  switch (direction) {
    case 'up':
      buttonCoords.y += 1;
      break;
    case 'down':
      buttonCoords.y -= 1;
      break;
    case 'left':
      buttonCoords.x += 1;
      break;
    case 'right':
      buttonCoords.x -= 1;
      break;
  }

  if (buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 || buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0) {
    console.log('break')
    return;
  }

  swap(blankCoords, buttonCoords, matrix);
  setPositionItems(matrix, itemNodes)
})