const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("minutes");
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

// script for form validation
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();

/*
Alert message 
*/

function alertMessage(){
  var text = document.getElementById('status').innerHTML;
  if (text) {
    alert(document.getElementById('status').innerHTML);
  }
};

//make sure the function gets triggered after page load.
window.addEventListener("load", alertMessage);

//file size validaiton
window.addEventListener('load',function(){
  $('#fileForm').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    upload: {
      validators: {
        file: {
          extension: 'mp4,mp3,avi,mov',
          type: 'video/mp4,video/avi,video/quicktime,video/x-ms-wmv',
          maxSize: 25 * 1024 *1024,
          message: 'Max. size of 25Mb'
        }
      }
    }
  }
  })
});