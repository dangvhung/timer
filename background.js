var timerStates = {
	"off" : {"state": "off", "html": "popup.html", "nextState": "pomodoro"},
	"pomodoro" : new PomodoroState(),
	"break" : new BreakState()},
    stateKey = "off",
    currentState = timerStates[stateKey],
    timer,
    timeout;
chrome.browserAction.setPopup({
	"popup": currentState.html
});
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command === "startTimer" && stateKey === "off") {
			changeToNextState(false);
			sendResponse({message: "Timer started."});
		}
		else if (request.command === "endTimer" && stateKey !== "off") {
			if (timer) clearInterval(timer);
			if (timeout) clearTimeout(timeout);
			timeout = null;
			timer = null;
			changeState("off", false);
			chrome.runtime.sendMessage({
				command: "timerEnded"
			});
		}
	});
function startTimer() {
	var start = moment();
	timer = setInterval(function() {
	    var difference = moment().diff(start, 'seconds');
	    if (difference > currentState.length()) {
	    	stopTimer(timer);
	    	return;
	    }
	    sendUpdatedTime(difference);
	}, 1000);
}
function sendUpdatedTime(difference) {
	var time = moment().startOf("day").seconds(difference).format("m:ss");
	chrome.runtime.sendMessage({
		"command": "updateTime",
		"time": time
	});
	chrome.browserAction.setBadgeText({"text" : time});
}
function stopTimer() {
	clearInterval(timer);
	timer = null;
	notifyUser();
	changeToNextState(true);
	chrome.runtime.sendMessage({
		command: "timerEnded"
	});
}
function notifyUser() {
	var idBase = currentState.notificationBaseId;
	var id = idBase + (new Date()).getTime();
	chrome.notifications.create(id, currentState.opt, function() {
		console.log(idBase + " notification created.");
	});
}
function changeToNextState(isDelayed) {
	nextStateKey = currentState.nextState;
	changeState(nextStateKey, isDelayed);
}
function changeState(nextStateKey, isDelayed) {
	stateKey = nextStateKey;
	currentState = timerStates[stateKey];
	chrome.browserAction.setPopup({
		"popup": currentState.html
	});

	if (currentState.hasOwnProperty("length")) {
		if (isDelayed) {
			timeout	= setTimeout(startTimer, currentState.delay*1000);
		}
		else startTimer();
	}
} 