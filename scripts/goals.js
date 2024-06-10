import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import {
    getFirestore, collection, doc, deleteDoc, getDocs,
    query, where
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

import app, { addGoal, showAlert } from '../functions.js';

/* || Session Goals */

const auth = getAuth();
const db = getFirestore(app);
let userID;

onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid;
        getGoals();
    } else if (window.location.pathname != '/index.html') {
        window.location.href = 'index.html';
    }
})

const goalForm = document.getElementById("input-form");
goalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const goalText = goalForm.elements["goal-input"].value;
    addGoal(goalText).
        then(() => {
            getGoals();
        });
})

function finishGoal(goalRef) {
    deleteDoc(doc(db, "Goals", goalRef))
        .then(() => {
            showAlert("Congrats for completing a task!");
            getGoals();
        });
}

export function deleteRow(r) {
    const goal = r.parentNode.parentNode;
    const goalRef = goal.id;
    console.log("Deleted successfully");
    const i = goal.rowIndex;
    document.getElementById("goal-list").deleteRow(i);
    finishGoal(goalRef);
}

async function getGoals() {
    const queryGetResources = query(collection(db, "Goals"), where("user", "==", userID));
    const querySnapshot = await getDocs(queryGetResources);

    const goalsContainer = document.getElementById("goal-list");
    goalsContainer.innerHTML = "";
    querySnapshot.forEach((goal) => {
        const goalData = goal.data();
        console.log(goalData);

        const goalContainer = document.createElement("tr");

        const text = document.createElement("td");
        text.innerHTML = `<button onclick="deleteRow(this)">${goalData.text} </button>`;

        goalContainer.append(text);
        goalContainer.id = goal.id;
        goalsContainer.append(goalContainer);
    })
}
