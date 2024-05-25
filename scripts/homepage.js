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
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(); // getting last day of month
 
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

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
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

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
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
    window.open('addEvent.html', 'AddEventWindow', `width=${width},height=${height},top=${top},left=${left}`);

}


//Motivational Quote:

const apiURL = "https://api.quotable.io/random";

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");


// async function getQuote(url){
//      const response = await fetch(url);
//      var data = await response.json();
//      quote.innerHTML = data.content;
//      author.innerHTML = data.author;

// }

// getQuote(apiURL);

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