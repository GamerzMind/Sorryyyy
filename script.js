/* ============ EDIT THESE ============ */
const SONG_FILE = "song.mp3";   // put this file next to index.html
const SONG_START_AT = 0;        // seconds, e.g. 35 to skip the intro
const SONG_VOLUME = 0.6;        // 0 to 1
const TAP_TEXT = "Tap to open 🌸";
/* ==================================== */

// styles for the tap screen + music button
const style = document.createElement("style");
style.textContent = `
  .tap-screen {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.85);
    color: #a7ffee; font-family: system-ui, sans-serif;
    font-size: 26px; letter-spacing: 1px; cursor: pointer;
    transition: opacity .8s;
  }
  .tap-screen span { animation: tap-pulse 1.6s ease-in-out infinite; }
  .tap-screen.gone { opacity: 0; pointer-events: none; }
  @keyframes tap-pulse { 50% { opacity: .45; transform: scale(.96); } }
  .music-btn {
    position: fixed; top: 16px; right: 16px; z-index: 999;
    width: 46px; height: 46px; border-radius: 50%;
    border: 1px solid #39c6d6; background: rgba(0, 0, 0, .5);
    color: #a7ffee; font-size: 20px; cursor: pointer;
    display: none; align-items: center; justify-content: center;
  }
  .music-btn.show { display: flex; }
  .music-btn.playing { animation: music-spin 4s linear infinite; }
  @keyframes music-spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// audio + music button
const bgm = new Audio(SONG_FILE);
bgm.loop = true;
bgm.volume = SONG_VOLUME;

const musicBtn = document.createElement("button");
musicBtn.className = "music-btn";
musicBtn.setAttribute("aria-label", "Toggle music");
musicBtn.textContent = "🎵";
musicBtn.addEventListener("click", () => {
  if (bgm.paused) { bgm.play(); musicBtn.classList.add("playing"); musicBtn.textContent = "🎵"; }
  else { bgm.pause(); musicBtn.classList.remove("playing"); musicBtn.textContent = "🔇"; }
});

// tap screen: her tap starts the flowers AND the music
const tap = document.createElement("div");
tap.className = "tap-screen";
tap.innerHTML = `<span>${TAP_TEXT}</span>`;

let started = false;
function start() {
  if (started) return;
  started = true;
  tap.classList.add("gone");
  setTimeout(() => tap.remove(), 900);

  try { bgm.currentTime = SONG_START_AT; } catch (e) {}
  bgm.play()
    .then(() => musicBtn.classList.add("show", "playing"))
    .catch(() => {}); // no song file → flowers still bloom

  setTimeout(() => document.body.classList.remove("not-loaded"), 400);
}
tap.addEventListener("click", start);
tap.addEventListener("touchstart", start, { passive: true });

onload = () => {
  document.body.appendChild(tap);
  document.body.appendChild(musicBtn);
};
