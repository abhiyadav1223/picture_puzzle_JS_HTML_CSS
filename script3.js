const moves = document.getElementById("moves");
const container = document.querySelector(".container");
const startButton = document.getElementById("start-button");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
const winAudio = document.getElementById("winAudio");
const failAudio = document.getElementById("failAudio");
const mainImg = document.getElementById("mainImg");
const restart = document.getElementById("popBtn");
var Usernm = " 0 ";
let currentElement = null;
let movesCount = 0;
let imagesArr = [];
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};
const randomNumber = () => Math.floor(Math.random() * 8) + 1;

const getCoords = (element) => {
  const [row, col] = element.getAttribute("data-position").split("_");
  return [parseInt(row), parseInt(col)]; ``
};

const checkAdjacent = (row1, row2, col1, col2) => {
  return (row1 == row2 && (col2 == col1 - 1 || col2 == col1 + 1)) ||
    (col1 == col2 && (row2 == row1 - 1 || row2 == row1 + 1));
};
const randomImages = () => {
  imagesArr = Array.from({ length: 8 }, (_, index) => index + 1);
  imagesArr = [...imagesArr, 9]; // Add the blank image
  imagesArr.sort(() => Math.random() - 0.5); // Shuffle the array
};

const gridGenerator = () => {
  var ramNum = Math.floor(Math.random() * 4) + 1;
  mainImg.src = `mainImg${ramNum}.jpg`;
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const div = document.createElement("div");
      const position = `${i}_${j}`;
      div.setAttribute("data-position", position);
      div.classList.add("image-container");
      div.innerHTML = `<img src="./img${ramNum}/image_part_00${imagesArr[count]}.jpg" class="image ${imagesArr[count] === 9 ? "target" : ""}" data-index="${imagesArr[count]}"/>`;
      count += 1;
      container.appendChild(div);
    }
  }
  enableDragAndDrop();
};

const enableDragAndDrop = () => {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.addEventListener('dragstart', handleDragStart);
    image.addEventListener('dragover', handleDragOver);
    image.addEventListener('drop', handleDrop);
  });
};

const handleDragStart = (e) => {
  currentElement = e.target;
  e.dataTransfer.effectAllowed = 'move';
};

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation(); // Stop the dragover event from propagating
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation(); // Stop the drop event from propagating
  if (movesCount == 1) {
    failAudio.play();
    showPopup(false);
    // window.location.reload();
  } else {
    movesCount -= 1;
    moves.innerText = `Moves: ${movesCount}`;
  }
  const targetElement = e.target.closest('.image');
  if (targetElement && targetElement !== currentElement) {
    const currentParent = currentElement.parentElement;
    const targetParent = targetElement.parentElement;

    const [row1, col1] = getCoords(currentParent);
    const [row2, col2] = getCoords(targetParent);

    if (checkAdjacent(row1, row2, col1, col2)) {
      currentElement.remove();
      targetElement.remove();

      const currentIndex = parseInt(currentElement.getAttribute("data-index"));
      const targetIndex = parseInt(targetElement.getAttribute("data-index"));

      currentElement.setAttribute("data-index", currentIndex);
      targetElement.setAttribute("data-index", targetIndex);

      currentParent.appendChild(targetElement);
      targetParent.appendChild(currentElement);

      const currentArrIndex = imagesArr.indexOf(currentIndex);
      const targetArrIndex = imagesArr.indexOf(targetIndex);
      [imagesArr[currentArrIndex], imagesArr[targetArrIndex]] = [imagesArr[targetArrIndex], imagesArr[currentArrIndex]];
      if (imagesArr.join("") === "123456789") {
        winAudio.play();
        showPopup(true);
      }
    }
  }
};
startButton.addEventListener("click", () => {
  document.getElementById("logoInfo").style.display = "block";
  document.getElementById("midLine").style.display = "block";
  Usernm = document.getElementById("input").value;
  if (Usernm.length == 0) {
    alert("Please enter your name");
    // window.t();
    window.location.reload();
  }
  document.getElementById("UserName").style.display = "inline";
  document.getElementById("UserName").innerText = Usernm;
  document.getElementById("moves").style.display = "inline";
  container.classList.remove("hide");
  coverScreen.classList.add("hide");
  container.innerHTML = "";
  imagesArr = [];
  randomImages();
  gridGenerator();
  movesCount = 15;
  moves.innerText = `Moves: ${movesCount}`;
});

window.onload = () => {
  coverScreen.classList.remove("hide");
  container.classList.add("hide");
};
const isPuzzleSolved = () => {
  var val = document.querySelector(".image").src;
  console.log(typeof val);
};
function showPopup(val) {
  document.getElementById("midLine").style.display = "none";
  document.getElementById("mainDiv").style.display = "none";
  document.getElementById("popup-container").style.display = "block";
  document.getElementById("overlay").style.display = "none";
  if (val) {
    document.getElementById("line1").innerText = "You Won !";
    document.getElementById("line2").innerText = "Congratulations on your victory!";

  } else {
    document.getElementById("line1").innerText = "You Lost !";
    document.getElementById("line2").innerText = "You Are out of Moves...";
  }
}
restart.addEventListener("click", () => {
  window.location.reload();
  document.getElementById("popup-container").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});
