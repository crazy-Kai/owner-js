"use strict";
define(function(require,exports,module){
	$(function(){
		$("#iframe1")[0].contentWindow.postMessage("welcome to my home!~~","http://30.10.1.168:8004")

	})
})