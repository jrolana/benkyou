import { addGoal } from "../functions.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import {
    getFirestore, collection, doc, deleteDoc, getDocs,
    query, where
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCPSupKoCfo_v_0iw32mHDG_Gq1ThIVB-4",
    authDomain: "benkyou-1611e.firebaseapp.com",
    projectId: "benkyou-1611e",
    storageBucket: "benkyou-1611e.appspot.com",
    messagingSenderId: "530106857438",
    appId: "1:530106857438:web:0c04226f9b65c4fb4c8f4f",
    measurementId: "G-QENZJ94CQ8"
};

const app = initializeApp(firebaseConfig);
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

/* || Session Goals */
const goalForm = document.getElementById("input-form");
goalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const goalText = goalForm.elements["goal-input"].value;
    addGoal(goalText);
})

function finishGoal(goalRef) {
    deleteDoc(doc(db, "Goals", goalRef))
        .then(() => {
            alert("Congrats for completing a task!")
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
