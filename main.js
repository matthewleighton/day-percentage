function getStartTime(){
	startTime = getTimeFromForm('startInput');
	//console.log('Start time: ' + startTime);
	return startTime;
}

function getEndTime(){
	endTime = getTimeFromForm('endInput');
	//console.log('End time ' + endTime);
	return endTime;
}

function getTimeFromForm(id){
	formElement = document.getElementById(id);
	formValue = formElement.value;

	valuesArray = formValue.split(':');
	hours = parseInt(valuesArray[0]);
	minutes = parseInt(valuesArray[1]);

	return hours*60*60 + minutes*60;
}

function getTotalTime(){
	start = getStartTime();
	end = getEndTime();

	if (end > start) {
		return end - start;
	} else {
		return 24*60*60 - start + end; // Cases where end is midnight or later.
	}
}

function getSecondsSinceMidnight() {
	var today = new Date();
	return today.getHours()*60*60 + today.getMinutes()*60 + today.getSeconds()
}

function getCurrentSeconds(){
	var today = new Date();
	var dayInSeconds = 24*60*60;
	var secondsSinceMidnight = getSecondsSinceMidnight();
	var currentSeconds = secondsSinceMidnight - start;

	if (start > secondsSinceMidnight) {
		currentSeconds += dayInSeconds;
	}

	return currentSeconds;
}

function calculatePercentage(currentSeconds, totalTime){
	percentage = (currentSeconds/totalTime)*100;

	if (percentage < 100) {
		return percentage
	} else {
		closestTo = getClosestToStartOrEnd();

		if (closestTo == 'end'){
			return 100;
		} else {
			return 0;
		}
		return 100;
	}
}

// Check if we're currently closer to the start of the day or the end.
function getClosestToStartOrEnd() {
	secondsInDay = 24*60*60;
	secondsSinceMidnight = getSecondsSinceMidnight();


	// Direct Test - First we test which of the numbers is closer on a number line.
	directStart = Math.abs(startTime - secondsSinceMidnight);
	directEnd = Math.abs(endTime - secondsSinceMidnight)

	if (directStart < directEnd) {
		directWinnerName = 'start';
		directWinnerValue = directStart;
	} else {
		directWinnerName = 'end';
		directWinnerValue = directEnd;
	}

	console.log('Direct Winner Name: ' + directWinnerName);
	console.log('Direct Winner value: ' + directWinnerValue);

	// Midnight Test - Next we next which of the number is closer by going over midnight.
	midnightStart = secondsInDay - secondsSinceMidnight + startTime;
	midnightEnd = secondsInDay - secondsSinceMidnight + endTime;

	if (midnightStart < midnightEnd) {
		midnightWinnerName = 'start';
		midnightWinnerValue = midnightStart;
	} else {
		midnightWinnerName = 'end';
		midnightWinnerValue = midnightEnd;
	}

	console.log('Midnight Winner Name: ' + midnightWinnerName);
	console.log('Midnight Winner value: ' + midnightWinnerValue);

	//console.log('Midnight Winner: ' + midnightWinner);

	if (directWinnerName == midnightWinnerName) {
		return directWinnerName;
	} else {
		if (directWinnerValue < midnightWinnerValue) {
			return directWinnerName;
		} else {
			return midnightWinnerName;
		}
	}
}

function updatePercentage(totalTime){
	currentSeconds = getCurrentSeconds();
	percentage = calculatePercentage(currentSeconds, totalTime).toPrecision(5);

	updateCSS(percentage);
}

function updateCSS(percentage){
	barElement = document.getElementById('barProgress');
	barElement.style.width = percentage + '%';

	numberElement = document.getElementById('percentageNumber');
	numberElement.innerHTML = percentage + '%';
}

function updateTimes() {
	totalTime = getTotalTime();
	updatePercentage(totalTime);	
}

function inputKeypress(event) {
	if (event.charCode == 13) {
		//getClosestToStartOrEnd();
		updateTimes();
	}
}

var totalTime = getTotalTime();

updatePercentage(totalTime);

window.setInterval(function(){
  updatePercentage(totalTime);
}, 1000);