"use strict";
define(function(require,exports,module){
	window.onload = function(){
		var fram = document.getElementById("iframe1");
		fram.contentWindow.postMessage("welcome to my home!~~","http://127.0.0.1:8004")

	}

	window.addEventListener("message",function(event){
	      $("#message").html(event.data)

	},false)
	
})