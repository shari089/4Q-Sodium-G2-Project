// selected cards, score, time, matches
let firstCard = null;
let secondCard = null;
let points = 0;
let timer;
let timeLeft;
let matches = 0;
let totalPairs;
let lockBoard = false;
let level = localStorage.getItem("level");

// easy cards
const easyCards = [
  "Avocado", "Avocado",
  "Banana", "Banana",
  "Lemon", "Lemon",
  "Melon", "Melon",
  "Orange", "Orange",
  "Strawberry", "Strawberry"
];

// hard cards
const hardCards = [
  "Thomas Edison", "Light Bulb",
  "Nikola Tesla", "Tesla Coil",
  "Johannes Gutenberg", "Printing Press",
  "Guglielmo Marconi", "Wireless Telegraph",
  "Alexander Graham Bell", "Telephone",
  "Alessandro Volta", "Electrical Battery"
];

// match scientist to invention
const scientistMap = {
  "Thomas Edison": "Light Bulb",
  "Nikola Tesla": "Tesla Coil",
  "Johannes Gutenberg": "Printing Press",
  "Guglielmo Marconi": "Wireless Telegraph",
  "Alexander Graham Bell": "Telephone",
  "Alessandro Volta": "Electrical Battery"
};

// show how to play overlay
function howToPlay() {
  const howToPlayOverlay = document.getElementById("how-to-play-overlay");
  if (howToPlayOverlay) howToPlayOverlay.style.display = "flex";
}

// show difficulty select
function showDifficultyOverlay() {
  document.getElementById("difficulty-overlay").style.display = "flex";
}

// close overlay by id
function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// set level and go to game page
function startGame(selectedLevel) {
  level = selectedLevel;
  localStorage.setItem("level", level);
  window.location.href = "game.html";
}

// on page load
window.onload = function () {
  // show welcome message
  const username = localStorage.getItem("username") || "Guest";
  const welcomeMessage = document.getElementById("welcome-message");
  if (welcomeMessage) {
    welcomeMessage.innerText = `Welcome, ${username}!`;
  }

  // get level or go home
  level = localStorage.getItem("level");
  if (!level) {
    alert("No difficulty selected! Returning to home page.");
    window.location.href = "index.html";
    return;
  }

  // set cards and time
  if (level === "easy") {
    window.cardsToUse = easyCards.slice();
    window.gameTime = 60;
  } else if (level === "hard") {
    window.cardsToUse = hardCards.slice();
    window.gameTime = 90;
  }

  // get high score
  window.highScoreKey = `highScore_${level}`;
  window.highScore = parseInt(localStorage.getItem(highScoreKey)) || 0;

  // start game on click
  const startBtn = document.getElementById("start-game-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const overlay = document.getElementById("start-game-overlay");
      if (overlay) overlay.style.display = "none";
      setupGame(window.cardsToUse, window.gameTime);
      showHighScore();
    });
  }
};

// setup game board
function setupGame(cards, gameTime) {
  const gameBoard = document.getElementById("game-board");
  if (!gameBoard) return;

  gameBoard.innerHTML = "";
  cards = shuffle(cards);
  totalPairs = cards.length / 2;
  timeLeft = gameTime;
  updatePointsDisplay();
  updateTimerDisplay();
  matches = 0;
  points = 0;

  // create cards
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

  // start countdown
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      showEndGamePopup("Time's up! You scored " + points + " points.");
    }
  }, 1000);
}

// flip logic
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

// check name match or scientist-invention
function isMatch(name1, name2) {
  return name1 === name2 ||
    scientistMap[name1] === name2 ||
    scientistMap[name2] === name1;
}

// check if flipped cards match
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

    // flip back after delay
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetFlippedCards();
    }, 1000);
  }

  updatePointsDisplay();
}

// shuffle cards
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// update points text
function updatePointsDisplay() {
  const pointsDisplay = document.getElementById("points");
  if (pointsDisplay) {
    pointsDisplay.innerText = `Points: ${points}`;
  }
}

// update timer text
function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timer");
  if (timerDisplay) {
    timerDisplay.innerText = `Time Left: ${timeLeft}`;
  }
}

// reset flipped cards
function resetFlippedCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// show end popup
function showEndGamePopup(message) {
  checkAndUpdateHighScore();
  const gameOverMsg = document.getElementById("game-over-message");
  const overlay = document.getElementById("game-over-overlay");

  if (gameOverMsg) gameOverMsg.innerText = message;
  if (overlay) overlay.style.display = "flex";
}

// show high score
function showHighScore() {
  const highScoreDisplay = document.getElementById("high-score");
  if (highScoreDisplay) {
    highScoreDisplay.innerText = `High Score (${level}): ${highScore}`;
  }
}

// update high score if beaten
function checkAndUpdateHighScore() {
  if (points > highScore) {
    localStorage.setItem(highScoreKey, points);
    alert(`New High Score! You beat the previous score of ${highScore} with ${points} points!`);
  }
}

// reload page 
function restartGame() {
  window.location.reload();
}

// navbar active link toggle
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-list a').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// go to homepage
function goHome() {
  window.location.href = "index.html";
}
