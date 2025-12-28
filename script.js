const gameIntroSection = document.getElementById("game-intro-section");
const gameBoardSection = document.getElementById("game-board-section");

const chooseSignBtn = document.querySelectorAll(".sign-choice-btn");
const playVsComputer = document.getElementById("vs-computer-btn");
const playVsFriend = document.getElementById("vs-friend-btn");
const player1NameField = document.getElementById("player-1-name-input");
const player2NameField = document.getElementById("player-2-name-input");
let gameBoardCells = document.querySelectorAll(".game-board-cell");
const gameStatusText = document.getElementById("game-status");

const player1NameText = document.querySelectorAll(".player-1-name");
const player2NameText = document.querySelectorAll(".player-2-name");
const player1SignIcon = document.querySelectorAll(".player-1-sign");
const player2SignIcon = document.querySelectorAll(".player-2-sign");

const player1ScoreText = document.getElementById("player-1-score");
const player2ScoreText = document.getElementById("player-2-score");
const tieScoreText = document.getElementById("tie-score");
const player1ScoreCard = document.getElementById("player-1-score-card");
const player2ScoreCard = document.getElementById("player-2-score-card");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const modalSubHeading = document.getElementById("modal-subheading");
const modalHeading = document.getElementById("modal-heading");

const nextRoundBtn = document.getElementById("next-round-btn");
const modalQuitBtn = document.getElementById("modal-quit-btn");
const quitBtn = document.getElementById("quit-btn");
const resetBtn = document.getElementById("reset-btn");

let player1Score = 0,
  player2Score = 0,
  tieScore = 0;
let player1Sign = "o",
  player2Sign = "x",
  player1Name,
  player2Name;
let vsPlayerOrComputer,
  currentChance = "o";
let gameOver = false;

let gameStatus = ["", "", "", "", "", "", "", "", ""];
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Function for handling the next round button click when game is over
function handleNextRoundBtnClick() {
  const boardCells = document.querySelectorAll(".game-board-cell");

  gameOver = false;
  gameStatus = ["", "", "", "", "", "", "", "", ""];

  showModal(false);

  // Clearing the board
  boardCells.forEach((cell) => {
    cell.style.backgroundImage = "";
    cell.classList.remove("occupied");
    cell.classList.remove("winning-cell");
  });
  gameStatusText.innerHTML = `${currentChance.toUpperCase()}'s Chance`;

  if (vsPlayerOrComputer == "computer" && currentChance == player2Sign) {
    getComputerMove();
  }
}

// Function for handling the quit button click
function handleQuitButtonClick() {
  gameIntroSection.classList.add("current-screen");
  gameBoardSection.classList.remove("current-screen");

  player1Name = "";
  player2Name = "";

  updateScores();
  showModal(false);
  resetGame();
}

// Function for handling the reset button click
function handleResetButtonClick() {
  resetGame();
}

// Function for starting the game
function startGame(vsComputerOrPlayer) {
  currentChance = player1Sign;
  gameOver = false;

  // Assigning Player 1 and Player 2 Names
  if (vsComputerOrPlayer == "player") {
    player1Name =
      player1NameField.value.trim() != ""
        ? player1NameField.value
        : "Unknown Player 1";

    player2Name =
      player2NameField.value.trim() != ""
        ? player2NameField.value
        : "Unknown Player 2";

    vsPlayerOrComputer = vsComputerOrPlayer;
  } else if (vsComputerOrPlayer == "computer") {
    player1Name =
      (player1NameField.value.trim() != ""
        ? player1NameField.value
        : "Unknown Player 1") + " (You)";
    player2Name = "Computer";

    vsPlayerOrComputer = vsComputerOrPlayer;
  }

  gameIntroSection.classList.remove("current-screen");
  gameBoardSection.classList.add("current-screen");

  addBoardCellEventListeners(true);
  updateGameInfo(player1Name, player2Name);
  updateScores();
}

// Function for selecting the sign of players
function selectSign(btn) {
  const currentSign = btn.id.slice(-6, -5);
  const currentPlayer = btn.id.slice(7, -7);

  const oppositePlayer = currentPlayer == 1 ? 2 : 1;

  let currentPlayerSign, oppositePlayerSign;
  let currentPlayerOtherSign, oppositePlayerOtherSign;

  // Checking which sign is being selected
  if (currentSign == "x") {
    // Getting the current player sign and opposite player sign element
    oppositePlayerSign = document.getElementById(
      `player-${oppositePlayer}-o-sign`
    );
    currentPlayerSign = document.getElementById(
      `player-${currentPlayer}-x-sign`
    );

    // Getting the current and opposite player's other sign (that is not selected) element
    currentPlayerOtherSign = document.getElementById(
      `player-${currentPlayer}-o-sign`
    );
    oppositePlayerOtherSign = document.getElementById(
      `player-${oppositePlayer}-x-sign`
    );
  } else {
    oppositePlayerSign = document.getElementById(
      `player-${oppositePlayer}-x-sign`
    );

    currentPlayerSign = document.getElementById(
      `player-${currentPlayer}-o-sign`
    );

    currentPlayerOtherSign = document.getElementById(
      `player-${currentPlayer}-x-sign`
    );
    oppositePlayerOtherSign = document.getElementById(
      `player-${oppositePlayer}-o-sign`
    );
  }

  // Adding the selected-sign class to show the selected sign of both players
  currentPlayerSign.classList.add("selected-sign");
  oppositePlayerSign.classList.add("selected-sign");

  // Removing the selected-sign class from the sign of both the players that were previously selected
  currentPlayerOtherSign.classList.remove("selected-sign");
  oppositePlayerOtherSign.classList.remove("selected-sign");

  // Assigning the signs selected by both players in variable
  if (currentPlayer == "1") {
    player1Sign = currentSign;
    player2Sign = player1Sign == "x" ? "o" : "x";
  } else {
    player2sign = currentSign;
    player1Sign = player1Sign == "x" ? "o" : "x";
  }
}

// Function for swapping the chance
function swapChance() {
  currentChance = currentChance == "x" ? "o" : "x";
  gameStatusText.innerHTML = `${currentChance.toUpperCase()}'s Chance`;
}

// Function for updating the score text
function updateScores() {
  player1ScoreText.innerHTML = player1Score;
  player2ScoreText.innerHTML = player2Score;
  tieScoreText.innerHTML = tieScore;
}

// Function get computer's chance
function getComputerMove() {
  // Restricting the user from adding input while computer is choosing its move
  addBoardCellEventListeners(false);
  gameStatusText.innerHTML = "Computer is choosing its move";

  setTimeout(() => {
    let requiredCell;
    winningCombinations.forEach((combination) => {
      // Making cases to check if a user is attending winning position or a winning position can be achieved by computer
      const case1 =
        gameStatus[combination[0]] != "" &&
        gameStatus[combination[1]] != "" &&
        gameStatus[combination[0]] == gameStatus[combination[1]];
      const case2 =
        gameStatus[combination[1]] != "" &&
        gameStatus[combination[2]] != "" &&
        gameStatus[combination[1]] == gameStatus[combination[2]];
      const case3 =
        gameStatus[combination[0]] != "" &&
        gameStatus[combination[2]] != "" &&
        gameStatus[combination[0]] == gameStatus[combination[2]];

      // Checking if any of the cases are forming and the remaining block is empty
      if (case1 && gameStatus[combination[2]] == "") {
        requiredCell = document.getElementById(`pos-${combination[2] + 1}`);
      } else if (case2 && gameStatus[combination[0]] == "") {
        requiredCell = document.getElementById(`pos-${combination[0] + 1}`);
      } else if (case3 && gameStatus[combination[1]] == "") {
        requiredCell = document.getElementById(`pos-${combination[1] + 1}`);
      }
    });
    console.log("empty: " + requiredCell);

    // if any of the above cases does not match, then choosing a random position
    if (requiredCell == undefined) {
      let emptyCellPositions = [];

      document.querySelectorAll(".game-board-cell").forEach((cell) => {
        if (
          cell.style.backgroundImage == "" ||
          cell.style.backgroundImage == "none"
        ) {
          emptyCellPositions.push(parseInt(cell.id.charAt(cell.id.length - 1)));
        }
      });
      console.log(emptyCellPositions);
      let difference = emptyCellPositions.length - 1;
      console.log(Math.floor(Math.random() * difference));
      let randomPos =
        emptyCellPositions[Math.floor(Math.random() * difference) + 1];

      requiredCell = document.getElementById(`pos-${randomPos}`);
      console.log("Computer Cell: ");
      console.log(requiredCell);
    }

    addSignOnBoard(requiredCell);
    addBoardCellEventListeners(true);
  }, 1000);
}

// Function for checking winning
function checkWinning() {
  // Iterating through all the winning combinations to check if any of the combination matches the current game combination
  for (let i = 0; i < winningCombinations.length; i++) {
    let combination = winningCombinations[i];
    if (
      gameStatus[combination[0]] != "" &&
      gameStatus[combination[0]] == gameStatus[combination[1]] &&
      gameStatus[combination[0]] == gameStatus[combination[2]]
    ) {
      gameStatusText.innerHTML = `${
        gameStatus[combination[0]] == player1Sign ? player1Name : player2Name
      } (${gameStatus[combination[0]].toUpperCase()}) Wins !`;

      // Highlighting the winning combination of signs on game board
      document
        .getElementById(`pos-${combination[0] + 1}`)
        .classList.add("winning-cell");
      document
        .getElementById(`pos-${combination[1] + 1}`)
        .classList.add("winning-cell");
      document
        .getElementById(`pos-${combination[2] + 1}`)
        .classList.add("winning-cell");

      if (gameStatus[combination[0]] == player1Sign) {
        player1Score += 1;
      } else {
        player2Score += 1;
      }

      // Disabling the board cells effects such as on click and hover
      gameOver = true;
      enableCellHoverEffects(false);

      // Showing game over modal
      showModal(
        true,
        `${gameStatus[combination[0]].toUpperCase()} Wins !`,
        `${
          gameStatus[combination[0]] == player1Sign ? player1Name : player2Name
        } takes this round`
      );

      return 0;
    }
  }

  // Declaring game to be tie when all cells are filled and no winning combinations are matched
  if (!gameStatus.includes("")) {
    gameStatusText.innerHTML = `Its A Tie ! No One Wins !`;
    tieScore += 1;
    gameOver = true;

    showModal(true, "No One Wins !", "Its A Tie !");
  }
}

// Function for adding and removing the hover effect on cell
function enableCellHoverEffects(enable) {
  if (enable) {
    gameBoardCells.forEach((cell) => {
      cell.classList.add("cell-hover");
      cell.addEventListener("mouseover", (event) => {
        if (!gameOver) {
          if (
            cell.style.backgroundImage == "none" ||
            cell.style.backgroundImage == ""
          ) {
            cell.style.backgroundImage = `url("./assets/icon-${currentChance}-outline.svg")`;
          }
        }
      });
      cell.addEventListener("mouseout", (event) => {
        if (!cell.classList.contains("occupied")) {
          cell.style.backgroundImage = "none";
        }
      });
    });
  } else {
    gameBoardCells.forEach((cell) => {
      cell.classList.remove("cell-hover");
      removeEventListener("mousein", cell);
      removeEventListener("mouseout", cell);
    });
  }
}

// Function for showing and hiding modal
function showModal(showmodal, modalSubHeadingText, modalHeadingText) {
  if (showmodal) {
    modal.classList.add("show");
    overlay.style.display = "block";

    modalSubHeading.innerHTML = modalSubHeadingText;
    modalHeading.innerHTML = modalHeadingText;
  } else {
    modal.classList.remove("show");
    overlay.style.display = "none";
  }
}

// Function for clearing the board
function resetGame() {
  // Resetting all the game variables
  player1Score = 0;
  player2Score = 0;
  tieScore = 0;
  gameStatus = ["", "", "", "", "", "", "", "", ""];

  gameBoardCells = document.querySelectorAll(".game-board-cell");

  gameBoardCells.forEach((cell) => {
    cell.style.backgroundImage = "none";
    cell.classList.remove("occupied");
    cell.classList.remove("winning-cell");
  });
  enableCellHoverEffects(true);

  updateScores();
}

// Function for adding event listeners to the game board cells
function addBoardCellEventListeners(add) {
  gameBoardCells.forEach((cell) => {
    cell.addEventListener("mouseover", (event) => {
      if (!gameOver) {
        if (
          cell.style.backgroundImage == "none" ||
          cell.style.backgroundImage == ""
        ) {
          cell.style.backgroundImage = `url("./assets/icon-${currentChance}-outline.svg")`;
        }
      }
    });
    cell.addEventListener("mouseout", (event) => {
      if (!cell.classList.contains("occupied")) {
        cell.style.backgroundImage = "none";
      }
    });

    if (add) {
      cell.addEventListener("click", handleBoardCellClick, true);
    } else {
      cell.removeEventListener("click", handleBoardCellClick, true);
    }
  });
}

function handleBoardCellClick(event) {
  addSignOnBoard(event.target);
}

// Function for updating the game board
function updateGameInfo(player1Name, player2Name) {
  player1NameText.forEach((text) => {
    text.innerHTML = player1Name;
  });
  player2NameText.forEach((text) => {
    text.innerHTML = player2Name;
  });
  player1SignIcon.forEach((icon) => {
    icon.src = `./assets/icon-${player1Sign}.svg`;
  });
  player2SignIcon.forEach((icon) => {
    icon.src = `./assets/icon-${player2Sign}.svg`;
  });

  gameStatusText.innerHTML = `${currentChance.toUpperCase()}'s Chance`;

  if (player1Sign == "x") {
    player1ScoreCard.style.backgroundColor = "var(--blue-color)";
    player2ScoreCard.style.backgroundColor = "var(--yellow-color)";
  } else {
    player2ScoreCard.style.backgroundColor = "var(--blue-color)";
    player1ScoreCard.style.backgroundColor = "var(--yellow-color)";
  }
}

// Function for adding the sign to the game board on click
function addSignOnBoard(cell) {
  if (!gameOver && cell) {
    if (!cell.classList.contains("occupied")) {
      cell.style.backgroundImage = `url("./assets/icon-${currentChance}.svg")`;
      cell.classList.add("occupied");

      const cellId = parseInt(cell.id.charAt(cell.id.length - 1));
      gameStatus[cellId - 1] = currentChance;

      swapChance();
      checkWinning();
      updateScores();

      if (
        vsPlayerOrComputer.toLowerCase() == "computer" &&
        currentChance == player2Sign
      ) {
        getComputerMove();
      }
      console.log(gameStatus);
    }
  }
}

chooseSignBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectSign(btn);
  });
});

// Adding Event Listeners
nextRoundBtn.addEventListener("click", handleNextRoundBtnClick);
modalQuitBtn.addEventListener("click", handleQuitButtonClick);
quitBtn.addEventListener("click", handleQuitButtonClick);
resetBtn.addEventListener("click", handleResetButtonClick);

playVsComputer.addEventListener("click", () => {
  startGame("computer");
});
playVsFriend.addEventListener("click", () => {
  startGame("player");
});
