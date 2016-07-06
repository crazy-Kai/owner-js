"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	"use strict";

	var CourtDown = function CourtDown(timestamp) {
		_classCallCheck(this, CourtDown);

		this.nowTime = new Date().getTime();
		this.endTime = new Date(timestamp).getTime();
	};

	var date = new Date();

	window.setInterval(function () {
		var result = 60 - Math.floor((new Date().getTime() - date.getTime()) / 1000);
		console.log(result, Math.floor(date.getTime() / 1000));
	}, 1000);
});