import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import {
    getFirestore, collection, doc, setDoc, addDoc, getDocs, getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

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
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage();
let userID;

// function showAlert(message) {
//     const alertContainer = document.getElementById("custom-alert");
//     const alertMessage = document.getElementById("alert-message");
//     const alertOkBtn = document.getElementById("alert-ok-btn");

//     alertMessage.textContent = message;
//     alertContainer.style.display = "flex";

//     alertOkBtn.onclick = function () {
//         alertContainer.style.display = "none";
//     };
// }

export function signIn() {
    signInWithPopup(auth, provider)
        .then(() => {
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
        });
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid;
    } else if (window.location.pathname != '/index.html') {
        window.location.href = 'index.html';
    }
});

export function upload(file, subjectID) {
    return new Promise((resolve) => {
        const newUploadID = uuidv4();
        const uploadRef = ref(storage, newUploadID);

        uploadBytes(uploadRef, file).then(async (snapshot) => {
            const link = await getDownloadURL(snapshot.ref);
            console.log(link);

            const resourceDocRef = doc(db, "Subjects", subjectID, "Resources", newUploadID);
            await setDoc(resourceDocRef, {
                title: file.name,
                link,
            });

            console.log('Uploaded a blob or file!');
            resolve();
        });

    })
}


export async function getSubjects(subjectsContainer) {
    const queryGetSubjects = await getDocs(collection(db, "Subjects"));

    subjectsContainer.innerHTML = "";

    queryGetSubjects.forEach((subject) => {
        const subjectContainer = document.createElement("div");
        subjectContainer.classList.add("subject-item");
        subjectContainer.textContent = subject.id;
        subjectContainer.setAttribute("onclick", `getResources("${subject.id}")`);

        subjectsContainer.append(subjectContainer);
    });

}

export async function getResources(subjectID) {
    console.log("getResources");

    const resourceRef = collection(db, "Subjects", subjectID, "Resources");
    const resourcesNum = await getCountFromServer(resourceRef);

    const header = document.getElementById("subject-title");
    header.textContent = subjectID;
    const resourcesContainer = document.getElementById("module-lists");
    resourcesContainer.innerHTML = "";

    // Disregards empty document that is initialized with creation of a subjects
    if (resourcesNum.data().count < 2) {
        resourcesContainer.innerHTML = "<p>No uploaded materials yet.</p>";
        return;
    }

    const queryGetResources = await getDocs(resourceRef);
    queryGetResources.forEach((resource) => {

        const resourceData = resource.data();
        console.log(resourceData);

        if (resourceData.link == undefined || resourceData.title == undefined) {
            return;
        }

        const resourceContainer = document.createElement("div");
        resourceContainer.classList.add("modules");
        resourceContainer.textContent = resourceData.title;
        resourceContainer.setAttribute("onclick", `window.location.href="${resourceData.link}"`);

        resourcesContainer.append(resourceContainer);
    });

}

export function addSubject(subjectID) {
    const subjectRef = doc(db, "Subjects", subjectID);
    const resourceRef = collection(db, "Subjects", subjectID, "Resources");

    setDoc(subjectRef, {})
        .then(() => {
            addDoc(resourceRef, {});
        })
        .then(() => {
            alert("Added a subject successfully!");
        });
}

export function addEvent(eventDate, eventText) {
    return new Promise((resolve) => {
        const eventsRef = collection(db, "Events");
        addDoc(eventsRef, {
            date: eventDate,
            text: eventText,
            user: userID
        }).then(() => {
            alert("Added an event successfully!");
            resolve();
        });
    })
}

export function addGoal(goalText) {
    return new Promise((resolve) => {
        const goalRef = collection(db, "Goals");
        addDoc(goalRef, {
            text: goalText,
            user: userID
        }).then(() => {
            alert("Another goal added. Good luck!");
            resolve();
        })
    })
}

export default app;
