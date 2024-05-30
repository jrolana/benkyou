import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import { getFirestore, collection, doc, setDoc, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
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

export function signIn() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const currentUser = result.user;
            console.log(currentUser);
            window.location.href = 'homepage.html';
        }
        ).catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
        })
}

export function upload(file, subjectID) {
    const newUploadID = uuidv4();
    const uploadRef = ref(storage, newUploadID)

    uploadBytes(uploadRef, file).then(async (snapshot) => {
        const link = await getDownloadURL(snapshot.ref);
        console.log(link);

        const resourceDocRef = doc(db, "Subjects", subjectID, "Resources", newUploadID);
        await setDoc(resourceDocRef, {
            title: file.name,
            link,
        })

        console.log('Uploaded a blob or file!');
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in");
        console.log(user);
        const signInBtn = document.getElementById("signin-btn");
        signInBtn.setAttribute("disabled", true);
        signInBtn.classList.add("disabled");
        signInBtn.textContent = "LOGGED IN";

    } else {
        console.log("User is not logged in");
        console.log(user);
    }
})

export async function getSubjects(subjectsContainer) {
    const queryGetSubjects = await getDocs(collection(db, "Subjects"));

    queryGetSubjects.forEach((subject) => {
        const subjectContainer = document.createElement("div");
        subjectContainer.classList.add("subject-item");
        subjectContainer.textContent = subject.id;
        subjectContainer.setAttribute("onclick", `getResources("${subject.id}")`);

        subjectsContainer.append(subjectContainer);
    })
}

export async function getResources(subjectID) {
    const queryGetResources = await getDocs(collection(db, "Subjects", subjectID, "Resources"));
    const header = document.getElementById("subject-title");
    header.textContent = subjectID;

    const resourcesContainer = document.getElementById("module-lists");
    resourcesContainer.innerHTML = "";
    queryGetResources.forEach((resource) => {
        const resourceData = resource.data();
        console.log(resourceData);

        if (resourceData.link == undefined) {
            return;
        }

        const resourceContainer = document.createElement("div");
        resourceContainer.classList.add("modules");
        resourceContainer.textContent = resourceData.title;
        resourceContainer.setAttribute("onclick", `window.location.href="${resourceData.link}"`);

        resourcesContainer.append(resourceContainer);
    })
}

export function addSubject(subjectID) {
    const subjectRef = doc(db, "Subjects", subjectID);
    const resourceRef = collection(db, "Subjects", subjectID, "Resources");

    setDoc(subjectRef, {})
        .then(() => {
            addDoc(resourceRef, {})
        }).then(() => {
            alert("Added a subject succesfully!");
        })
}
