const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const screens = Array.from(document.querySelectorAll(".screen"));
const form = document.querySelector("#love-form");
const firstInput = document.querySelector("#first-name");
const secondInput = document.querySelector("#second-name");
const formMessage = document.querySelector("[data-form-message]");
const submitButton = form.querySelector('button[type="submit"]');
const submitLabel = submitButton.querySelector(".love-button__label");
const originalButtonLabel = submitLabel.textContent;
const readingNames = document.querySelector("[data-reading-names]");
const countdown = document.querySelector("[data-countdown]");
const heartStage = document.querySelector("[data-heart-stage]");
const heartBurst = document.querySelector("[data-heart-burst]");
const readingMessage = document.querySelector("[data-reading-message]");
const readingProgress = document.querySelector("[data-reading-progress]");
const nameOne = document.querySelector("[data-name-one]");
const nameTwo = document.querySelector("[data-name-two]");
const scoreValue = document.querySelector("[data-score]");
const scoreLabel = document.querySelector("[data-score-label]");
const scoreProgress = document.querySelector("[data-score-progress]");
const messageText = document.querySelector("[data-message]");
const duaText = document.querySelector("[data-dua]");
const copyFeedback = document.querySelector("[data-copy-feedback]");
const editButton = document.querySelector('[data-action="edit"]');
const againButton = document.querySelector('[data-action="again"]');
const copyButton = document.querySelector('[data-action="copy"]');

const state = {
  first: "",
  second: "",
  dua: ""
};

let transitionTimer;
let readingTimer;
let scoreFrame;
let copyFeedbackTimer;
let readingStepTimers = [];

const readingMessages = [
  "Connecting two hearts...",
  "Gathering little moments of magic...",
  "Sending love into the universe...",
  "Two hearts found each other..."
];

const readingSteps = [
  { at: 0, count: "3", message: readingMessages[0], progress: 10 },
  { at: 1000, count: "2", message: readingMessages[1], progress: 42 },
  { at: 2000, count: "1", message: readingMessages[2], progress: 74 },
  { at: 2800, count: "♡", message: readingMessages[3], progress: 100, burst: true }
];

const outcomes = [
  {
    min: 92,
    label: "Written in the stars",
    message: (first, second) =>
      `${first} and ${second}, the universe seems to smile a little wider when your names are together. Hold onto that magic, and water it with kindness every single day.`,
    dua:
      "May Allah bless your bond with endless mercy, protect your hearts from every storm, and make your love a source of peace for one another. Ameen."
  },
  {
    min: 82,
    label: "A beautiful connection",
    message: (first, second) =>
      `${first}, there is something soft and certain about the way your heart leans toward ${second}. This feels like the beginning of a beautifully written forever.`,
    dua:
      "May Allah fill your days with gentle surprises, forgive every small misunderstanding, and keep your hearts softly tied together. Ameen."
  },
  {
    min: 72,
    label: "Sweet and growing",
    message: (first, second) =>
      `${first} and ${second}, your love has a sweet rhythm all its own. Keep laughing, keep choosing each other, and let the little moments bloom.`,
    dua:
      "May Allah guide your steps toward kindness, give you patience in every season, and make this love grow deeper with every passing day. Ameen."
  },
  {
    min: 62,
    label: "A lovely beginning",
    message: (first, second) =>
      `${first}, something lovely is stirring between you and ${second}. Give it patience, give it tenderness, and let love grow in its own beautiful time.`,
    dua:
      "May Allah place barakah in this beginning, guard your hearts, and turn every little moment you share into a reason to smile. Ameen."
  }
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function formatDisplayName(value) {
  return cleanName(value)
    .split(" ")
    .map((word) =>
      word
        .toLocaleLowerCase()
        .replace(/(^|['\u2019-])(\S)/gu, (match, prefix, letter) => prefix + letter.toLocaleUpperCase())
    )
    .join(" ");
}

function createAmbientParticles() {
  const container = document.querySelector("[data-particles]");
  const isSmall = window.matchMedia("(max-width: 560px)").matches;
  const counts = isSmall
    ? { heart: 6, star: 12, sparkle: 6, petal: 5 }
    : { heart: 11, star: 20, sparkle: 12, petal: 9 };
  const glyphs = {
    heart: ["♥", "♡"],
    star: ["✦", "✧", "✶"],
    sparkle: ["✦", "✨"]
  };
  const colors = {
    heart: ["rgba(214, 51, 108, 0.42)", "rgba(255, 64, 129, 0.38)", "rgba(255, 182, 193, 0.6)"],
    star: ["rgba(255, 255, 255, 0.95)", "rgba(255, 245, 248, 0.95)"],
    sparkle: ["rgba(255, 255, 255, 0.9)", "rgba(255, 182, 193, 0.9)"]
  };
  const fragment = document.createDocumentFragment();

  Object.entries(counts).forEach(([type, count]) => {
    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      const duration = randomBetween(type === "petal" ? 13 : 10, type === "petal" ? 24 : 19);

      particle.className = `ambient-particle ambient-particle--${type}`;
      particle.style.setProperty("--x", `${randomBetween(1, 99).toFixed(2)}%`);
      particle.style.setProperty("--duration", `${duration.toFixed(2)}s`);
      particle.style.setProperty("--delay", `${randomBetween(-duration, 0).toFixed(2)}s`);
      particle.style.setProperty("--drift", `${randomBetween(-90, 90).toFixed(0)}px`);
      particle.style.setProperty("--spin", `${Math.round(randomBetween(180, 560))}`);

      if (type === "star" || type === "sparkle") {
        particle.style.setProperty("--y", `${randomBetween(3, 97).toFixed(2)}%`);
        particle.style.setProperty("--size", `${randomBetween(8, 16).toFixed(1)}px`);
        particle.textContent = pick(glyphs[type]);
      }

      if (type === "heart") {
        particle.style.setProperty("--size", `${randomBetween(10, 20).toFixed(1)}px`);
        particle.textContent = pick(glyphs.heart);
      }

      if (type === "petal") {
        particle.style.setProperty("--size", `${randomBetween(9, 17).toFixed(1)}px`);
      }

      if (colors[type]) {
        particle.style.setProperty("--particle-color", pick(colors[type]));
      }

      fragment.appendChild(particle);
    }
  });

  container.appendChild(fragment);
}

function cleanName(value) {
  return value.trim().replace(/\s+/g, " ");
}

function hashNames(first, second) {
  const names = [first.toLocaleLowerCase(), second.toLocaleLowerCase()].sort();
  const key = `${names[0]}♡${names[1]}`;
  let hash = 2166136261;

  for (const character of key) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function buildResult(first, second) {
  const score = 62 + (hashNames(first, second) % 38);
  const outcome = outcomes.find((item) => score >= item.min);

  return {
    score,
    label: outcome.label,
    message: outcome.message(first, second),
    dua: outcome.dua
  };
}

function setFieldError(input, invalid) {
  input.closest(".input-shell").classList.toggle("has-error", invalid);
  input.setAttribute("aria-invalid", String(invalid));
}

function showScreen(name, onShown) {
  window.clearTimeout(transitionTimer);

  const next = screens.find((screen) => screen.dataset.screen === name);
  if (!next) return;

  const current = screens.find((screen) => screen.classList.contains("is-active"));

  if (current === next) {
    if (typeof onShown === "function") onShown();
    return;
  }

  screens.forEach((screen) => {
    if (screen !== current) screen.classList.remove("is-active", "is-leaving");
  });

  const finish = () => {
    if (current) current.classList.remove("is-active", "is-leaving");
    next.classList.add("is-active");
    next.focus({ preventScroll: true });

    if (typeof onShown === "function") onShown();
  };

  if (!current || reducedMotionQuery.matches) {
    finish();
    return;
  }

  current.classList.add("is-leaving");
  transitionTimer = window.setTimeout(finish, 260);
}

function animateScore(score) {
  if (scoreFrame) window.cancelAnimationFrame(scoreFrame);
  scoreProgress.style.strokeDashoffset = String(100 - score);

  if (reducedMotionQuery.matches) {
    scoreValue.textContent = String(score);
    return;
  }

  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    scoreValue.textContent = String(Math.round(score * eased));

    if (progress < 1) {
      scoreFrame = window.requestAnimationFrame(tick);
    }
  };

  scoreFrame = window.requestAnimationFrame(tick);
}

function fillResult(result, first, second) {
  nameOne.textContent = first;
  nameTwo.textContent = second;
  scoreLabel.textContent = result.label;
  messageText.textContent = result.message;
  duaText.textContent = result.dua;
  scoreValue.textContent = "0";
  scoreProgress.style.strokeDashoffset = "100";
  copyFeedback.textContent = "";
  state.dua = result.dua;
}

function clearReadingSequence() {
  readingStepTimers.forEach((timer) => window.clearTimeout(timer));
  readingStepTimers = [];
  window.clearTimeout(readingTimer);
}

function resetReadingAnimation() {
  clearReadingSequence();
  countdown.textContent = "3";
  countdown.classList.remove("is-ticking");
  readingMessage.textContent = readingMessages[0];
  readingMessage.classList.remove("is-changing");
  readingProgress.style.width = "0%";
  heartStage.classList.remove("is-bursting");
  heartBurst.replaceChildren();
}

function createHeartBurst() {
  heartBurst.replaceChildren();

  const glyphs = ["♥", "♡", "✦", "✧"];
  const colors = ["#ff4081", "#d6336c", "#ffb6c1", "#fff5f8"];
  const count = reducedMotionQuery.matches ? 8 : 22;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / count + randomBetween(-0.12, 0.12);
    const distance = randomBetween(52, 108);

    particle.className = "burst-particle";
    particle.textContent = pick(glyphs);
    particle.style.setProperty("--tx", `${(Math.cos(angle) * distance).toFixed(1)}px`);
    particle.style.setProperty("--ty", `${(Math.sin(angle) * distance).toFixed(1)}px`);
    particle.style.setProperty("--rot", `${Math.round(randomBetween(-160, 160))}deg`);
    particle.style.setProperty("--size", `${randomBetween(11, 21).toFixed(1)}px`);
    particle.style.setProperty("--delay", `${randomBetween(0, 0.12).toFixed(2)}s`);
    particle.style.setProperty("--end-scale", randomBetween(0.85, 1.35).toFixed(2));
    particle.style.setProperty("--burst-color", pick(colors));
    fragment.appendChild(particle);
  }

  heartBurst.appendChild(fragment);
  heartStage.classList.add("is-bursting");
}

function showReadingStep(step) {
  countdown.textContent = step.count;
  restartAnimation(countdown, "is-ticking");
  readingMessage.textContent = step.message;
  restartAnimation(readingMessage, "is-changing");
  readingProgress.style.width = `${step.progress}%`;

  if (step.burst) createHeartBurst();
}

function runReadingSequence(onComplete) {
  readingSteps.forEach((step) => {
    const timer = window.setTimeout(() => showReadingStep(step), step.at);
    readingStepTimers.push(timer);
  });

  readingTimer = window.setTimeout(onComplete, 3700);
}

function beginReading(first, second) {
  if (scoreFrame) window.cancelAnimationFrame(scoreFrame);

  resetReadingAnimation();

  state.first = first;
  state.second = second;
  readingNames.textContent = `${first} ♡ ${second}`;

  showScreen("reading", () => {
    runReadingSequence(() => {
      const result = buildResult(first, second);
      fillResult(result, first, second);
      showScreen("result", () => animateScore(result.score));
    });
  });
}

function restoreWelcome() {
  resetReadingAnimation();
  submitButton.disabled = false;
  submitButton.classList.remove("is-busy");
  submitLabel.textContent = originalButtonLabel;
  formMessage.textContent = "";
  formMessage.classList.remove("is-visible");
  document.querySelectorAll(".typing-heart").forEach((heart) => heart.classList.remove("is-pulsing"));
  setFieldError(firstInput, false);
  setFieldError(secondInput, false);
  showScreen("welcome");
}

function copyWithFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Copy failed");
}

function showCopyFeedback(text) {
  window.clearTimeout(copyFeedbackTimer);
  copyFeedback.textContent = text;
  copyFeedbackTimer = window.setTimeout(() => {
    copyFeedback.textContent = "";
  }, 2400);
}

async function copyDua() {
  if (!state.dua) return;

  const text = `${state.first} ♡ ${state.second}\n\n${state.dua}`;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      copyWithFallback(text);
    }

    showCopyFeedback("Dua copied ♡");
  } catch {
    showCopyFeedback("Couldn't copy it. You can select the dua instead.");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const first = cleanName(firstInput.value);
  const second = cleanName(secondInput.value);
  const firstInvalid = first.length < 2;
  const secondInvalid = second.length < 2;

  setFieldError(firstInput, firstInvalid);
  setFieldError(secondInput, secondInvalid);

  if (firstInvalid || secondInvalid) {
    formMessage.textContent = "♡ Please add both names — the stars need them both.";
    restartAnimation(formMessage, "is-visible");
    (firstInvalid ? firstInput : secondInput).focus();
    return;
  }

  firstInput.value = first;
  secondInput.value = second;

  formMessage.textContent = "";
  formMessage.classList.remove("is-visible");
  submitButton.disabled = true;
  submitButton.classList.add("is-busy");
  submitLabel.textContent = "Gathering the stars...";
  beginReading(formatDisplayName(first), formatDisplayName(second));
});

[firstInput, secondInput].forEach((input) => {
  input.addEventListener("input", () => {
    const heart = input.parentElement.querySelector(".typing-heart");
    restartAnimation(heart, "is-pulsing");
    setFieldError(input, false);
    formMessage.textContent = "";
    formMessage.classList.remove("is-visible");
  });
});

againButton.addEventListener("click", () => {
  if (!state.first || !state.second) return;
  beginReading(state.first, state.second);
});

editButton.addEventListener("click", restoreWelcome);
copyButton.addEventListener("click", copyDua);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && form.closest(".screen").classList.contains("is-active") === false) {
    restoreWelcome();
  }
});

createAmbientParticles();
