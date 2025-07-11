let playerName = localStorage.getItem("ttt_player") || prompt("Enter your name:");
localStorage.setItem("ttt_player", playerName);

// Leaderboard array from localStorage
let leaderboard = JSON.parse(localStorage.getItem("ttt_leaderboard") || "[]");

const board = document.getElementById("gameBoard");
const resultMessage = document.getElementById("resultMessage");
const turnIndicator = document.getElementById("turnIndicator");
const endButtons = document.getElementById("endButtons");

let cells = [];
let currentPlayer = "X";
let isGameOver = false;

// Settings from localStorage
const mode = localStorage.getItem("ttt_mode") || "human";
const difficulty = localStorage.getItem("ttt_difficulty") || "easy";

// Load sounds
const music = new Audio("bg.mp3");
music.loop = true;
music.volume = 0.4;

const clickSound = new Audio("click.wav");
clickSound.volume = 0.8;

if (localStorage.getItem("ttt_music") !== "off") {
  music.play().catch(() => { });
}

// Initialize board
function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;

  if (cell.textContent !== "" || isGameOver) return;

  cell.textContent = currentPlayer;
  cell.style.color = currentPlayer === "X" ? "#ff4c4c" : "#4cc9ff";
  cell.classList.add("drop");

  if (clickSound) clickSound.play();

  if (checkWinner()) {
    resultMessage.textContent = currentPlayer === "X" ? "Red Wins!" : "Blue Wins!";
    resultMessage.style.color = currentPlayer === "X" ? "#ff4c4c" : "#4cc9ff";
    if (currentPlayer === "X" || currentPlayer === "O") {
      const winner = currentPlayer === "X" ? "Red" : "Blue";

      // 🎉 Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Save to leaderboard
      leaderboard.push({
        name: playerName,
        winner: winner,
        time: new Date().toLocaleString()
      });

      localStorage.setItem("ttt_leaderboard", JSON.stringify(leaderboard));
    }

    isGameOver = true;
    showEndButtons();
    // 🎉 Confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    return;
  }

  if (checkDraw()) {
    resultMessage.textContent = "Draw!";
    resultMessage.style.color = "#aaa";
    // Save draw to leaderboard
    leaderboard.push({
      name: playerName,
      winner: "Draw",
      time: new Date().toLocaleString()
    });

    localStorage.setItem("ttt_leaderboard", JSON.stringify(leaderboard));

    isGameOver = true;
    showEndButtons();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnIndicator.textContent = `Turn: ${currentPlayer === "X" ? "❌ " : "⭕ "}`;

  if (mode === "ai" && currentPlayer === "O") {
    setTimeout(computerMove, 400);
  }
}

// AI Move
function computerMove() {
  if (isGameOver) return;

  let move;
  if (difficulty === "easy") {
    let available = cells.filter(cell => cell.textContent === "");
    move = available[Math.floor(Math.random() * available.length)];
  } else {
    const best = minimax("O");
    move = cells[best.index];
  }

  move.textContent = "O";
  move.style.color = "#4cc9ff";
  move.classList.add("drop");

  if (clickSound) clickSound.play();

  if (checkWinner()) {
    resultMessage.textContent = "Blue Wins!";
    resultMessage.style.color = "#4cc9ff";
    isGameOver = true;
    showEndButtons();
    return;
  }

  if (checkDraw()) {
    resultMessage.textContent = "Draw!";
    resultMessage.style.color = "#aaa";
    isGameOver = true;
    showEndButtons();
    return;
  }

  currentPlayer = "X";
  turnIndicator.textContent = "Turn: ❌";
}

// Minimax for Hard AI
function minimax(player) {
  const availSpots = cells
    .map((cell, i) => (cell.textContent === "" ? i : null))
    .filter(i => i !== null);

  if (checkWinSim("X")) return { score: -10 };
  if (checkWinSim("O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const index = availSpots[i];
    const move = {};
    move.index = index;

    cells[index].textContent = player;

    const result = minimax(player === "O" ? "X" : "O");
    move.score = result.score;

    cells[index].textContent = ""; // undo move
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

// Simulated win check (for AI)
function checkWinSim(player) {
  const boardState = cells.map(c => c.textContent);
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winCombos.some(combo =>
    combo.every(i => boardState[i] === player)
  );
}

// Real-time winner check + animation
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[b].textContent === cells[c].textContent
    ) {
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");
      return true;
    }
  }
  return false;
}

function checkDraw() {
  return cells.every(cell => cell.textContent !== "");
}

function showEndButtons() {
  endButtons.classList.remove("hidden");
  setTimeout(() => {
    endButtons.classList.add("show");
  }, 50);
}

function restartGame() {
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win", "drop");
    cell.style.color = "#fff";
  });
  resultMessage.textContent = "";
  resultMessage.style.color = "#fff";
  isGameOver = false;
  currentPlayer = "X";
  turnIndicator.textContent = "Turn: ❌";

  endButtons.classList.add("hidden");
  endButtons.classList.remove("show");
}

// Init
createBoard();

if (mode === "ai") {
  turnIndicator.textContent = "Turn: ❌ You";
} else {
  turnIndicator.textContent = "Turn: ❌";
}

// MENU logic
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");

menuToggle.addEventListener("click", () => {
  menuOverlay.classList.remove("hidden");
  music.pause();
});

function resumeGame() {
  menuOverlay.classList.add("hidden");
  if (localStorage.getItem("ttt_music") !== "off") {
    music.play();
  }
}
