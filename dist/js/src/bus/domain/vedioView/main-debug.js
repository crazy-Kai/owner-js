"use strict";
define("src/bus/domain/vedioView/main-debug", ["model/postMessage/main-debug"], function(require, exports, module) {
    var PostMessage = require("model/postMessage/main-debug"),
        postMessageExp = new PostMessage;
    $("#jquery_jplayer_1").jPlayer({
        ready: function() {
            $(this).jPlayer("setMedia", {
                title: "",
                m4v: "http://lassenvideo.oss-cn-hangzhou.aliyuncs.com/yuncourt.mp4",
                poster: ""
            }).jPlayer("play"), $(this).bind($.jPlayer.event.resize, function(event) {
                var flag = $("#jp_container_1").hasClass("jp-state-full-screen");
                try {
                    flag ? window.top.screenFull && window.top.screenFull() : window.top.screenSmall && window.top.screenSmall()
                } catch (e) {
                    postMessageExp.post({
                        type: "screenFull",
                        value: flag
                    })
                }
            })
        },
        swfPath: CONFIG.assetsLink + "/bus/home/jPlayer-2.9.2",
        supplied: "m4v",
        size: {
            width: "638px",
            height: "378px",
            cssClass: "jp-video-360p"
        },
        useStateClassSkin: !0,
        autoBlur: !1,
        smoothPlayBar: !0,
        keyEnabled: !0,
        remainingDuration: !0,
        toggleDuration: !0
    })
});