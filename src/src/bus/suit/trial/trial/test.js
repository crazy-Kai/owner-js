define(function(require, exports, module) {
    var $ = require('$');
    var adapter = require('./adapter');
    var Janus = require('./janus');
    var attachMediaStream = adapter.attachMediaStream;
    var reattachMediaStream = adapter.reattachMediaStream;

    var echotest;
    var server = [
        "https://facetalk3.yuncourt.com:8089/janus" //,
        // "https://120.26.121.187:8089/janus"
    ];
    var list = $('.ch-list');

    function init () {
        var img = list.eq(0).find('img').remove();
        var wrap = $('<div class="main-video"></div>');
        wrap.append(img);
        list.eq(0).prepend(wrap);
    }

    init();

    $(document).ready(function() {

        function showTip(video) {
            var tip = $('.tip-layer');
            var html = '';

            if (!tip.length) {
                $('body').append('<div class="tip-layer"></div><div class="mask-layer"></div>');
                tip = $('.tip-layer');
            }

            html += '<div class="layer-title">你的' + (video ? '视' : '音') + '频没有准备好， 请按以下步骤操作:</div>';
            html += '<div  class="layer-content">\
                        1. 点击地址栏右边带小红叉的视频按钮 <span class="video-tip"></span>;<br />\
                        2. 选择想要使用摄像头'  + (video ? '' : '和麦克风') + '时询问我;<br>\
                        3. 点击完成;<br/>\
                        4. 然后刷新页面;\
                        ' + (video ? '<br/><br/>(刷新之后以上操作可能还需要重复一次)' : '') + '\
                    </div>';

            tip.html(html);

            tip.show();
            $('.mask-layer').show();
        }


        if(!Janus.isWebrtcSupported()) {
            console.log("No WebRTC support... ");
            return;
        }
        Janus.init({debug: true, callback: function() {
            var janus = new Janus({
                server: server,
                success: function() {
                    janus.attach({
                        plugin: "janus.plugin.echotest",
                        success: function(pluginHandle) {
                            $('#details').remove();
                            echotest = pluginHandle;
                            var body = { "audio": true, "video": true };
                            echotest.send({"message": body});
                            echotest.createOffer({
                                media: { data: true },  // Let's negotiate data channels as well
                                success: function(jsep) {
                                    echotest.send({"message": body, "jsep": jsep});
                                },
                                error: function(error) {
                                    console.log(error);
                                    showTip(true);
                                }
                            });
                        },
                        error: function(error) {
                            console.log("  -- Error attaching plugin... " + error);
                        },
                        consentDialog: function(on) {
                        },
                        onmessage: function(msg, jsep) {
                            if(jsep !== undefined && jsep !== null) {
                                echotest.handleRemoteJsep({jsep: jsep});
                            }
                            var result = msg["result"];
                            if(result !== null && result !== undefined) {
                                if(result === "done") {
                                    //over
                                }
                            }
                        },
                        onlocalstream: function(stream) {
                            $('.main-video').html('<video id="myvideo" width=764 height=572 autoplay muted="muted"/>')
                            attachMediaStream($('#myvideo').get(0), stream);
                            $("#myvideo").get(0).muted = "muted";
                        },
                        onremotestream: function(stream) {
                            
                            list.eq(1).append('<video width=382 height=286 autoplay/>');
                            attachMediaStream(list.eq(1).find('video').get(0), stream);

                            for (var i = 2; i < 5; i++) {
                                var src = 'http://lassenvideo.oss-cn-hangzhou.aliyuncs.com/yuncourt' + (i-1) + '.mp4'
                                list.eq(i).append('<video width=380 height=286 muted src=' + src + ' autoplay/>');
                            }


                            var up = list.eq(0).find('[data-target=up]');
                            
                            //if(webrtcDetectedBrowser == "chrome") {
                                // Only Chrome supports the way we interrogate getStats for the bitrate right now
                                // bitrateTimer = setInterval(function() {
                                //     var bitrate = echotest.getBitrate();
                                //     bitrate = Math.ceil(parseInt(bitrate, 10)/8);
                                //     up.text(bitrate);
                                // }, 1000);
                            //}
                        },
                        ondataopen: function(data) {
                        },
                        ondata: function(data) {
                            //$('#datarecv').val(data);
                        },
                        oncleanup: function() {
                            console.log(" ::: Got a cleanup notification :::");
                        }
                    });
                },
                error: function(error) {
                    console.log(error);
                },
                destroyed: function() {
                    window.location.reload();
                }
            });
        }});
    });
});