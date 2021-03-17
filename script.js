const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const datePicker = document.getElementById('date-picker');

const countdownElement = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById('countdown-btn');
const timeElements = document.querySelectorAll('p');

const completeElement = document.getElementById('complete');
const completeElTitle = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-btn');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//set date to today's date and update 'min' attribute in HTML dymnamically
const today = new Date().toISOString().split('T')[0];
datePicker.setAttribute('min', today);

//update the DOM with entered values
function updateDOM() {
    countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    //hide input
    inputContainer.hidden = true;

    //if countdown has ended, show complete
    if (distance < 0) {
        countdownElement.hidden = true;
        clearInterval(countdownActive);
        completeElTitle.textContent = `${countdownTitle} finished on ${countdownDate}`;
        completeElement.hidden = false;
    } else {
        //else show the countdown in progress
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        completeElement.hidden = true;
        countdownElement.hidden = false;
        }
    }, second);
}

//take values from input
function updateCountdown(event) {
    event.preventDefault();
    countdownTitle = event.srcElement[0].value;
    countdownDate = event.srcElement[1].value;
    savedCountdown = {
        title:countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    //check for valid date
    if (countdownDate === '') {
        alert('Please enter a date for the countdown.');
    } else {
        //get number version of current Date and update DOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

//reset all values
function reset() {
    //hide countdown/complete and show input
    countdownElement.hidden = true;
    completeElement.hidden = true;
    inputContainer.hidden = false;
    //stop the countdown
    clearInterval(countdownActive);
    //reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    //get countdown from local storage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

//event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//onload, check local storage
restorePreviousCountdown();