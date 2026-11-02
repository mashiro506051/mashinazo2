let board = Array(9).fill(null);
let gameClear = false;

const buttons = document.querySelectorAll(".game-button");

const winPatterns = [
  [0,1,2],
  [3,4,5],
  [6,7,8],

  [0,3,6],
  [1,4,7],
  [2,5,8],

  [0,4,8],
  [2,4,6]
];

function playerMove(index) {

  if (gameClear) return;
  if (board[index] !== null) return;

  board[index] = "O";

  buttons[index].classList.add("player");

  if (checkWin("O")) {
    userWin();
    return;
  }

  if (isDraw()) {
    showDraw();
    return;
  }

  setTimeout(() => {

    computerMove();

    if (checkWin("X")) {
      showLose();
      return;
    }

    if (isDraw()) {
      showDraw();
    }

  }, 500);
}

function computerMove() {

  const moveCount =
    board.filter(cell => cell !== null).length;

  // ユーザー初手が中央
  if (
    moveCount === 1 &&
    board[4] === "O"
  ) {

    const sideMoves = [1,3,5,7];

    const choice =
      sideMoves[
        Math.floor(
          Math.random() * sideMoves.length
        )
      ];

    putComputer(choice);
    return;
  }

  // AIが勝てるなら勝つ
  const winningMove =
    findWinningMove("X");

  if (winningMove !== null) {
    putComputer(winningMove);
    return;
  }

  // 相手の勝ちを阻止
  const blockingMove =
    findWinningMove("O");

  if (blockingMove !== null) {
    putComputer(blockingMove);
    return;
  }

  // 最善手
  const bestMove =
    getBestMove();

  if (bestMove !== null) {
    putComputer(bestMove);
  }
}

function putComputer(index) {

  board[index] = "X";

  buttons[index]
    .classList
    .add("computer");
}

function findWinningMove(mark) {

  for (let i = 0; i < 9; i++) {

    if (board[i] === null) {

      board[i] = mark;

      if (checkWin(mark)) {

        board[i] = null;

        return i;
      }

      board[i] = null;
    }
  }

  return null;
}

function getBestMove() {

  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {

    if (board[i] === null) {

      board[i] = "X";

      const score =
        minimax(false);

      board[i] = null;

      if (score > bestScore) {

        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(isMaximizing) {

  if (checkWin("X")) return 10;
  if (checkWin("O")) return -10;
  if (isDraw()) return 0;

  if (isMaximizing) {

    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {

      if (board[i] === null) {

        board[i] = "X";

        const score =
          minimax(false);

        board[i] = null;

        bestScore =
          Math.max(
            score,
            bestScore
          );
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (let i = 0; i < 9; i++) {

    if (board[i] === null) {

      board[i] = "O";

      const score =
        minimax(true);

      board[i] = null;

      bestScore =
        Math.min(
          score,
          bestScore
        );
    }
  }

  return bestScore;
}

function checkWin(mark) {

  return winPatterns.some(pattern =>
    pattern.every(
      index =>
        board[index] === mark
    )
  );
}

function isDraw() {

  return board.every(
    cell => cell !== null
  );
}

function userWin() {

  gameClear = true;

  document
    .getElementById("message")
    .textContent =
      "勝利しました。これは何を表していたでしょう？";

  document
    .getElementById("answerArea")
    .style.display = "block";

  disableGameButtons();
}

function showLose() {

  document
    .getElementById("message")
    .textContent =
      "失敗しました。もう一度試してください。";

  setTimeout(
    resetGame,
    1200
  );
}

function showDraw() {

  document
    .getElementById("message")
    .textContent =
      "引き分けです。もう一度試してください。";

  setTimeout(
    resetGame,
    1200
  );
}

function checkAnswer() {

  const answer =
    document
      .getElementById("answer")
      .value
      .trim();

  if (
    answer === "三目並べ" ||
    answer === "さんもくならべ"
  ) {

    location.href =
      "q1-clear.html";
  }
  else {

    alert("違います");
  }
}

function resetGame() {

  board =
    Array(9).fill(null);

  gameClear = false;

  document
    .getElementById("message")
    .textContent =
      "ボタンを押してください";

  document
    .getElementById("answerArea")
    .style.display = "none";

  document
    .getElementById("answer")
    .value = "";

  buttons.forEach(button => {

    button.classList.remove(
      "player",
      "computer",
      "disabled"
    );
  });
}

function disableGameButtons() {

  buttons.forEach(button => {

    button.classList.add(
      "disabled"
    );
  });
}