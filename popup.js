function init() {
	document.getElementById("pomodoro").innerText = localStorage["pomodoro-selection"] || 10;
	document.getElementById("break").innerText = localStorage["break-selection"] || 10;

	var buttonGroups = document.getElementsByClassName("time-buttons-group")
	Array.prototype.forEach.call(buttonGroups, function(divElem) {

		Array.prototype.forEach.call(divElem.childNodes, function(elem) {
			elem.onclick = timeButtonOnClickHandler;
		});

	});

}
function timeButtonOnClickHandler(event) {
	var targetElem = event.target;
	var timeSelected = +targetElem.innerText; 
	var settingKey = targetElem.parentNode.id;
	localStorage[settingKey] = timeSelected; 
	document.getElementById(settingKey.split("-")[0]).innerText = timeSelected;
}

document.addEventListener('DOMContentLoaded', init);