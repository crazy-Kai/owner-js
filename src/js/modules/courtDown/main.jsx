define(function(require,exports,module){
	"use strict"

	class CourtDown {
		constructor(timestamp){
			this.nowTime = new Date().getTime();
			this.endTime = new Date(timestamp).getTime();
		}
	}
	let date = new Date();
	
	window.setInterval(function(){
		var result = 60-Math.floor((new Date().getTime()-date.getTime())/1000);
		console.log(result,Math.floor(date.getTime()/1000))
	},1000)
})