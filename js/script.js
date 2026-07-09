// Page State Memory

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const countdownEl = document.getElementById("countdown");

// On page load, continue game if already started

window.addEventListener("load", () => {
    const inGame = localStorage.getItem("inGame") === "true";
    if (inGame) {
        menuScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
    }
});

// Menu Controls

function startGame() {
    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    localStorage.setItem("inGame", "true");
}

// Game Variables

let level = localStorage.getItem("aiLevel") || "easy";
document.getElementById("AILevel").value = level;

function setLevel(selectedLevel) {
    level = selectedLevel;
    localStorage.setItem("aiLevel", level);
}

let userScore = parseInt(localStorage.getItem("userScore")) || 0;
let computerScore = parseInt(localStorage.getItem("computerScore")) || 0;
updateScoreboard();

// Music & Animated Equalizer

const bgMusic = document.getElementById("bgMusic");
const musicSwitch = document.getElementById("musicSwitch");
const equalizer = document.getElementById("equalizer");

if(localStorage.getItem("musicEnabled")==="true"){
    musicSwitch.checked=true; bgMusic.volume=0.5; bgMusic.play(); updateEqualizer(true);
} else updateEqualizer(false);

function toggleMusic(){
    if(musicSwitch.checked){ bgMusic.volume=0.5; bgMusic.play(); localStorage.setItem("musicEnabled","true"); updateEqualizer(true);}
    else{ bgMusic.pause(); localStorage.setItem("musicEnabled","false"); updateEqualizer(false);}
}
function updateEqualizer(state){
    equalizer.classList.remove("music-on","music-off");
    equalizer.classList.add(state?"music-on":"music-off");
}

const volumeSlider = document.getElementById("volumeSlider");

// Load saved volume
let savedVolume = parseFloat(localStorage.getItem("bgVolume"));
if (!isNaN(savedVolume)) {
    bgMusic.volume = savedVolume;
    volumeSlider.value = savedVolume;
} else {
    bgMusic.volume = 0.5;
}

// Function to update volume in real-time
function setVolume(value) {
    bgMusic.volume = value;
    localStorage.setItem("bgVolume", value);
}

// Ensure music plays only if toggle is on
if (musicSwitch.checked) bgMusic.play();


// AI Difficulty (Logic)

function getComputerChoice(userChoice){
    const choices=["rock","paper","scissors"];
    if(level==="easy") return choices[Math.floor(Math.random()*3)];
    if(level==="medium") if(Math.random()<0.5) return choices[Math.floor(Math.random()*3)];
    if(level==="hard"){
        if(userChoice==="rock") return "paper";
        if(userChoice==="paper") return "scissors";
        if(userChoice==="scissors") return "rock";
    }
    return choices[Math.floor(Math.random()*3)];
}

// Countdown

function play(userChoice){
    countdownEl.classList.remove("hidden");
    countdownEl.innerText="1";
    let count=1;

    const interval = setInterval(()=>{
        count--;
        if(count>0) countdownEl.innerText=count;
        else {
            clearInterval(interval);
            countdownEl.classList.add("hidden");

            // Play normally
            const computerChoice = getComputerChoice(userChoice);
            let result="";
            if(userChoice===computerChoice) result="It's a draw!";
            else if((userChoice==="rock" && computerChoice==="scissors") ||
                    (userChoice==="paper" && computerChoice==="rock") ||
                    (userChoice==="scissors" && computerChoice==="paper")){
                result="You win!"; userScore++;
            } else { result="You lose!"; computerScore++; }

            // Images Bounce

            document.getElementById("userImage").innerHTML=`<img src="assets/${userChoice}_user.png" alt="${userChoice}">`;
            document.getElementById("computerImage").innerHTML=`<img src="assets/${computerChoice}_cpu.png" alt="${computerChoice}">`;
            const userImg=document.getElementById("userImage").querySelector("img");
            const cpuImg=document.getElementById("computerImage").querySelector("img");
            userImg.classList.add("bounce"); cpuImg.classList.add("bounce");
            setTimeout(()=>{ userImg.classList.remove("bounce"); cpuImg.classList.remove("bounce"); },300);

            // Result Fade

            const resultText=document.getElementById("resultText");
            resultText.innerHTML=`You chose <b>${userChoice}</b>. Computer chose <b>${computerChoice}</b>.<br>${result}`;
            resultText.classList.remove("show"); void resultText.offsetWidth; resultText.classList.add("show");

            // Pop-Up Win/Lose

            if(userScore>=10 || computerScore>=10) showPopup(userScore>=10?"🎉 YOU WIN!":"💀 YOU LOSE!");

            localStorage.setItem("userScore",userScore);
            localStorage.setItem("computerScore",computerScore);

            const scoreboard=document.getElementById("scoreboard");
            updateScoreboard(); scoreboard.classList.add("update");
            setTimeout(()=>scoreboard.classList.remove("update"),300);
        }
    },1000);
}

// Scoreboard

function updateScoreboard(){
    document.getElementById("scoreboard").innerHTML=`You: ${userScore} | Computer: ${computerScore}`;
}

// Pop-Up

function showPopup(message){
    const popup=document.getElementById("popup");
    document.getElementById("popupMessage").innerText=message;
    popup.classList.remove("hidden"); void popup.offsetWidth; popup.classList.add("show");

    // Reset the scores but keep in game
    userScore=0; computerScore=0;
    localStorage.setItem("userScore",userScore);
    localStorage.setItem("computerScore",computerScore);
}

function closePopup(){
    const popup=document.getElementById("popup");
    popup.classList.remove("show");
    setTimeout(()=>popup.classList.add("hidden"),400);
    updateScoreboard();
    localStorage.setItem("inGame","true");
}
