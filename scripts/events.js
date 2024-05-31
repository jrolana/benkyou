import { addEvent } from '../functions.js';

const eventForm = document.getElementById("eventForm");

eventForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const date = eventForm.elements["date"].value;
    const text = eventForm.elements["event"].value;

    addEvent(date, text);
})