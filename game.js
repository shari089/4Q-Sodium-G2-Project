function setupGame(cards, gameTime) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // clear previous if any
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
    img.src = `images/${name}.png`; // Ensure images are named properly
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
  if (card.classList.contains("matched") || card.classList.contains("flipped") || card === firstCard) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
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
