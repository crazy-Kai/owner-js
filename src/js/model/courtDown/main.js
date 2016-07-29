"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
	"use strict";

	var CourtDown = function () {
		function CourtDown(timestamp) {
			_classCallCheck(this, CourtDown);

			Object.assign(this, { timestamp: timestamp });
		}

		_createClass(CourtDown, [{
			key: "use",
			value: function use() {
				var me = this,
				    endTime = new Date(me.timestamp).getTime(),
				    nowTime = new Date().getTime(),
				    differ = void 0;
				if (isNaN(endTime)) {
					return window.alert(timestamp + "时间戳解析失败");
				}
				differ = endTime - nowTime;
				if (differ <= 0) {
					return window.alert("倒计时已到！");
				}

				return this.formateTimestamp(differ);
			}
		}, {
			key: "formateTimestamp",
			value: function formateTimestamp(differTime) {

				var me = this,
				    day = 24 * 60 * 60 * 1000,
				    hour = 60 * 60 * 1000,
				    minutes = 60 * 1000,
				    seconds = 1000,
				    dayStamp = Math.floor(differTime / day),
				    hourStamp = Math.floor((differTime - dayStamp * day) / hour),
				    minutesStamp = Math.floor((differTime - hourStamp * hour) / minutes),
				    secondsStamp = Math.floor((differTime - minutesStamp * minutes) / seconds);
				return {
					"days": me.formateString(dayStamp),
					"hours": me.formateString(hourStamp),
					"minute": me.formateString(minutesStamp),
					"second": me.formateString(secondsStamp)
				};
			}
		}, {
			key: "formateString",
			value: function formateString(num) {
				return ("00" + num).slice(-2);
			}
		}]);

		return CourtDown;
	}();

	var timer = new CourtDown("2016-07-6 15:59");
	var interval = window.setInterval(function () {
		var data = timer.use();
		if (!data) {
			return window.clearInterval(interval);
		}
		$("#content").html("时间还剩余:" + data.days + "天" + data.hours + "小时" + data.minute + "分钟" + data.second + "秒");
	}, 1000);
});