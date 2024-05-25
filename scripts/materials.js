import { upload, getSubjects, addSubject } from '../functions.js';


function uploadFile() {
    const fileInput = document.getElementById("uploadedFile");
    const subject = document.getElementById("subject-title").textContent;

    if (!fileInput || fileInput.files.length < 1) {
        console.error("No selected file");
        return;
    }

    if (subject.trim() === "Subject title") {
        alert("Select a subject first");
        return;
    }

    const file = fileInput.files[0];
    upload(file, subject);

}

const subjectsContainer = document.getElementById("subjects-list");
getSubjects(subjectsContainer);

const uploadForm = document.getElementById("uploadedFile");
uploadForm.addEventListener("change", uploadFile);

const addForm = document.getElementById("add-subj-form");
addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const subjectID = addForm.elements["added-subj"].value
        .replace(/\s/g, "").toUpperCase();
    console.log(subjectID);
    addSubject(subjectID);
})


