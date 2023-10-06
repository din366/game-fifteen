import {
  findCoordinatesByNumber,
  getMatrix,
  isValidForSwap,
  randomSwap,
  setPositionItems,
  shuffleArray,
  swap
} from "./helpers.js";

const gameNode = document.getElementById('game');
export const containerNode = document.getElementById('fifteen');
const paramsShuffleNode = document.getElementById('showShuffleParams');
const paramsShuffleIconNode = document.getElementById('showShuffleParamsIcon');
const paramsShuffleWrapperNode = document.getElementById('shuffleCountWrapper');
const shuffleButtonCountNode = document.getElementById('shuffleCountButton');
const shuffleInputNode = document.getElementById('shuffleCount');
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


/* * Simple Shuffle */
/*document.getElementById('shuffle').addEventListener('click', () => {
  const shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix, itemNodes);
})*/

/* * Smart shuffle */

let maxShuffle = 50;
let timer;
let shuffled = false;
document.getElementById('shuffle').addEventListener('click', () => {
  paramsShuffleIconNode.classList.remove('open');
  paramsShuffleWrapperNode.classList.remove('shuffleCountWrapperActive');
  maxShuffle = 50;
  shuffleMainFunc();
})

/* * Change position by click */
const blankNumber = 16;
containerNode.addEventListener('click', (e) => {
  if (shuffled) return;

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
  if (shuffled) return;

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
});

/* * Control params block */
paramsShuffleNode.addEventListener('click', () => {
  paramsShuffleIconNode.classList.toggle('open');

  if (paramsShuffleIconNode.classList.contains('open')) {
    paramsShuffleWrapperNode.classList.add('shuffleCountWrapperActive');
  } else {
    paramsShuffleWrapperNode.classList.remove('shuffleCountWrapperActive');
  }
})

shuffleButtonCountNode.addEventListener('click', () => {
  if (+shuffleInputNode.value <= 0 || shuffleInputNode.value > 1000 ) return;
  maxShuffle = +shuffleInputNode.value;
  if (shuffleInputNode.value) {
    shuffleMainFunc();
  }
})

/* * Smart shuffle main function */
function shuffleMainFunc() {
  let shuffleCount = 0;
  clearInterval(timer);
  gameNode.classList.add('gameShuffle');
  shuffled = true;
  timer = setInterval(() => {
    randomSwap(matrix, blankNumber);
    setPositionItems(matrix, itemNodes);

    shuffleCount += 1;

    if (shuffleCount >= maxShuffle) {
      gameNode.classList.remove('gameShuffle');
      shuffled = false;
      clearInterval(timer);
    }
  }, 70)
}