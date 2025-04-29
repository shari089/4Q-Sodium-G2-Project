let firstCard = null;
let secondCard = null;
let points = 0;
let timer;
let timeLeft;
let matches = 0;
let totalPairs;
let lockBoard = false;
let level = localStorage.getItem("level"); // Load difficulty selected

// EASY cards
const easyCards = [
  "Avocado", "Avocado",
  "Banana", "Banana",
  "Lemon", "Lemon",
  "Melon", "Melon",
  "Orange", "Orange",
  "Strawberry", "Strawberry"
];

// HARD cards (scientists and inventions)
const hardCards = [
  "Thomas Edison", "Light Bulb",
  "Nikolas Tesla", "Tesla Coil",
  "Johannes Gutenburg", "Printing Press",
  "Guglielmo Marconi", "Wireless Telegraph",
  "Alexander Graham Bell", "Telephone",
  "Alessandro Volta", "Electrical Battery"
];

function startGame(selectedLevel) {
  level = selectedLevel;
  localStorage.setItem("level", level);
  window.location.href = "game.html";
}

window.onload = function () {
  if (!level) {
    alert("No difficulty selected! Returning to home page.");
    window.location.href = "index.html";
    return;
  }

  if (level === "easy") {
    setupGame(easyCards.slice(), 60); // 60 seconds
  } else if (level === "hard") {
    setupGame(hardCards.slice(), 90); // 90 seconds
  }
};

function setupGame(cards, gameTime) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; 
  cards = shuffle(cards);
  totalPairs = cards.length / 2;
  timeLeft = gameTime;
  updatePointsDisplay();
  updateTimerDisplay();

  // Create cards
  cards.forEach(name => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = name;

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.innerHTML = "<span>?</span>";

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    const img = document.createElement("img");
    img.src = `images/${name}.jpg`; // Ensure images are named properly
    img.alt = name;
    cardBack.appendChild(img);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  // Start countdown
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! You scored " + points + " points.");
      window.location.href = "index.html";
    }
  }, 1000);
}

function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains("matched") || card.classList.contains("flipped") || card === firstCard) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;
    checkMatch();
  }
}

function checkMatch() {
  const name1 = firstCard.dataset.name;
  const name2 = secondCard.dataset.name;

  if (name1 === name2) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    points += 10;
    matches++;
    if (matches === totalPairs) {
      clearInterval(timer);
      alert("You matched all pairs! Final score: " + points);
      window.location.href = "index.html";
    }
  } else {
    points -= 2;
    if (points < 0) {
      points = 0;
      timeLeft = Math.max(0, timeLeft - 5); // reduce time by 5 seconds for incorrect match
    }
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
    }, 1000);
  }

  updatePointsDisplay();
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updatePointsDisplay() {
  document.getElementById("points").innerText = `Points: ${points}`;
}

function updateTimerDisplay() {
  document.getElementById("timer").innerText = `Time Left: ${timeLeft}`;
}
