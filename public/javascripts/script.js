const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");

const birthDay = "13 Nov 2020";

function countdown(){
    const birthDayDate = new Date(birthDay);
    const currentDate  = new Date();
    var days = 0;
    var hours = 0;
    var mins = 0;
    var seconds = 0;

    var totalSeconds = (birthDayDate - currentDate)/1000;

    if (totalSeconds < 0) {
        days = Math.floor(totalSeconds/ 3600/24) < -1 ? 0 : 1;
        if (days == 1) {
          //  document.getElementById("Header").innerHTML = "Happy Birthday Chitti";
            window.location.href = "./birthDay.html";
        } else {
            document.getElementById("Header").innerHTML = "Wait for next year";
        }
    }else {
        days  = Math.floor(totalSeconds/ 3600/24);
        hours = Math.floor(totalSeconds/3600) % 24;
        mins  = Math.floor(totalSeconds / 60) % 60;
        seconds = Math.floor(totalSeconds) % 60;

        daysEl.innerHTML = formatTime(days);
        hoursEl.innerHTML = formatTime(hours);
        minsEl.innerHTML = formatTime(mins);
        secondsEl.innerHTML = formatTime(seconds);
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

countdown();
setInterval(countdown, 1000);