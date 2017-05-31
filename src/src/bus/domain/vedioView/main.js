"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    // 依赖
    var PostMessage = require('model/postMessage/main');

    // 实例化
    var postMessageExp = new PostMessage();

    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title: "",
                m4v: "http://lassenvideo.oss-cn-hangzhou.aliyuncs.com/yuncourt.mp4",
                poster: ""
            }).jPlayer("play");
            $(this).bind($.jPlayer.event.resize, function(event) {
                var flag = $('#jp_container_1').hasClass('jp-state-full-screen');
                try{
                    if(flag){
                        window.top.screenFull && window.top.screenFull();
                    }else{
                        window.top.screenSmall && window.top.screenSmall();
                    };
                }catch(e){
                    postMessageExp.post({type: 'screenFull', value: flag});
                };
            });

        },
        swfPath: CONFIG.assetsLink + "/bus/home/jPlayer-2.9.2",
        supplied: "m4v",
        size: {
            width: "638px",
            height: "378px",
            cssClass: "jp-video-360p"
        },
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true
    });

});
