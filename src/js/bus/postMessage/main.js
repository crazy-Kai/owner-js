"use strict";
define(function(require, exports, module) {
    //这里不能用$(function(){})这个jquery方法：
    //因为此方法是iframe加载后就立即执行里面的代码而不是等iframe里面的所有内容都加载完成后再去执行，
    //所以用此方法会导致postMessgae()方法的数据无法传送过去！所以这里还是用JS原生的window.onload()方法这方法会等所有资源加载完后再去执行里面的代码
    window.onload = function() {
        var fram = document.getElementById("iframe1");
        fram.contentWindow.postMessage("welcome to my home!~~", "http://127.0.0.1:8007")
    }
    $("#sendMessage").on("click",function(){
    	var fram = document.getElementById("iframe1");
        fram.contentWindow.postMessage("吴凯哥哥来了", "http://127.0.0.1:8007")
    });
    $("#openNewDemo").on("click",function(){
    	var newDemo = window.open("http://127.0.0.1:8009/src/html/iframe2.html","newDemo");
    	window.setTimeout(function(){
    		
    		newDemo.postMessage("我是新打开的页面数据","http://127.0.0.1:8009")
    	},2000)
    })
    window.addEventListener("message", function(event) {
        if (event.origin === "http://127.0.0.1:8007") {

            alert("接收子窗口的数据")
            $("#message").html(event.data)
        }

    }, false)

})
