"use strict";
/**
 * 组件：滚动条
 */
define(function(require, exports) {

	//依赖
	var DOC = document,
		cookiePath = window.location.href,
		cookieDomain = DOC.domain,
		cookieSecure = false;

	//设置
	exports.set = function(name, value, second){
	    var date,
	    	flag = second === undefined;
	    if(!flag){
	    	date = new Date();
	    	date.setSeconds(date.getSeconds()+second);
	    };
	    DOC.cookie = name+'='+escape(value)+((flag)?'' : '; expires='+date.toUTCString())+'; path='+cookiePath;
    }
    //设置路径
    exports.setPath = function(path){
    	cookiePath = path;
    }
    //设置域
    exports.setDomain = function(domain){
    	cookieDomain = domain;
    }
    //设置安全
    exports.setSecure = function(flag){
    	cookieSecure = !!flag;
    }

    //获取
    exports.get = function(name){
	    var cookieStr = DOC.cookie,
	    	arr = cookieStr.split('; '),
	    	temp,
	    	i = 0,
	    	j = arr.length;
	    for(; i < j; i++){
	        temp = arr[i].split('=');
	        if(temp[0] === name){
	        	return unescape(temp[1]||'');
	        }
        }
	    return '';
   	}

   	//删除
   	exports.remove =  function(name){
	    var date = new Date();
	    date.setTime(0);
	    DOC.cookie = name+'=v; expires='+date.toUTCString()+'; path='+cookiePath;
    }


});
