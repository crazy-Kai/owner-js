"use strict";
define(function(require,exports,module){
	window.onload=function(){
		var iframe = document.getElementById("iframe1");

		iframe.contentWindow.postMessage('cao ni ma a','http://192.168.1.100:8006')
			

	}
		

	

	window.addEventListener('message', function(event){
			 //$('#message').html( $('#message').html()+ '<br>' +event.data)
        	//console.log('in frame',event.data, event.origin);
	        // 通过origin属性判断消息来源地址
	        console.log(1111)
	       window.alert(1111)
	            $('#message').html( $('#message').html()+ '<br>' +event.data)
	        
    	}, false);
})