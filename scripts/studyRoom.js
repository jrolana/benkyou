/* || Pomodoro Timer */
function startPomodoro(duration, display) {
    let start = Date.now();
    let diff,
        minutes,
        seconds;

    const countItDown = () => {
        diff = duration - ((Date.now() - start) / 1000) | 0;

        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            start = Date.now() + 1000;
        }
    }

    countItDown();
    let pomodoro = setInterval(countItDown, 1000);
    return pomodoro;
}

let pomodoro;

const pomodoroDisplay = document.getElementById("pomodoro-text");
const startPomodoroBtn = document.getElementById("pomodoro-start-btn");
startPomodoroBtn.onclick = () => {
    pomodoro = startPomodoro(25 * 60, pomodoroDisplay);
}

const stopPomodoroBtn = document.getElementById("pomodoro-stop-btn");
stopPomodoroBtn.onclick = () => {
    pomodoroDisplay.textContent = "25:00";
    clearInterval(pomodoro);
}

/* || Session Goals */

function getGoal(data = null) {
    let goalList = JSON.parse(localStorage.getItem("goals"));
    if (goalList) {
        if (data) {
            if (goalList.indexOf(data) != -1) {
                return goalList[data];
            } else {
                return false;
            }
        }
        return goalList;
    }
    return false;
}

function addGoal(data) {
    if (getGoal(data) != false) {
        alert("Item already added in todo");
    } else {
        let goalList = getGoal();
        goalList = (goalList != false) ? goalList : [];
        goalList.push(data);
        goalList = JSON.stringify(goalList);
        console.log(goalList);
        localStorage.setItem("goals", goalList);
    }
}

function listGoal() {
    let html = ``;
    let goalList = getGoal();
    if (goalList) {
        goalList.forEach((value, item) => {
            html += `<li>${value}<button onclick="removeData(${item})">x</button></li>`;
        })
    }
    document.getElementById("goal-list").innerHTML = html;
}
const goalForm = document.getElementById("input-form");
goalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const goalData = goalForm.elements["goal-input"].value;
    addGoal(goalData);
    listGoal();
})

function toggleWidget(selector) {
    const element = document.querySelector(selector);
    element.classList.toggle('hidden');
}

function bgDefault() {
    document.body.style.backgroundImage = "";
    document.body.style.backgroundColor = "#CB997E";
}

function bgBlack() {
    document.body.style.backgroundImage = "";
    document.body.style.backgroundColor = "black";
}

function bgOnlinePic(event) {
    event.preventDefault();
    var url = document.getElementById('bg-URL').value;
    document.body.style.backgroundImage = "url('" + url + "')";
    document.body.style.backgroundSize = "cover";
}
