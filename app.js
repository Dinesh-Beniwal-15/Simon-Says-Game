const colors = ["yellow", "red", "green", "purple"];
const bestScoreStorageKey = "simon-best-score";
const tones = {
    red: 329.63,
    yellow: 392.0,
    green: 261.63,
    purple: 523.25
};

const levelValue = document.querySelector("#level-value");
const scoreValue = document.querySelector("#score-value");
const bestValue = document.querySelector("#best-value");
const livesValue = document.querySelector("#lives-value");
const statusText = document.querySelector("#status-text");
const startButton = document.querySelector("#start-btn");
const strictButton = document.querySelector("#strict-btn");
const allButtons = document.querySelectorAll(".btn");

const state = {
    gameSeq: [],
    userSeq: [],
    started: false,
    level: 0,
    score: 0,
    bestScore: Number(localStorage.getItem(bestScoreStorageKey)) || 0,
    lives: 3,
    strictMode: false,
    acceptingInput: false,
    showingSequence: false,
    runId: 0
};

let audioContext;

function updateHud() {
    levelValue.innerText = String(state.level);
    scoreValue.innerText = String(state.score);
    bestValue.innerText = String(state.bestScore);
    livesValue.innerText = state.strictMode ? "1" : String(state.lives);
    strictButton.innerText = `Strict: ${state.strictMode ? "On" : "Off"}`;
}

function setStatus(message) {
    statusText.innerText = message;
}

function triggerFlash(button, cssClass, duration) {
    button.classList.add(cssClass);
    setTimeout(() => {
        button.classList.remove(cssClass);
    }, duration);
}

function scheduleForRun(callback, delay, runId = state.runId) {
    setTimeout(() => {
        if (runId !== state.runId) {
            return;
        }
        callback();
    }, delay);
}

function getStepDuration() {
    return Math.max(180, 420 - state.level * 16);
}

function getButtonByColor(color) {
    return document.querySelector(`.btn.${color}`);
}

function createAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(color, duration = 140) {
    createAudioContext();
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.value = tones[color];
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
}

function playErrorTone() {
    createAudioContext();
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "square";
    oscillator.frequency.value = 110;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.25);
}

function animateBodyError() {
    document.body.classList.add("game-over");
    setTimeout(() => {
        document.body.classList.remove("game-over");
    }, 240);
}

function saveBestScore() {
    if (state.score > state.bestScore) {
        state.bestScore = state.score;
        localStorage.setItem(bestScoreStorageKey, String(state.bestScore));
    }
}

function resetRoundState() {
    state.userSeq = [];
    state.acceptingInput = false;
    state.showingSequence = false;
}

function startGame() {
    state.runId += 1;
    state.gameSeq = [];
    state.level = 0;
    state.score = 0;
    state.lives = 3;
    state.started = true;
    resetRoundState();
    setStatus("Watch closely...");
    updateHud();
    scheduleForRun(levelUp, 350);
}

function endGame(reason) {
    saveBestScore();
    animateBodyError();
    playErrorTone();
    setStatus(`Game over - ${reason} Final score: ${state.score}. Press Start to try again.`);
    state.started = false;
    state.acceptingInput = false;
    state.showingSequence = false;
    updateHud();
}

function levelUp() {
    if (!state.started) {
        return;
    }

    state.userSeq = [];
    state.level += 1;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    state.gameSeq.push(randomColor);
    updateHud();
    setStatus("Watch sequence...");
    playSequence();
}

function playSequence() {
    state.acceptingInput = false;
    state.showingSequence = true;
    const stepDuration = getStepDuration();
    let index = 0;
    const runId = state.runId;

    const playStep = () => {
        if (runId !== state.runId || !state.started) {
            return;
        }

        if (index >= state.gameSeq.length) {
            state.showingSequence = false;
            state.acceptingInput = true;
            setStatus("Your turn.");
            return;
        }

        const color = state.gameSeq[index];
        const button = getButtonByColor(color);
        triggerFlash(button, "flash", stepDuration - 40);
        playTone(color, stepDuration - 80);
        index += 1;
        scheduleForRun(playStep, stepDuration + 110, runId);
    };

    scheduleForRun(playStep, 400, runId);
}

function handleUserInput(color) {
    if (!state.started || !state.acceptingInput || state.showingSequence) {
        return;
    }

    const button = getButtonByColor(color);
    triggerFlash(button, "userflash", 160);
    playTone(color, 120);

    state.userSeq.push(color);
    const currentIndex = state.userSeq.length - 1;

    if (state.userSeq[currentIndex] !== state.gameSeq[currentIndex]) {
        if (state.strictMode) {
            endGame("wrong sequence in strict mode.");
            return;
        }

        state.lives -= 1;
        updateHud();

        if (state.lives <= 0) {
            endGame("you ran out of lives.");
            return;
        }

        playErrorTone();
        setStatus(`Wrong move. ${state.lives} lives left. Replaying sequence...`);
        state.userSeq = [];
        state.acceptingInput = false;
        scheduleForRun(playSequence, 900);
        return;
    }

    if (state.userSeq.length === state.gameSeq.length) {
        state.acceptingInput = false;
        state.score += state.level * 10;
        saveBestScore();
        updateHud();
        setStatus("Great! Next level...");
        scheduleForRun(levelUp, 850);
    }
}

function onButtonPress(event) {
    const color = event.currentTarget.getAttribute("data-color");
    handleUserInput(color);
}

function toggleStrictMode() {
    if (state.started) {
        setStatus("Finish this run before switching strict mode.");
        return;
    }

    state.strictMode = !state.strictMode;
    updateHud();
    if (!state.started) {
        setStatus(state.strictMode ? "Strict mode enabled." : "Strict mode disabled.");
    }
}

function handleKeyInput(event) {
    const key = event.key.toLowerCase();
    const keyMap = {
        "1": "red",
        "2": "yellow",
        "3": "green",
        "4": "purple",
        r: "red",
        y: "yellow",
        g: "green",
        p: "purple"
    };

    if ((key === "enter" || key === " ") && !state.started) {
        startGame();
        return;
    }

    if (keyMap[key]) {
        handleUserInput(keyMap[key]);
    }
}

startButton.addEventListener("click", startGame);
strictButton.addEventListener("click", toggleStrictMode);
document.addEventListener("keydown", handleKeyInput);

allButtons.forEach((button) => {
    button.addEventListener("click", onButtonPress);
});

updateHud();
