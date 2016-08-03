"use strict";
define(function(require,exports,module){
	window.onload= function(){
		var fram = document.getElementById("iframe1");
		fram.contentWindow.postMessage("welcome to my home!~~","http://127.0.0.1:8007")

	}

	window.addEventListener("message",function(event){
		if(event.origin === "http://127.0.0.1:8007"){

		alert("接收子窗口的数据")
	      $("#message").html(event.data)
		}

	},false)
	
})