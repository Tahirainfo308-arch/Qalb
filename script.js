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
const duaNames = document.querySelector("[data-dua-names]");
const duaWords = document.querySelector("[data-dua-text]");
const toast = document.querySelector("[data-toast]");
const duaButton = document.querySelector('[data-action="dua"]');
const backButton = document.querySelector('[data-action="back"]');
const copyDuaButton = document.querySelector('[data-action="copy-dua"]');
const shareButton = document.querySelector('[data-action="share"]');
const copyResultButton = document.querySelector('[data-action="copy-result"]');
const quoteText = document.querySelector("[data-quote-text]");
const quoteButton = document.querySelector('[data-action="quote"]');
const editButton = document.querySelector('[data-action="edit"]');
const againButton = document.querySelector('[data-action="again"]');

const state = {
  first: "",
  second: "",
  result: null,
  dua: ""
};

let transitionTimer;
let readingTimer;
let scoreFrame;
let toastTimer;
let readingStepTimers = [];
let currentQuote = "";
let currentDua = "";
const quoteHistory = [];
const duaHistory = [];

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

const romanticQuotes = [
  "Some hearts feel like home, even from miles away.",
  "Duaon mein yaad rakhna bhi mohabbat ki khoobsurat baat hai.",
  "May your smiles always find their way back to each other.",
  "Kuch log dil ko sukoon dene ke liye milte hain.",
  "The sweetest love is the one that brings peace to your heart.",
  "Aapki yaad dil ko chhoti si roshni si lagti hai.",
  "Love grows quietly, in patience, in kindness, in the little things you do.",
  "Thori si baat, thora sa dhyaan, aur dil ke andar ek naya sa khel.",
  "May your conversations always feel like a soft place to land.",
  "Sath chalne wale log kam milte hain, unhe hamesha yaad rakhna.",
  "A gentle love is not loud; it simply stays.",
  "Dil ka sukoon kisi ke saath mil jaye to usay sab se badi baat samjho.",
  "May every small kindness between you become a reason to smile.",
  "Mushkil dinon mein bhi ek dusre ka saath sab se bari baat hai.",
  "Some bonds are not rushed; they bloom in their own gentle time.",
  "Aankhon se nahi, dil se dekhne wali mohabbat sab se gehri hoti hai.",
  "May your days hold more laughter than worries, and more closeness than distance.",
  "Pyar wo nahi jo sirf kaha jaye, pyar wo hai jo amal mein dikhe.",
  "A single kind word can make a whole heart feel lighter.",
  "Dua karo ke rishta imaandari, sabr aur muhabbat se bara kare."
];

const outcomes = [
  {
    min: 90,
    label: "Written in the stars",
    message: "Two hearts, one beautiful destiny. May your story be full of love. 💞",
    dua:
      "May Allah bless your bond with endless mercy, protect your hearts from every storm, and make your love a source of peace for one another. Ameen."
  },
  {
    min: 80,
    label: "A beautiful connection",
    message: "A lovely connection with lots of beautiful moments ahead. 🌷",
    dua:
      "May Allah fill your days with gentle surprises, forgive every small misunderstanding, and keep your hearts softly tied together. Ameen."
  },
  {
    min: 70,
    label: "Sweet and growing",
    message: "A sweet little bond that deserves care and kindness. 💗",
    dua:
      "May Allah guide your steps toward kindness, give you patience in every season, and make this love grow deeper with every passing day. Ameen."
  },
  {
    min: 60,
    label: "A lovely beginning",
    message: "Every beautiful story begins with a little spark. ✨",
    dua:
      "May Allah place barakah in this beginning, guard your hearts, and turn every little moment you share into a reason to smile. Ameen."
  }
];

const duas = [
  "Ya Allah, if this bond is good for them, unite their hearts in kindness and make their love a source of peace. Ameen.",
  "Ya Allah, guide them to speak gently, listen patiently, and choose each other with a sincere heart. Ameen.",
  "May Allah fill their days with barakah, their home with laughter, and their hearts with lasting tranquillity. Ameen.",
  "Ya Allah, protect them from pride and misunderstanding; replace it with forgiveness, mercy, and understanding. Ameen.",
  "May Allah make their love halal, pure, and steady, and bless every step they take toward one another. Ameen.",
  "Ya Allah, give them courage to be honest and wisdom to be gentle, so their bond grows in goodness. Ameen.",
  "May Allah keep their hearts safe in every storm and give them patience when the road feels difficult. Ameen.",
  "Ya Allah, let their care for one another be a means of closeness to You, not a source of harm. Ameen.",
  "May Allah bless them with a future built on trust, kindness, and shared dreams that please Him. Ameen.",
  "Ya Allah, if this love is meant to bloom, water it with mercy and surround it with goodness. Ameen.",
  "May Allah grant them contentment in each other's company and strength to choose what is right. Ameen.",
  "Ya Allah, make their story one of forgiveness, faith, and gentle love that brings peace to all around them. Ameen."
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
  const score = 60 + (hashNames(first, second) % 41);
  const outcome = outcomes.find((item) => score >= item.min);

  return {
    score,
    label: outcome.label,
    message: outcome.message,
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
  restartAnimation(scoreValue, "is-counting");

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

function setRandomQuote() {
  const freshQuotes = romanticQuotes.filter((quote) => quote !== currentQuote && !quoteHistory.includes(quote));
  const pool = freshQuotes.length ? freshQuotes : romanticQuotes.filter((quote) => quote !== currentQuote);

  currentQuote = pick(pool);
  quoteHistory.push(currentQuote);

  if (quoteHistory.length > romanticQuotes.length - 1) {
    quoteHistory.shift();
  }

  quoteText.textContent = currentQuote;
  restartAnimation(quoteText, "is-changing");
}

function chooseDua() {
  const freshDuas = duas.filter((dua) => dua !== currentDua && !duaHistory.includes(dua));
  const pool = freshDuas.length ? freshDuas : duas.filter((dua) => dua !== currentDua);
  currentDua = pick(pool);
  duaHistory.push(currentDua);

  if (duaHistory.length > duas.length - 1) {
    duaHistory.shift();
  }

  return currentDua;
}

function openDuaScreen() {
  if (!state.first || !state.second) return;

  const dua = chooseDua();
  state.dua = dua;
  duaNames.textContent = `${state.first} ♡ ${state.second}`;
  duaWords.textContent = dua;

  showScreen("dua", () => restartAnimation(duaWords, "is-changing"));
}

function fillResult(result, first, second) {
  nameOne.textContent = first;
  nameTwo.textContent = second;
  scoreLabel.textContent = result.label;
  messageText.textContent = result.message;
  scoreValue.textContent = "0";
  scoreValue.classList.remove("is-counting");
  scoreProgress.style.strokeDashoffset = "100";
  state.result = result;
  setRandomQuote();
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

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  restartAnimation(toast, "is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.textContent = "";
  }, 2400);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    copyWithFallback(text);
  }
}

function buildShareText() {
  if (!state.first || !state.second || !state.result) return "";

  const { score, label, message } = state.result;
  const quoteLine = currentQuote ? `\n\n"${currentQuote}"` : "";

  return `💌 ${state.first} ♡ ${state.second}\n\n${score}% — ${label}\n${message}${quoteLine}\n\nJust for fun, not a prediction.\nQalb — Two Hearts, One Dua`;
}

async function copyDua() {
  if (!state.dua) return;

  const text = `${state.first} ♡ ${state.second}\n\n${state.dua}`;

  try {
    await copyText(text);
    showToast("Copied with love! 💗");
  } catch {
    showToast("Couldn't copy it. You can select the dua instead.");
  }
}

async function copyResult() {
  const text = buildShareText();
  if (!text) return;

  try {
    await copyText(text);
    showToast("Copied with love! 💗");
  } catch {
    showToast("Couldn't copy it. Please try again.");
  }
}

async function shareResult() {
  const text = buildShareText();
  if (!text) return;

  const shareData = {
    title: "Qalb – Two Hearts, One Dua",
    text,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
    }
  }

  try {
    await copyText(text);
    showToast("Copied with love! 💗");
  } catch {
    showToast("Couldn't share it. Please try again.");
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

duaButton.addEventListener("click", openDuaScreen);
backButton.addEventListener("click", () => showScreen("result"));
copyDuaButton.addEventListener("click", copyDua);
shareButton.addEventListener("click", shareResult);
copyResultButton.addEventListener("click", copyResult);
quoteButton.addEventListener("click", setRandomQuote);
editButton.addEventListener("click", restoreWelcome);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const activeScreen = screens.find((screen) => screen.classList.contains("is-active"));
  if (!activeScreen || activeScreen.dataset.screen === "welcome") return;

  if (activeScreen.dataset.screen === "dua") {
    showScreen("result");
    return;
  }

  restoreWelcome();
});

createAmbientParticles();
