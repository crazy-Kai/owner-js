define(function(require,exports,module){
	"use strict"

	class CourtDown {
		constructor(timestamp){
			Object.assign(this,{timestamp})
		}
		use(){
				let me = this,
				   endTime = new Date(me.timestamp).getTime(),
				   nowTime = new Date().getTime(),
				   differ ;
				 if(isNaN(endTime)){
				 	return window.alert(timestamp+"时间戳解析失败")
				 } 
				 differ = endTime - nowTime;
				 if(differ <= 0){
				 	return window.alert("倒计时已到！")
				 } 
				 return this.formateTimestamp(differ);
			}
		formateTimestamp (differTime){
					let me = this,
				    day = 24*60*60*1000,
				    hour = 60*60*1000,
				    minutes = 60*1000,
				    seconds = 1000,
				    //天数
				 	dayStamp = Math.floor(differTime/day),
				 	//小时
				 	defferHours = differTime - dayStamp*day,
				 	hourStamp = Math.floor(defferHours/hour),
				 	//分钟
				 	defferMinutes = defferHours - hourStamp*hour,
				 	minutesStamp = Math.floor(defferMinutes/minutes),
				 	//秒
				 	defferSeconds = defferMinutes - minutesStamp*minutes,
				 	secondsStamp = Math.floor(defferSeconds/seconds);
					return {
					 	"days": me.formateString(dayStamp),
					 	"hours": me.formateString(hourStamp),
					 	"minute": me.formateString(minutesStamp),
					 	"second": me.formateString(secondsStamp)
					};
			}
			formateString(num){
				return ("00"+num).slice(-2);
			}
	}
	let timer = new CourtDown("2016-12-16 18:07");
	let interval =  window.setInterval(function(){
		let data = timer.use();
		if(!data){
			return window.clearInterval(interval);
		}
	$("#content").html("时间还剩余:" + data.days + "天" +data.hours + "小时" + data.minute+ "分钟" + data.second + "秒");
 },1000)
})