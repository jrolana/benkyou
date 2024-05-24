import { upload, getSubjects } from '../functions.js';


function uploadFile() {
    const fileInput = document.getElementById("uploadedFile");

    if (!fileInput || fileInput.files.length < 1) {
        console.error("No selected file");
        return;
    }

    const file = fileInput.files[0];
    upload(file);
}

const uploadForm = document.getElementById("uploadedFile");
uploadForm.addEventListener("change", uploadFile);

const subjectsContainer = document.getElementById("subjects-list");
getSubjects(subjectsContainer);


