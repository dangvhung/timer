function PomodoroState() {
	this.length = function() {
		return localStorage["pomodoro-selection"] || 10;
	}
	this.delay = 10;
	this.html = "timer.html";
	this.opt = {
		type: "basic",
		title: "Thời gian nghỉ ngơi!",
		message: "Nghỉ ngơi thôi!",
		iconUrl: "icon.png"
	};
	this.notificationBaseId = "pomodoroOver";
	this.nextState = "break";
}