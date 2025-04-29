var easyListOfCards = [
    "darkness",
    "double",
    "fairy",
    "fighting",
    "fire",
    "grass",
    "lightning",
    "metal",
    "psychic",
    "water"
] //change words to pair name for easy level

var hardListOfCardsScientist = [
    "darkness",
    "double",
    "fairy",
    "fighting",
    "fire",
    "grass",
    "lightning",
    "metal",
    "psychic",
    "water"
] //change words to scientists name for hard level

var hardListOfCardsInvention = [
    "darkness_invent",
    "double_invent",
    "fairy_invent",
    "fighting_invent",
    "fire_invent",
    "grass_invent",
    "lightning_invent",
    "metal_invent",
    "psychic_invent",
    "water_invent"
] //change words to inventions name for hard level

var cardSets;
var board = [];
var rows = 4;
var columns = 5;
var points = 0;
var streakCount = 0;
var matchMade = 0;
var levelPicked = "";
var disableBoard = false; //disables the board if true
var timeRemaining;
var timerInterval;
var selectedCard1;
var selectedCard2;
var playerInteracted = false;

function shufflingCardsEasy() {
    cardSets = easyListOfCards.concat(easyListOfCards); //two of each card
    console.log(cardSets);
    //shuffle
    for (let ogNum = cardSets.length - 1; ogNum > 0; ogNum--) {
        let newNum = Math.floor(Math.random() * (ogNum + 1)); //get random index
        //swap
        let temp = cardSets[ogNum];
        cardSets[ogNum] = cardSets[newNum];
        cardSets[newNum] = temp;
    }
    console.log(cardSets);
    startTimer(3 * 60); //3-minute timer in seconds for function
} //for easy level

function shufflingCardsHard() {
    cardSets = hardListOfCardsScientist.concat(hardListOfCardsInvention); //two of each card
    console.log(cardSets);
    //shuffle
    for (let ogNum = cardSets.length - 1; ogNum > 0; ogNum--) {
        let newNum = Math.floor(Math.random() * (ogNum + 1)); //get random index
        //swap
        let temp = cardSets[ogNum];
        cardSets[ogNum] = cardSets[newNum];
        cardSets[newNum] = temp;
    }
    console.log(cardSets);
    startTimer(5 * 60);//5-minute timer in seconds for function
} //for hard level

//starts the game based on selected level
function startGame(level) {
    levelPicked = level;
    board = [];
    document.getElementById("board").innerHTML = "";
    document.querySelectorAll(".card").forEach(card => {
        card.removeEventListener("click", selectACard);
    });

    if (level === "easy") {
        shufflingCardsEasy();
    } else if (level === "hard") {
        shufflingCardsHard();
    }

    points = 0;
    matchMade = 0;
    streakCount = 0;
    disableBoard = false;
    playerInteracted = false;
    document.getElementById("pointScore").innerText = points;

    //arrange the board 4x5
    for (let rowNum = 0; rowNum < rows; rowNum++) {
        let row = [];
        
        for (let columnNum = 0; columnNum < columns; columnNum ++) {
            let cardIndex = rowNum * columns + columnNum;
            let cardImage = cardSets[cardIndex];
            row.push(cardImage);

           // <img id="0-0" class="card" src="water.jpg">
            let card = document.createElement("img");
            card.id = rowNum.toString() + "-" + columnNum.toString();
            card.src = cardImage + ".jpg";
            card.classList.add("card");
            card.addEventListener("click", selectACard);
            document.getElementById("board").append(card);

        }
        board.push(row);
    }
    console.log(board);
    setTimeout(hideCards, 1000); //hides the cards after 1 second
}

//starts the countdown timer
function startTimer(duration) { 
    timeRemaining = duration;
    updateTimerDisplay();

    timerInterval = setInterval(() => { 
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining === 0) { 
            clearInterval(timerInterval);

            if (playerInteracted === false) {
                points = 0;
                endGame("lose");
            } else if (matchMade === (rows * columns) / 2) {
                endGame("win");
            } else {
                endGame("lose");
            }
        }
    }, 1000);
}

//updates the timer display
function updateTimerDisplay() {
    timeRemaining = Math.max(0, timeRemaining); //makes sure that the maximum time is 0
    let minutes = Math.floor(timeRemaining / 60); //converts the seconds to minutes
    let seconds = timeRemaining % 60;

    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; //the condition makes sure that if the seconds is <10 it adds a 0 in front e.g. 2:05
}

//hides all cards after a brief display
function hideCards() {
    document.getElementById("board").style.pointerEvents = "none";
    for (let rowNum = 0; rowNum < rows; rowNum++) {
        for (let columnNum = 0; columnNum < columns; columnNum ++) {
            let card = document.getElementById(rowNum.toString() + "-" + columnNum.toString());
            card.src = "back.jpg"; //hide card faces
        }
    }
    setTimeout(() => {
        document.getElementById("board").style.pointerEvents = "auto";
    }, 1500);
}

//handles the card selection
function selectACard() {
    if (disableBoard || selectedCard2 || this === selectedCard1 || !this.src.includes("back.jpg") || this.classList.contains("matched") || timeRemaining === 0) return;

    playerInteracted = true;

    let [rowNum, columnNum] = this.id.split("-").map(Number);
    this.src = board[rowNum][columnNum] + ".jpg";

    if (!selectedCard1) {
        selectedCard1 = this;
    } else if (this !== selectedCard1) {
        selectedCard2 = this;
        disableBoard = true;
        setTimeout(update, 1000);
    }
}

//updates the game after an attempt
function update() {
    if (!selectedCard1 || !selectedCard2) {
        disableBoard = false;
        return;
    }
    let [rowNum1, columnNum1] = selectedCard1.id.split("-").map(Number);
    let [rowNum2, columnNum2] = selectedCard2.id.split("-").map(Number);

    let card1 = board[rowNum1][columnNum1];
    let card2 = board[rowNum2][columnNum2];

    card1 = card1.replace("_invent" , "");
    card2 = card2.replace("_invent" , "");
    
    if (card1 !== card2) {
        setTimeout(() => {
            selectedCard1.src = "back.jpg";
            selectedCard2.src = "back.jpg";
            disableBoard = false;
        }, 1000);

        // if points > 0, subtract 2 points. If 0, no negative points.
        if (points > 0) {
            points = Math.max(0, points - 2);
        }

        // if points <= 0, subtract time instead
        if (points === 0 && timeRemaining > 0) {
            timeRemaining = Math.max(0, timeRemaining - 5);
            updateTimerDisplay();

            if (timeRemaining === 0) {
                endGame("lose");
            }
        } 

        if (levelPicked === "hard" && points <= 0 && timeRemaining === 0) {
            endGame("lose");
        }
    } else {
        selectedCard1.classList.add("matched");
        selectedCard2.classList.add("matched");
        selectedCard1.removeEventListener("click", selectACard);
        selectedCard2.removeEventListener("click", selectACard);

        matchMade++;
        if (matchMade === (rows * columns) / 2){
            endGame("win");
        }
        streakCount++;
        points += 10;
        if (streakCount === 3){
            points += 15;
            streakCount = 0;
        }
    }
    document.getElementById("pointScore").innerText = points;
    selectedCard1 = null;
    selectedCard2 = null;
    disableBoard = false;
}

//handles the ending of the game
function endGame(reason){
    disableBoard = true;
    clearInterval(timerInterval);
    timerInterval = null;
    document.querySelectorAll(".card").forEach(card => {
        card.removeEventListener("click", selectACard);
    });

    let message = "";
    if (reason === "win") {
        message = `Congratulations! You have won the game! The points that you have earned is/are: ${points}`;
    } else if (reason === "lose") {
        message = `Oh no! You have lost the game! The points that you have earned is/are: ${points}`;
    }

    alert(message);
}
