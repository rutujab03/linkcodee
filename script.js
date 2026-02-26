const layout = document.querySelector(".layout");
const topbar = document.querySelector(".topbar");


let songs = [
  { name: "Laal Bindi", file: "songs/Akull - Laal Bindi.mp3" },
  { name: "Badtameez Dil", file: "songs/Badtameez Dil.mp3" },
  { name: "Bora Bora", file: "songs/Bora Bora.mp3" },
  { name: "Gulaabo", file: "songs/Gulaabo.mp3" },
  { name: "Ishq Wala Love", file: "songs/Ishq Wala Love.mp3" },
  { name: "Payal", file: "songs/PAYAL SONG.mp3" },
  { name: "Right Now Now", file: "songs/Right Now Now .mp3" },
  { name: "The Humma Song", file: "songs/The Humma Song.mp3" },
  { name: "Zaalima", file: "songs/Zaalima.mp3" },
  { name: "Chashni", file: "songs/Chashni Song.mp3" }
];

let audio = new Audio();
let current = 0;
let isPlaying = false;

function playSong(index) {
  current = index;
  audio.src = songs[current].file;
  audio.play();
  isPlaying = true;
  document.getElementById("nowPlaying").innerText =
    "Playing: " + songs[current].name;
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
}

function nextSong() {
  current = (current + 1) % songs.length;
  playSong(current);
}

function prevSong() {
  current = (current - 1 + songs.length) % songs.length;
  playSong(current);
}

// ================= PAGE TOGGLES =================

const premiumBtn = document.getElementById("premiumBtn");
const supportBtn = document.getElementById("supportBtn");

const premiumPage = document.getElementById("premiumPage");
const supportPage = document.getElementById("supportPage");

const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
const player = document.querySelector(".player");

premiumBtn.addEventListener("click", () => {
  sidebar.style.display = "none";
  content.style.display = "none";
  player.style.display = "none";
  supportPage.style.display = "none";
  premiumPage.style.display = "block";
  window.scrollTo(0, 0);
});

supportBtn.addEventListener("click", () => {
  sidebar.style.display = "none";
  content.style.display = "none";
  player.style.display = "none";
  premiumPage.style.display = "none";
  supportPage.style.display = "block";
  window.scrollTo(0, 0);
});

// BACK TO HOME (works for both pages)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("back-home-btn")) {
    topbar.style.display = "flex";
    layout.style.display = "flex"; 
    premiumPage.style.display = "none";
    supportPage.style.display = "none";
    downloadPage.style.display = "none";
      signupPage.style.display = "none";   // ⭐ ADD
    loginPage.style.display = "none";    // ⭐ ADD

    sidebar.style.display = "block";
    content.style.display = "block";
    player.style.display = "flex";
    window.scrollTo(0, 0);
  }
});

// ================= DOWNLOAD PAGE TOGGLE =================

const downloadBtn = document.getElementById("downloadBtn");
const downloadPage = document.getElementById("downloadPage");

downloadBtn.addEventListener("click", () => {
  sidebar.style.display = "none";
  content.style.display = "none";
  player.style.display = "none";
  premiumPage.style.display = "none";
  supportPage.style.display = "none";

  downloadPage.style.display = "block";
  window.scrollTo(0, 0);
});


// ================= AUTH PAGE TOGGLES =================

const signupBtn = document.querySelector(".top-right span:nth-last-child(2)");
const loginBtn = document.querySelector(".login");

const signupPage = document.getElementById("signupPage");
const loginPage = document.getElementById("loginPage");

signupBtn.addEventListener("click", () => {
   topbar.style.display = "none"; 
  layout.style.display = "none";
  sidebar.style.display = "none";
  content.style.display = "none";
  player.style.display = "none";
  premiumPage.style.display = "none";
  supportPage.style.display = "none";
  downloadPage.style.display = "none";

  signupPage.style.display = "flex";
  loginPage.style.display = "none";
  window.scrollTo(0, 0);
});

loginBtn.addEventListener("click", () => {
  topbar.style.display = "none";
  layout.style.display = "none";
  sidebar.style.display = "none";
  content.style.display = "none";
  player.style.display = "none";
  premiumPage.style.display = "none";
  supportPage.style.display = "none";
  downloadPage.style.display = "none";

  loginPage.style.display = "flex";
  signupPage.style.display = "none";
  window.scrollTo(0, 0);
});

// Switch between login & signup
document.getElementById("goLogin").onclick = () => {
  signupPage.style.display = "none";
  loginPage.style.display = "flex";
};

document.getElementById("goSignup").onclick = () => {
  loginPage.style.display = "none";
  signupPage.style.display = "flex";
};

// ================= AUTH INPUT HANDLING =================

// SIGN UP INPUT
const signupSubmitBtn = document.querySelector("#signupPage .auth-green-btn");
const signupInput = document.querySelector("#signupPage input");

signupSubmitBtn.addEventListener("click", () => {
  const email = signupInput.value.trim();

  if (email === "") {
    alert("Please enter your email");
    return;
  }

  console.log("Signup Email:", email);
  alert("Signup email captured successfully!");
});

// LOGIN INPUT
const loginSubmitBtn = document.querySelector("#loginPage .auth-green-btn");
const loginInput = document.querySelector("#loginPage input");

loginSubmitBtn.addEventListener("click", () => {
  const username = loginInput.value.trim();

  if (username === "") {
    alert("Please enter your email or username");
    return;
  }

  console.log("Login Username:", username);
  alert("Login input captured successfully!");
});
