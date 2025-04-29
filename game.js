let firstCard = null;
let secondCard = null;
let points = 0;
let timer;
let timeLeft;
let matches = 0;
let totalPairs;
let level = localStorage.getItem("level"); // Load difficulty selected

// EASY cards
const easyCards = [
  "apple", "apple",
  "banana", "banana",
  "cat", "cat",
  "dog", "dog",
  "fish", "fish",
  "hat", "hat"
];

// HARD cards (scientists and inventions)
const hardCards = [
  "Einstein", "Relativity",
  "Newton", "Gravity",
  "Curie", "Radioactivity",
  "Tesla", "AC Current",
  "Darwin", "Evolution",
  "Faraday", "Electromagnetism"
];

function startGame(selectedLevel) {
  level = selectedLevel;
  localStorage.setItem("level", level);
  window.location.href = "game.html";
}

window.onload = function() {
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
    card.innerHTML = "<span>?</span>";
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
  if (card.classList.contains("matched") || card === firstCard) return;

  card.innerHTML = card.dataset.name;

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
}

function checkMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
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
      timeLeft = Math.max(0, timeLeft - 5); // Subtract 5 seconds if points border a negative score (insteaed of the score going negative, time is subtracted instead)
    }
    setTimeout(() => {
      firstCard.innerHTML = "<span>?</span>";
      secondCard.innerHTML = "<span>?</span>";
    }, 1000);
  }
  updatePointsDisplay();
  firstCard = null;
  secondCard = null;
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
