define("src/bus/suit/trial/trial/test-debug", ["common/jquery-debug", "src/bus/suit/trial/trial/adapter-debug"], function(require, exports, module) {
    function init() {
        var img = list.eq(0).find("img").remove(),
            wrap = $('<div class="main-video"></div>');
        wrap.append(img), list.eq(0).prepend(wrap)
    }
    var echotest, $ = require("common/jquery-debug"),
        adapter = require("src/bus/suit/trial/trial/adapter-debug"),
        attachMediaStream = adapter.attachMediaStream,
        server = (adapter.reattachMediaStream, [$("#serverIp").val()]),
        list = $(".ch-list");
    init(), $(document).ready(function() {
        function showTip(video) {
            var tip = $(".tip-layer"),
                html = "";
            tip.length || ($("body").append('<div class="tip-layer"></div><div class="mask-layer"></div>'), tip = $(".tip-layer")), html += '<div class="layer-title">你的' + (video ? "视" : "音") + "频没有准备好， 请按以下步骤操作:</div>", html += '<div  class="layer-content">                        1. 点击地址栏右边带小红叉的视频按钮 <span class="video-tip"></span>;<br />                        2. 选择想要使用摄像头' + (video ? "" : "和麦克风") + "时询问我;<br>                        3. 点击完成;<br/>                        4. 然后刷新页面;                        " + (video ? "<br/><br/>(刷新之后以上操作可能还需要重复一次)" : "") + "                    </div>", tip.html(html), tip.show(), $(".mask-layer").show()
        }
        if (Janus.isWebrtcSupported()) {
            Janus.init({
                debug: !1
            });
            var janus = new Janus({
                server: server,
                token: $("#token").val(),
                success: function() {
                    janus.attach({
                        plugin: "janus.plugin.videoroom",
                        success: function(pluginHandle) {
                            $("#details").remove(), echotest = pluginHandle;
                            var body = {
                                audio: !0,
                                video: !0
                            };
                            echotest.send({
                                message: body
                            }), echotest.createOffer({
                                media: {
                                    data: !0
                                },
                                success: function(jsep) {
                                    echotest.send({
                                        message: body,
                                        jsep: jsep
                                    })
                                },
                                error: function(error) {
                                    showTip(!0)
                                }
                            })
                        },
                        error: function(error) {},
                        consentDialog: function(on) {},
                        onmessage: function(msg, jsep) {
                            void 0 !== jsep && null !== jsep && echotest.handleRemoteJsep({
                                jsep: jsep
                            });
                            msg.result
                        },
                        onIceError: function() {},
                        onlocalstream: function(stream) {
                            $(".main-video").html('<video id="myvideo" width=764 height=572 autoplay muted="muted"/>'), attachMediaStream($("#myvideo").get(0), stream), $("#myvideo").get(0).muted = "muted", list.eq(1).append("<video width=382 height=286 autoplay/>"), attachMediaStream(list.eq(1).find("video").get(0), stream);
                            for (var i = 2; i < 5; i++) {
                                var src = "http://lassenvideo.oss-cn-hangzhou.aliyuncs.com/yuncourt" + (i - 1) + ".mp4";
                                list.eq(i).append("<video width=380 height=286 muted src=" + src + " autoplay/>")
                            }
                            list.eq(0).find("[data-target=up]")
                        },
                        onremotestream: function(stream) {},
                        ondataopen: function(data) {},
                        ondata: function(data) {},
                        oncleanup: function() {}
                    })
                },
                error: function(error) {},
                destroyed: function() {
                    window.location.reload()
                }
            })
        }
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("src/bus/suit/trial/trial/adapter-debug", [], function(require, exports, module) {
    function maybeFixConfiguration(pcConfig) {
        if (pcConfig)
            for (var i = 0; i < pcConfig.iceServers.length; i++) pcConfig.iceServers[i].hasOwnProperty("urls") && (pcConfig.iceServers[i].url = pcConfig.iceServers[i].urls, delete pcConfig.iceServers[i].urls)
    }
    var RTCPeerConnection = null,
        getUserMedia = null,
        attachMediaStream = null,
        reattachMediaStream = null,
        webrtcDetectedBrowser = null,
        webrtcDetectedVersion = null;
    if (navigator.mozGetUserMedia) webrtcDetectedBrowser = "firefox", webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10), RTCPeerConnection = function(pcConfig, pcConstraints) {
        return maybeFixConfiguration(pcConfig), new mozRTCPeerConnection(pcConfig, pcConstraints)
    }, window.RTCSessionDescription = mozRTCSessionDescription, window.RTCIceCandidate = mozRTCIceCandidate, getUserMedia = navigator.mozGetUserMedia.bind(navigator), navigator.getUserMedia = getUserMedia, MediaStreamTrack.getSources = function(successCb) {
        setTimeout(function() {
            var infos = [{
                kind: "audio",
                id: "default",
                label: "",
                facing: ""
            }, {
                kind: "video",
                id: "default",
                label: "",
                facing: ""
            }];
            successCb(infos)
        }, 0)
    }, window.createIceServer = function(url, username, password) {
        var iceServer = null,
            urlParts = url.split(":");
        if (0 === urlParts[0].indexOf("stun")) iceServer = {
            url: url
        };
        else if (0 === urlParts[0].indexOf("turn"))
            if (webrtcDetectedVersion < 27) {
                var turnUrlParts = url.split("?");
                1 !== turnUrlParts.length && 0 !== turnUrlParts[1].indexOf("transport=udp") || (iceServer = {
                    url: turnUrlParts[0],
                    credential: password,
                    username: username
                })
            } else iceServer = {
                url: url,
                credential: password,
                username: username
            };
        return iceServer
    }, window.createIceServers = function(urls, username, password) {
        for (var iceServers = [], i = 0; i < urls.length; i++) {
            var iceServer = window.createIceServer(urls[i], username, password);
            null !== iceServer && iceServers.push(iceServer)
        }
        return iceServers
    }, attachMediaStream = function(element, stream) {
        element.mozSrcObject = stream
    }, reattachMediaStream = function(to, from) {
        to.mozSrcObject = from.mozSrcObject
    };
    else if (navigator.webkitGetUserMedia) {
        webrtcDetectedBrowser = "chrome";
        var result = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        webrtcDetectedVersion = null !== result ? parseInt(result[2], 10) : 999, window.createIceServer = function(url, username, password) {
            var iceServer = null,
                urlParts = url.split(":");
            return 0 === urlParts[0].indexOf("stun") ? iceServer = {
                url: url
            } : 0 === urlParts[0].indexOf("turn") && (iceServer = {
                url: url,
                credential: password,
                username: username
            }), iceServer
        }, window.createIceServers = function(urls, username, password) {
            return {
                urls: urls,
                credential: password,
                username: username
            }
        }, RTCPeerConnection = function(pcConfig, pcConstraints) {
            return new webkitRTCPeerConnection(pcConfig, pcConstraints)
        }, getUserMedia = navigator.webkitGetUserMedia.bind(navigator), navigator.getUserMedia = getUserMedia, attachMediaStream = function(element, stream) {
            "undefined" != typeof element.srcObject ? element.srcObject = stream : "undefined" != typeof element.mozSrcObject ? element.mozSrcObject = stream : "undefined" != typeof element.src && (element.src = URL.createObjectURL(stream))
        }, reattachMediaStream = function(to, from) {
            to.src = from.src
        }
    }
    return {
        RTCPeerConnection: RTCPeerConnection,
        getUserMedia: getUserMedia,
        attachMediaStream: attachMediaStream,
        reattachMediaStream: reattachMediaStream,
        webrtcDetectedBrowser: webrtcDetectedBrowser,
        webrtcDetectedVersion: webrtcDetectedVersion
    }
});