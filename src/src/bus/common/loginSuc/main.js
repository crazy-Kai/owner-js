"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
        domUtil = require('common/domUtil'),
        constant = require('common/constant'),
        PostMessage = require('model/postMessage/main');

    var postMessageExp = new PostMessage();

    //变量
    var loginMsg = $('#login-msg'),
        userName = $('#userName'),
        WIN = window.top;

    //函数：回写信息
    function reWriteIntro(){
        WIN.jQuery('#login-success').after('<span><a href="/suit/newMySuit.htm#personInfo" target="_blank" class="fn-color-0073bf underline">'+userName.val()+'</a></span> <a href="/loginOut.do" class="underline">退出</a>');
        WIN.jQuery('#login-success').remove();
        WIN.jQuery('.fast_register').remove();
    };
	//函数：登陆成功后的跳转
    function successLogin(){
        //在iframe内
        if(self !== top){
            try{
                reWriteIntro();
                if($("#redirectUrl").val()){
                    setTimeout(function(){
                        WIN.location.href = $("#redirectUrl").val();
                    }, 300);
                }else{
                    setTimeout(function(){
                        WIN.dialogIframe && WIN.dialogIframe.hide();
                        delete WIN.dialogIframe;
                    }, 300);
                };
            }catch(e){
                WIN.postMessage(JSON.stringify({type: 'successLogin', userName: userName.val()}), '*');
            };
        }else{
            var url = "";
            url = constant.getUrl('domainIndex');

            if($("#redirectUrl").val()){
                url = $("#redirectUrl").val();
            }else{
                var fromUrl = window.location.search;
                if(fromUrl && fromUrl.lastIndexOf('backUrl=') >0 && (fromUrl = fromUrl.substring(fromUrl.lastIndexOf('backUrl=')+8, fromUrl.length))) {
                    url= decodeURIComponent(fromUrl);
                }
            }

            setTimeout(function(){
                window.location.href = url;
            }, 300);
        }
    }
    successLogin();

});