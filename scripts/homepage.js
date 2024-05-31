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

function deleteEvent(eventRef) {
    deleteDoc(doc(db, "Events", eventRef))
        .then(() => {
            alert("Deleted an event succesfully!");
        });
}

export function deleteRow(r) {
    const event = r.parentNode.parentNode;
    const eventRef = event.id;
    const i = event.rowIndex;
    document.getElementById("events-list").deleteRow(i);
    deleteEvent(eventRef);
}

let eventDates = [];
async function getEvents() {
    const queryGetResources = query(collection(db, "Events"), where("user", "==", userID));
    const querySnapshot = await getDocs(queryGetResources);

    const eventsContainer = document.getElementById("events-list");
    querySnapshot.forEach((event) => {
        const eventData = event.data();
        console.log(eventData);


        eventDates.push(eventData.date);

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
    });


    getCalendar();
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
    currentMonth = document.querySelector(".month"),
    currentYear = document.querySelector(".year"),
    prevNextIcon = document.querySelectorAll(".icons span");
    

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();
    
   
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    
const getCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    
    let liTag = "";
    
    for (let i = firstDayofMonth; i > 0; i--) { 
        liTag += `<li></li>`;
    }
    
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isEventDate = eventDates.includes(`${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`) ? "event" : "";
        liTag += `<li class="${isEventDate}">${i}</li>`;
    }
    
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li></li>`
    }
    currentMonth.innerText = `${months[currMonth]}`; 
    currentYear.innerText = ` ${currYear}`;
    daysTag.innerHTML = liTag;
}
    getCalendar();
prevNextIcon.forEach(icon => { 
    icon.addEventListener("click", () => { 
            
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
    
    if (currMonth < 0 || currMonth > 11) { 
              
        date = new Date(currYear, currMonth, new Date().getDate());
        currYear = date.getFullYear(); 
        currMonth = date.getMonth(); 
    } else {
        date = new Date(); 
    }
    getCalendar(); 
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
addEventBtn.addEventListener("click", addEventWindow);

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

