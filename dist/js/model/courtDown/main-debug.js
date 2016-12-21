"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
}
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
    }
}();
define("model/courtDown/main-debug", [], function(require, exports, module) {
    var CourtDown = function() {
            function CourtDown(timestamp) {
                _classCallCheck(this, CourtDown), Object.assign(this, {
                    timestamp: timestamp
                })
            }
            return _createClass(CourtDown, [{
                key: "use",
                value: function() {
                    var me = this,
                        endTime = new Date(me.timestamp).getTime(),
                        nowTime = (new Date).getTime(),
                        differ = void 0;
                    return isNaN(endTime) ? window.alert(timestamp + "时间戳解析失败") : (differ = endTime - nowTime, differ <= 0 ? window.alert("倒计时已到！") : this.formateTimestamp(differ))
                }
            }, {
                key: "formateTimestamp",
                value: function(differTime) {
                    var me = this,
                        day = 864e5,
                        hour = 36e5,
                        minutes = 6e4,
                        seconds = 1e3,
                        dayStamp = Math.floor(differTime / day),
                        defferHours = differTime - dayStamp * day,
                        hourStamp = Math.floor(defferHours / hour),
                        defferMinutes = defferHours - hourStamp * hour,
                        minutesStamp = Math.floor(defferMinutes / minutes),
                        defferSeconds = defferMinutes - minutesStamp * minutes,
                        secondsStamp = Math.floor(defferSeconds / seconds);
                    return {
                        days: me.formateString(dayStamp),
                        hours: me.formateString(hourStamp),
                        minute: me.formateString(minutesStamp),
                        second: me.formateString(secondsStamp)
                    }
                }
            }, {
                key: "formateString",
                value: function(num) {
                    return ("00" + num).slice(-2)
                }
            }]), CourtDown
        }(),
        timer = new CourtDown("2016-12-16 18:07"),
        interval = window.setInterval(function() {
            var data = timer.use();
            return data ? void $("#content").html("时间还剩余:" + data.days + "天" + data.hours + "小时" + data.minute + "分钟" + data.second + "秒") : window.clearInterval(interval)
        }, 1e3)
});