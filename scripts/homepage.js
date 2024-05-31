import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js'
import {
    getFirestore, collection, doc, deleteDoc, getDocs,
    query, where
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

import app from '../functions.js';

// Events
const auth = getAuth();
const db = getFirestore(app);
let userID;

function deleteEvent(eventRef) {
    deleteDoc(doc(db, "Events", eventRef))
        .then(() => {
            alert("Deleted an event succesfully!");
            getEvents();
        });
}

export function deleteRow(r) {
    const event = r.parentNode.parentNode;
    const eventRef = event.id;
    const i = event.rowIndex;
    document.getElementById("events-list").deleteRow(i);
    deleteEvent(eventRef);
}

async function getEvents() {
    const queryGetResources = query(collection(db, "Events"), where("user", "==", userID));
    const querySnapshot = await getDocs(queryGetResources);

    const eventsContainer = document.getElementById("events-list");
    eventsContainer.innerHTML = "";
    querySnapshot.forEach((event) => {
        const eventData = event.data();
        console.log(eventData);

        const eventContainer = document.createElement("tr");

        const date = document.createElement("td");
        date.textContent = eventData.date;
        date.classList.add("tdate");

        const text = document.createElement("td");
        text.innerHTML = `${eventData.text} <button onclick="deleteRow(this)" class="delete-btn">X</button>`;

        text.classList.add("tevent");

        eventContainer.append(date);
        eventContainer.append(text);
        eventContainer.id = event.id;
        eventsContainer.append(eventContainer);
    })
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid;
        getEvents();
    } else if (window.location.pathname != '/index.html') {
        window.location.href = 'index.html';
    }
})

// Calendar:
const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();

    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li></li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
            && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li></li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

//Event:
function addEventWindow() {
    const width = 400;
    const height = 300;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    window.open('add-event.html', 'AddEventWindow', `width=${width},height=${height},top=${top},left=${left}`);
}

const addEventBtn = document.getElementById("add-btn");
addEventBtn.addEventListener("click", () => {
    addEventWindow();
});

//Motivational Quote:
const apiURL = "https://api.quotable.io/random";

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");

async function getQuoteOfTheDay(url) {
    const storedQuote = JSON.parse(localStorage.getItem("quoteOfTheDay"));
    const storedDate = localStorage.getItem("quoteDate");
    const currentDate = new Date().toDateString();

    if (storedQuote && storedDate === currentDate) {

        quoteElement.textContent = storedQuote.content;
        authorElement.textContent = storedQuote.author;
    } else {
        // Fetch new quote
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch quote");
            }
            const data = await response.json();
            quoteElement.textContent = data.content;
            authorElement.textContent = data.author;


            localStorage.setItem("quoteOfTheDay", JSON.stringify(data));
            localStorage.setItem("quoteDate", currentDate);
        } catch (error) {
            console.error("Error fetching quote:", error);
            quoteElement.textContent = "Failed to fetch quote. Please try again later.";
            authorElement.textContent = "";
        }
    }
}

getQuoteOfTheDay(apiURL);

