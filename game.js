let firstCard = null;
let secondCard = null;
let points = 0;
let timer;
let timeLeft;
let matches = 0;
let totalPairs;
let lockBoard = false;
let level = localStorage.getItem("level");

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
  "Nikola Tesla", "Tesla Coil",
  "Johannes Gutenberg", "Printing Press",
  "Guglielmo Marconi", "Wireless Telegraph",
  "Alexander Graham Bell", "Telephone",
  "Alessandro Volta", "Electrical Battery"
];

// Scientist-invention mapping
const scientistMap = {
  "Thomas Edison": "Light Bulb",
  "Nikola Tesla": "Tesla Coil",
  "Johannes Gutenberg": "Printing Press",
  "Guglielmo Marconi": "Wireless Telegraph",
  "Alexander Graham Bell": "Telephone",
  "Alessandro Volta": "Electrical Battery"
};

function howToPlay() {
  document.getElementById("how-to-play-overlay").style.display = "flex";
}

function startGame(selectedLevel) {
  level = selectedLevel;
  localStorage.setItem("level", level);
  window.location.href = "game.html";
}

window.onload = function () {
  let username = localStorage.getItem("username");
  document.getElementById("welcome-message").innerText = `Welcome, ${username || 'Guest'}!`;
  document.getElementById("login-btn").innerText = "Change Username";

  level = localStorage.getItem("level");

  if (!level) {
    alert("No difficulty selected! Returning to home page.");
    window.location.href = "index.html";
    return;
  }

  if (level === "easy") {
    window.cardsToUse = easyCards.slice();
    window.gameTime = 60;
  } else if (level === "hard") {
    window.cardsToUse = hardCards.slice();
    window.gameTime = 90;
  }

  // High score setup after level is known
  window.highScoreKey = `highScore_${level}`;
  window.highScore = parseInt(localStorage.getItem(highScoreKey)) || 0;

  const startBtn = document.getElementById("start-game-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      document.getElementById("start-game-overlay").style.display = "none";
      setupGame(window.cardsToUse, window.gameTime);
      showHighScore();
    });
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
  matches = 0;
  points = 0;

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
    img.src = `images/${name}.jpg`;
    img.alt = name;
    cardBack.appendChild(img);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      showEndGamePopup("Time's up! You scored " + points + " points.");
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

function isMatch(name1, name2) {
  return name1 === name2 ||
    scientistMap[name1] === name2 ||
    scientistMap[name2] === name1;
}

function checkMatch() {
  const name1 = firstCard.dataset.name;
  const name2 = secondCard.dataset.name;

  if (isMatch(name1, name2)) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    points += 10;
    matches++;

    resetFlippedCards();

    if (matches === totalPairs) {
      clearInterval(timer);
      showEndGamePopup("You matched all pairs! Final score: " + points);
    }
  } else {
    points -= 2;
    if (points < 0) {
      points = 0;
      timeLeft = Math.max(0, timeLeft - 5);
    }

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetFlippedCards();
    }, 1000);
  }

  updatePointsDisplay();
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

function resetFlippedCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function showEndGamePopup(message) {
  checkAndUpdateHighScore();
  document.getElementById("game-over-message").innerText = message;
  document.getElementById("final-score").innerText = `Your Score: ${points}`;
  document.getElementById("game-over-overlay").style.display = "flex";
}

function showHighScore() {
  const highScoreDisplay = document.getElementById("high-score");
  if (highScoreDisplay) {
    highScoreDisplay.innerText = `High Score (${level}): ${highScore}`;
  }
}

function checkAndUpdateHighScore() {
  if (points > highScore) {
    localStorage.setItem(highScoreKey, points);
    alert(`New High Score! You beat the previous score of ${highScore} with ${points} points!`);
  }
}

function restartGame() {
  window.location.reload();
}

function goHome() {
  window.location.href = "index.html";
}
