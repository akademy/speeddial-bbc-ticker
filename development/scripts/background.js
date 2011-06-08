window.addEventListener('load', function() {
    // Simple function to prefix a zero if the value passed is less than 10
    function formatTime(time) {
        return (time < 10) ? '0' + time : time;
    }
    
    var output = document.querySelector('output');
    var date, hours, mins, secs;
    
    // Get and display the current time every 500 milliseconds
    var timer = window.setInterval(function() {
        date = new Date();
        hours = date.getHours();
        mins = date.getMinutes();
        secs = date.getSeconds();
   
        output.innerHTML = formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(secs);
    }, 50000); // Twice a second to allow for slight delays in JavaScript execution
}, false);
