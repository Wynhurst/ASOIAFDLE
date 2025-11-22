let todayData = null;
let attempts = 0;

async function loadToday() {
  const res = await fetch("/api/today");
  todayData = await res.json();
  setupBoard(todayData.wordLength, todayData.maxAttempts);
}

function setupBoard(length, rows) {
  const board = document.getElementById("board");
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  board.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    const row = document.createElement("div");
    row.className = "row";

    for (let c = 0; c < length; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
  attempts = 0;
}

async function submitGuess() {
  const input = document.getElementById("guessInput");
  const guess = input.value.trim().toUpperCase();

  if (guess.length !== todayData.wordLength) {
    showMsg("Invalid length.");
    return;
  }

  const res = await fetch("/api/validate", {
    method: "POST",
    body: JSON.stringify({ guess, date: todayData.date }),
  });

  const result = await res.json();
  showFeedback(guess, result.feedback);

  attempts++;

  if (result.correct) {
    showMsg("Solved!");
  } else if (attempts >= todayData.maxAttempts) {
    showMsg("Out of tries!");
  } else {
    showMsg(`Attempts: ${attempts}/${todayData.maxAttempts}`);
  }

  input.value = "";
}

function showFeedback(guess, fb) {
  const row = document.getElementById("board").children[attempts];
  for (let i = 0; i < guess.length; i++) {
    const tile = row.children[i];
    tile.textContent = guess[i];
    tile.classList.add(fb[i]);
  }
}

function showMsg(t) {
  document.getElementById("msg").textContent = t;
}

document.getElementById("guessBtn").onclick = submitGuess;

loadToday();