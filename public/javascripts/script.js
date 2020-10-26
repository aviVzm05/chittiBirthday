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

//file size validaiton and prevent default submission.
$(document).ready(function(){
  $('.main-form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
     },
    fields: {
      firstname: {
        validators: {
          notEmpty: {
            Message: 'First name can\'t be empty'
          },
          stringLength: {
            min: 5,
            max: 30,
            message: 'First name should be more than 5 and less than 30 characters long'
          },
          regexp: {
            regexp: /^[a-zA-Z ]+$/,
            message: 'First Name can only consist of alphabetical values'
          }
        }
      },
      lastname: {
        validators: {
          notEmpty: {
            Message: 'Last name can\'t be empty'
          },
          stringLength: {
            min: 5,
            max: 30,
            message: 'Last name should be more than 5 and less than 30 characters long'
          },
          regexp: {
            regexp: /^[a-zA-Z ]+$/,
            message: 'Last Name can only consist of alphabetical values'
          }
        }
      },
      email: {
        validators: {
            notEmpty: {
                message: 'The email is required and cannot be empty'
            },
            emailAddress: {
                message: 'The input is not a valid email address'
            }
        }
      },
      upload: {
        validators: {
          file: {
            extension: 'mp4,mp3,avi,mov',
            type: 'video/mp4,video/avi,video/quicktime,video/x-ms-wmv',
            maxSize: 50 * 1024 *1024,
            message: 'Max. size of 50MB'
          }
        }
      }
    }
  }).on('success.form.bv',function(e){
    e.preventDefault();
    const formData = new FormData(document.getElementsByClassName('main-form')[0]);
    // const config = {
    //   onUploadProgress: function(progressEvent) {
    //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //     console.log(percentCompleted)
    //   }
    // }

    axios.post('/accept',formData)
    .then((response) => {
      swal({
        title: "Thank you",
        text: "Your\r Video message is accepted successfully.",
        icon: "success",
        button: "Cool",
      }).then((value) => {
        location.reload();
      });
    })
    .catch((error) => {
      swal({
        title: "Error",
        text: "There was some Error in processing...",
        icon: "error",
        button: "Try Again",
      }).then((then => {
        location.reload();
      }));
    })
  })
});