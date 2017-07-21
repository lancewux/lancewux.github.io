var i = 0;
function timeCount() {
	i = i + 1;
	postMessage(i);
	setTimeout(function() {
		timeCount();
	}, 500);
}
timeCount();


