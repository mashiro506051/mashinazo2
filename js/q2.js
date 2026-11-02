const correctSequence = [
  "E5", "E5", "E5",
  "F5", "FS5",
  "G5",
  "G5", "FS5", "G5",
  "A5", "A5", "A5",
  "B5", "C6", "E6"
];

const frequencies = {
  E5: 659.25,
  F5: 698.46,
  FS5: 739.99,
  G5: 783.99,
  GS5: 830.61,
  A5: 880.00,
  AS5: 932.33,
  B5: 987.77,
  C6: 1046.50,
  CS6: 1108.73,
  D6: 1174.66,
  DS6: 1244.51,
  E6: 1318.51
};

let inputSequence = [];

let counts = {
  E5: 3,
  F5: 1,
  FS5: 2,
  G5: 3,
  GS5: 0,
  A5: 3,
  AS5: 0,
  B5: 1,
  C6: 1,
  CS6: 0,
  D6: 0,
  DS6: 0,
  E6: 1
};

function playKey(note) {
  if (inputSequence.length >= correctSequence.length) return;

  if (counts[note] <= 0) {
    document.getElementById("message").textContent =
      "この鍵盤はもう押せません";
    return;
  }

  playSound(note);
  flashKey(note);

  counts[note]--;
  updateCount(note);

  inputSequence.push(note);

  const remaining =
    correctSequence.length - inputSequence.length;

  if (remaining > 0) {
    document.getElementById("message").textContent =
      `残り${remaining}回`;
  }

  if (inputSequence.length === correctSequence.length) {
    judgeSequence();
  }
}

function judgeSequence() {
  const isCorrect =
    inputSequence.every((note, index) =>
      note === correctSequence[index]
    );

  if (isCorrect) {
    clearPiano();
  }
  else {
    document.getElementById("message").textContent =
      "間違えています。やり直してください。";

    setTimeout(resetPiano, 1500);
  }
}

function playSound(note) {
  const audioContext =
    new (window.AudioContext || window.webkitAudioContext)();

  const oscillator =
    audioContext.createOscillator();

  const gainNode =
    audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequencies[note];

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(
    0.25,
    audioContext.currentTime
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.45
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.45);
}

function flashKey(note) {
  const key =
    document.querySelector(`[data-note="${note}"]`);

  key.classList.add("active");

  setTimeout(() => {
    key.classList.remove("active");
  }, 180);
}

function updateCount(note) {
  const key =
    document.querySelector(`[data-note="${note}"]`);

  const count =
    key.querySelector(".count");

  if (counts[note] <= 0) {
    count.textContent = "";
    key.classList.add("used");
  }
  else {
    count.textContent = counts[note];
  }
}

function resetPiano() {
  inputSequence = [];

  counts = {
    E5: 3,
    F5: 1,
    FS5: 2,
    G5: 3,
    GS5: 0,
    A5: 3,
    AS5: 0,
    B5: 1,
    C6: 1,
    CS6: 0,
    D6: 0,
    DS6: 0,
    E6: 1
  };

  document.getElementById("message").textContent =
    "鍵盤を正しい順番で弾いてください";

  document.getElementById("answerArea").style.display =
    "none";

  document.querySelectorAll(".key").forEach(key => {
    const note = key.dataset.note;
    const count = key.querySelector(".count");

    count.textContent =
      counts[note] > 0 ? counts[note] : "";

    key.classList.remove("used", "active");
    key.disabled = false;
  });

  document.getElementById("answer").value = "";
}

function clearPiano() {
  document.getElementById("message").textContent =
    "演奏成功！これは何のアニメの曲ですか？";

  document.getElementById("answerArea").style.display =
    "block";

  document.querySelectorAll(".key").forEach(key => {
    key.disabled = true;
  });
}

function checkAnswer() {
  const answer =
    document
      .getElementById("answer")
      .value
      .trim();

  if (
    answer === "鉄腕アトム" ||
    answer === "てつわんあとむ" ||
    answer === "アトム"
  ) {
    location.href = "q2-clear.html";
  }
  else {
    alert("違います");
  }
}