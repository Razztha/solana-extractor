var x = 0;
var startstop = 0;

export const startTimer = () => {

  startstop = startstop + 1;

  if (startstop === 1) {
    start1();
  } else if (startstop === 2) {
    startstop = 0;
    stop();
  }

}


const start1 = () => {
  x = setInterval(timer, 10);
} /* Start */

export const stopTimer = () => {
  clearInterval(x);
} /* Stop */

var milisec = 0;
var sec = 0; /* holds incrementing value */
var min = 0;
var hour = 0;

/* Contains and outputs returned value of  function checkTime */

var miliSecOut = 0;
var secOut = 0;
var minOut = 0;
var hourOut = 0;

/* Output variable End */


const timer = () => {
  /* Main Timer */


  miliSecOut = checkTime(milisec);
  secOut = checkTime(sec);
  minOut = checkTime(min);
  hourOut = checkTime(hour);

  milisec = ++milisec;

  if (milisec === 100) {
    milisec = 0;
    sec = ++sec;
  }

  if (sec == 60) {
    min = ++min;
    sec = 0;
  }

  if (min == 60) {
    min = 0;
    hour = ++hour;

  }


  document.getElementById("milisec").innerHTML = miliSecOut;
  document.getElementById("sec").innerHTML = secOut;
  document.getElementById("min").innerHTML = minOut;
  document.getElementById("hour").innerHTML = hourOut;

}


/* Adds 0 when value is <10 */


const checkTime = (i) => {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}