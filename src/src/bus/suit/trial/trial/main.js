
define(function(require, exports, module) {

    // 依赖
    var $ = require('$');
    var modal = require('model/modal/main');
    var adapter = require('./adapter'); //adapter.js 是一个JavaScript 的WebRTC适配， 由Google贡献，它可以解决浏览器差异化的规范的变化
    var Janus = require('./janus'); //General purpose WebRTC Gateway
    var attachMediaStream = adapter.attachMediaStream; //为视频绑定数据流
    var reattachMediaStream = adapter.reattachMediaStream;//重新绑定数据流
    var limit = require('common/limit');

    var Ajax = require('model/ajax/main');

    // 庭审业务依赖
    var trialLog = require('./trialLog'), //日志
        TrialLayout = require('./trialLayout'),
        trialConstant = require('./trialConstant'), //常量
        trialTool = require('./trialTool'); //公用业务方法

    var trialLayoutExp;

    var consl = window.console;
    var log = consl.log.bind(consl);
    var server = [
        "https://120.26.221.180:8089/janus" //,
        // "https://120.26.121.187:8089/janus"
    ];
    var time;
    var janus;
    var mcutest;
    var viewonly;
    var serviceIp;
    var appName;
    var credential;
    window.myStream = '';
    var muteData;
    var width, height;
    var userInfo = {};
    var userList = {};
    var lawCase = {};
    var idMap = {};
    var leaveUser = {};
    var roleNameMap = trialConstant.roleNameMap;
    var initTime = false;
    var canSendData = false;
    var result;

    window.userList = userList;
    window.userInfo = userInfo;
    var bitArr = [262144, 204800, 163840, 122880];
    var curBit = 0;
    var isInit = false;
    var bigWinUserId;

    var token = trialTool.getUrlParam('tk') || ''; //获取参数token
    var img = $('.big-win').attr('def-img') || trialConstant.assetsLink + '/assets/img/default.jpg';
    var quitImg = $('.big-win').attr('quit-img') || trialConstant.assetsLink + '/assets/img/quit.jpg';
    
    var computeLayout = trialTool.getComputeLayout();
    var bigVideoWidth = computeLayout.bigVideoWidth;
    var bigVideoHeight =  computeLayout.bigVideoHeight;
    var videoWidth = computeLayout.smallVideoWitch;
    var videoHeight = computeLayout.smallVideoHeight;

    // 显示提示
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
    };


    window.test = function (opt) {
        opt = opt || {};

        var msg = {event: 'test'};
        msg.clear = !!opt.clear;
        msg.load = !!opt.load;
        msg.random = !!opt.random;
        msg.list = opt.list;
        if (opt.list == 'all') {
            clearData(msg);
        }
        msg.code = opt.code;
        sendData(msg);
    }

    // 清楚本地缓存数据
    function clearData (data) {
        if (data.clear) {
            delete localStorage['openTime' + lawCase.id];
            delete localStorage['muteData' + lawCase.id];
            delete localStorage['recordData' + lawCase.id];
            delete localStorage['isOpenCourt' + lawCase.id];
            delete localStorage['isSubmit' + lawCase.id];
            delete localStorage['isPaused' + lawCase.id];
            delete localStorage['isConfirmed' + lawCase.id];
            delete localStorage['confirmList' + lawCase.id];
        }
        if (data.load) {
            if (data.list) {
                if (data.random && (data.list == 'all' || data.list.indexOf(userInfo.role + userInfo.order) != -1)) {
                    setTimeout( function () {
                        window.location.reload(true);
                    }, Math.floor(Math.random() * 8000) + 1000);
                }
                if (data.list == 'all' || data.list.indexOf(userInfo.role + userInfo.order) != -1) {
                    window.location.reload(true);
                }
            }
        }

        if (data.code) {
            if ((data.list == 'all' || data.list.indexOf(userInfo.role + userInfo.order) != -1)) {
                eval(data.code);
            }
        }
    }

    // 发送信息目标??
    function sendData(msg, success, error) {
        var length = limit.contains(['finalConfirm', 'confirmRecord'], msg.event) ? 5 : 1;
        limit.from({length: length}, function(){
            msg.myUserId = userInfo.userId;
            mcutest.data({
                text: JSON.stringify(msg),
                success: function () {
                    trialLog.sendMsgSuccess(msg);
                    if (msg.event == 'setRecord') {
                    } else {
                        // log( userInfo.role + ' send data: ' + JSON.stringify(msg) + ' data success ');
                    }

                    if (offline) {
                        error && error();
                    } else {
                        success && success();
                    }
                },
                error: function () {
                    log(userInfo.role +  'send ' + msg.event + ' data fail!!!!!');
                    error && error();
                }
            });
        });
    };

    window.sendData = sendData;

    // 基础方法通过ID获取角色
    function getUserRoleByUserId(key){
        var user = userList[key];
        return user && user.role || null;
    };

    // 基础方法通过角色获取ID
    function getUserIdByUserRole(key){
        var result = null;
        limit.breakEach(userList, function(val){
            if(val.role === key){
                return result = val.userId, false;
            };
        });
        return result;
    };

    // 触发大屏
    function attachBigWin (stream, userId) {
        console.log(userList[userId].userName);
        bigWinUserId = userId;
        $('.big-win').html('<video  style="width:100%;" muted autoplay /><div class="mask"></div><div class="user-info">'+ trialTool.getRoleNameByRole(userList[userId]) + '：' + userList[userId].userName+'</div>').attr('user-id', userId);
        attachMediaStream($('.big-win').find('video')[0], stream);
    }

    function reattachBigWin (video, userId) {
        var v = $('.big-win').find('video');
        bigWinUserId = userId;
        reattachMediaStream(v[0], video);
        $('.big-win').find('video')[0].muted = true;
        $('.big-win').attr('user-id', userId);
        $('.big-win').find('.user-info').html(trialTool.getRoleNameByRole(userList[userId]) + '：' + userList[userId].userName);
    }

    // 初始化之后的会掉：创建句柄，可以推送消息
    function localSuccess (pluginHandle) {// 创建房间并加入
        var create, register;
        mcutest = pluginHandle;
        userInfo.handle = pluginHandle;
        window.mcutest = pluginHandle;

        create = { "request": "create", "description" : lawCase.caseTitle, "room": lawCase.id ,  token: token} 
        
        var res = mcutest.send({
            "message": create,
            success: function (res) {
                trialLog.initRoom(res);
                if (res['videoroom'] == 'created' || res['videoroom'] == 'event' && res['error_code'] == 427) {
                    register = { "request": "join", "room": lawCase.id, "ptype": "publisher", "display": userInfo.userId + '', token: token};
                    mcutest.send({"message": register});
                }
            },
            error: function (e) {
                log(e);
            }
        });
    }

    function getUserInfo (list) {
        var f, 
            ids = [],
            vids = [];

        for (f in list) {
            ids.push({
                vid: list[f]["id"],
                userId: list[f]["display"]
            });
        }
        //遍历已经加入的用户。处理每个用户的视频
        ids.forEach( function (item, i) {
            if (!userList[item.userId]) {
                log('error', userList, item);
                return;
            }
            var w = width, h = height;
            if (item.role == 'ju' || item.role == 're') {
                w = videoWidth;
                h = videoHeight;
            }
            if (userList[item.userId].vid ) {//用户重新进入
                $('.v-' + item.role + item.order).find('video').remove();
                $('.v-' + item.role + item.order).html('<img style="width: ' + w + 'px; height: ' + h + 'px;" src="' + img + '"/>')
                if ($('.big-win').attr('user-id') == item.userId) {
                    $('.big-win').find('video').remove();
                    $('.big-win').attr('user-id', '')
                    .html('<img style="width: ' + bigVideoWidth + 'px; height: ' + bigVideoHeight + 'px;" src="' + img + '"/>');
                }
                userList[item.userId].handle && userList[item.userId].handle.detach();
                leaveUser[userList[item.userId].vid] = true;
            }
            userList[item.userId].vid = item.vid;
            idMap[item.vid] = item.userId;
            newRemoteFeed(item.vid, item.userId);//获取，监听其他用户的远程视频流
        });
    }

    //推送自己的视频流
    function publishOwnFeed(useAudio) {
        mcutest.createOffer({
            media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true, data: true}, // Publishers are sendonly
            success: function(jsep) {
                var publish = { "request": "configure", "audio": useAudio, "video": true,  data: true, token: token};
                if (userInfo.role == 're') {
                    publish.bitrate = 524288;
                }
                mcutest.send({"message": publish, "jsep": jsep});
            },
            error: function(error) {
                log("WebRTC error:", error);
                if (useAudio) {
                    publishOwnFeed(false);
                } else {
                    showTip(true);
                    log("WebRTC error... " + JSON.stringify(error));
                }
            }
        });
    }

    //获取，监听其他用户的远程视频流
    function newRemoteFeed(id, userId) {
        janus.attach({
            plugin: "janus.plugin.videoroom",
            success: function(pluginHandle) {
                userList[userId].handle = pluginHandle;
                var listen = { "request": "join", "room": lawCase.id, "ptype": "listener", "feed": id, token: token };
                pluginHandle.send({"message": listen});

            },
            error: function(error) {
                log("  -- Error attaching plugin... " + error);
            },
            ondata: function (data) {

                // data.event != 'setRecord' && log(userInfo.role + ' receive data from ' + userList[userId].role + ': ' + data);
                var i, pp, user, t, msg, w, h;
                data = JSON.parse(data);

                // 获取消息
                trialLog.receiveMsgSuccess(data);

                if (data.event == 'initInfo') {//把自己的静音信息和开庭时长同步给新加入用户
                    if (userInfo.role == 'ju') {
                        setInitInfoByRoleJu();
                    }
                } else if (data.event == 'setInitInfo') {
                    isInit = true;
                    getInitInfoByRoleJu(data);
                } 
                // 发言的允许或者禁止
                else if (data.event == 'setMute') {
                        
                    userList[data.userId].stream.getAudioTracks()[0].enabled = !data.mute;
                    muteData = localStorage['muteData' + lawCase.id];
                    muteData = muteData ? JSON.parse(muteData) : {};
                    muteData[data.userId] = data.mute;
                    localStorage['muteData' + lawCase.id] = JSON.stringify(muteData);
                    
                    //if (userInfo.role != 're') {
                        pp = $('.mute-btn[user-id='  + data.userId  + ']').closest('li,.recorder,.judge');
                        if (data.mute) {
                            pp.addClass('muted');
                            pp.find('.mute-btn').text('允许发言');
                        } else {
                            pp.removeClass('muted');
                            pp.find('.mute-btn').text('禁止发言');
                        }
                    //}
                } else if (data.event == "setRecord") {
                    getRecordByRpc(true);
                } else if (data.event == 'openCourt') {
                    // 设置开庭时间
                    trialLayoutExp.startTimer( new Date().getTime() );
                    
                    if (userInfo.role != 'ju' && userInfo.role != 're' && userInfo.role != 'ad') {
                        $('#start').text('退 出').css('display', 'inline');
                    }
                    localStorage['isOpenCourt' + lawCase.id] = true;
                } else if (data.event == 'quitCourt') {
                    post('/account/lassenSSORpc/trialEnd.json?tk=' + token, function () {
                        clearData({clear: true});
                        window.close();
                    });
                } else if (data.event == 'submitRecord') {//书记员提交了笔录
                    if ( trialTool.isLitigantByRole(userInfo.role) ) {
                       reCheckedRecord();
                    }
                    localStorage['isSubmit' + lawCase.id] = true;
                    trialTool.setLocalStorageByName('confirmList', {});
                    if (userInfo.role == 'ju') {
                        renderList();
                    };
                } else if (data.event == 'leaveCourt') {
                    user = userList[data.userId];
                    if (user) {
                        user.handle && user.handle.detach();
                        leaveUser[user.vid] = true;
                        w = width;
                        h = height;
                        if (user.role == 'ju' || user.role == 're') {
                            w = videoWidth;
                            h = videoHeight;
                        }

                        $('.v-' + user.role + user.order).html('<img style="width: ' + w + 'px; height: ' + h + 'px;" src="' + quitImg + '"/>')
                        .parent().find('.user-info').find('i, .mute-btn, .stop-btn').remove();
                        if ($('.big-win').attr('user-id') == data.userId) {
                            $('.big-win').attr('user-id', '')
                            .html('<img style="width: ' + bigVideoWidth + 'px; height: ' + bigVideoHeight + 'px;" src="' + quitImg + '"/>');
                        }
                    }
                } else if (data.event == 'confirmRecord') {//原被告确认了笔录
                    if (userInfo.role == 'ju' || userInfo.role == 're') {
                        renderList(data.userId);
                    }
                } else if (data.event == 'test') {
                    clearData(data);
                } else if( data.event === 'finalConfirm' ){
                    trialTool.setLocalStorageByName('isFinalConfirm', true);
                    $('#confirmRecordCheck').hide();
                };
            },
            ondataopen: function () {},
            onmessage: function(msg, jsep) {
                log(userInfo.role + ' receive remote msg: ' + JSON.stringify(msg));
                var event = msg["videoroom"];
                if (event == 'slow_link') {//download

                }
                jsep && userList[userId].handle.createAnswer({
                    jsep: jsep,
                    media: { audioSend: false, videoSend: false, data: true, token: token}, // We want recvonly audio/video
                    success: function(jsep) {
                        userList[userId].handle.send({"message": { "request": "start", "room": lawCase.id, token: token}, "jsep": jsep});
                    },
                    error: function(error) {
                        log(error);
                    }
                });
            },
            onlocalstream: function(stream) {
                // The subscriber stream is recvonly, we don't expect anything here
            },
            onremotestream: function(stream) {//获取远程视频流，绑定视频流到视频
                // 获取远程视频
                trialLog.getOtherStreamSuccess(userId)

                var pp, info;
                var user = userList[userId];

                if (user.role == 'sp' || user.role == 'ad') {
                    return;
                }
                var wrap = $('.v-' + user.role + user.order);

                // 如果是代理人就显示
                trialTool.showVideoWrapByRoleAndNode(user.role, wrap);

                // 如果是原被告视频下方操作按钮
                if ( limit.contains(['ac', 'al', 'de', 'dl'], user.role) ) {
                    info = wrap.parent().find('.user-info');
                    if (!info.find('i').length) {
                        info.prepend('<i></i>');
                        if ( limit.contains(['ac', 'al', 'de', 'dl'], userInfo.role)) {
                            info.append('<span class="stop-btn" sid="' + user.userId + '">暂停视频</span>')
                        }
                        if (userInfo.role == 'ju' || userInfo.role == 'ad') {
                            info.append('<span class="mute-btn" user-id="' + user.userId + '">禁止发言</span>')
                        } else {
                            info.append('<span style="display: none;" class="mute-btn" user-id="' + user.userId + '">禁止发言</span>')
                        }
                    } else {
                        if (info.find('.stoped').length) {
                            info.find('.stoped').removeClass('stoped').text('暂停视频');
                        }
                    }
                };
                // 如果是书记员把禁言按钮打开
                if(user.role === 're' && userInfo.role === 'ju'){
                    wrap.parent().find('.mute-btn').show();
                };
                //创建视频控件
                wrap.html('<video  style="width: 100%;"  autoplay>')
                .parent().find('.mute-btn').attr('user-id', user.userId);
                wrap.attr('uid', user.userId)
                .parent().find('.stop-btn').attr('sid', user.userId)
                .css('display', 'inline');

                wrap.parent().removeClass('init');
                //绑定视频流到视频窗口
                attachMediaStream(wrap.find('video').get(0), stream);

                if (bigWinUserId) {
                    if (user.userId == bigWinUserId) {
                        attachBigWin(stream, user.userId);
                    }
                } else {
                    if (user.role == 'ju') {
                        attachBigWin(stream, user.userId);
                    }
                }

                userList[userId].stream = stream;

                setMute(user.userId, stream, wrap.parent());

            },
            oncleanup: function() {
                log(" ::: oncleanup :::");
            }
        });
    }

    // 初始化之后的：处理消息，事件
    function localMsg (msg, jsep) {
        trialLog.getServeMsg(msg);
        var leaving, userId, wrap, w, h,
            event = msg["videoroom"];
        // 加入视屏
        if (event === "joined") {
            // 推送本地视屏
            !viewonly && publishOwnFeed(true);
            // 获取其他用户信息
            msg["publishers"] && getUserInfo(msg["publishers"]);
        } else if (event == "slow_link") {
            var publish = { "request": "configure", "audio": true, "video": true,  data: true, token: token};
            curBit++;
            curBit % 2 == 0 && curBit / 2 <= 3 && setTimeout( function () {
                if (userInfo.role == 'ju' || userInfo.role == 'ac' || userInfo.role == 'de') {
                    publish.bitrate = bitArr[curBit/2];
                    mcutest.send({"message": publish, "jsep": jsep});
                }
            }, 1000);
        } else if(event === "destroyed") {
            clearData({clear: true});
            window.close();
        } else if (event === "event") { 
            if (msg["publishers"]) {
                getUserInfo(msg["publishers"]);
            } else if(msg["leaving"]) { //处理离开的用户
                leaving = msg["leaving"];
                userId = idMap[leaving];

                if (userList[userId]) {
                    !leaveUser[leaving] && userList[userId].handle.detach();
                } else {
                    log('maybe error');
                }

                trialLog.LeavingPerson(leaving);
                
                // 离开用户
                if (userId && !leaveUser[leaving]) {
                    wrap = $('[uid=' + userId + ']');
                    wrap.find('video').remove();
                    w = width;
                    h = height;
                    if (userList[userId].role == 'ju' || userList[userId].role == 're') {
                        w = videoWidth;
                        h = videoHeight;
                    }
                    // 恢复初始状态
                    wrap.html('<img style="width: ' + w + 'px; height: ' + h + 'px;" src="' + img + '"/>').parent().addClass('init');

                    if ($('.big-win').attr('user-id') == userId) {
                        $('.big-win').find('video').remove();
                        $('.big-win').attr('user-id', '')
                        .html('<img style="width: ' + bigVideoWidth + 'px; height: '  + bigVideoHeight + 'px;" src="' + img + '"/>');
                    }
                    // 隐藏对应节点
                    trialTool.hideVideoWrapByRoleAndNode(userList[userId].role, wrap);
                }
            } else if (msg["unpublished"]) {
                userId = idMap[msg.unpublished];
                if (userList[userId]) {
                    !leaveUser[leaving] && userList[userId].handle.detach();
                } else {
                    log('maybe error');
                };

                trialLog.unpublishedPerson(msg.unpublished);
            } else if(msg["error"]) {
                log(msg["error"]);
            }
        }
        jsep && mcutest.handleRemoteJsep({jsep: jsep});
    }

    // 控制是否禁言
    function setMute (uid, stream, pp) {
        muteData = localStorage['muteData' + lawCase.id];
        muteData = muteData ? JSON.parse(muteData) : {};
        if (muteData[uid]) {
            pp.addClass('muted');
            pp.find('.mute-btn').text('允许发言');
            stream && stream.getAudioTracks()[0] && (stream.getAudioTracks()[0].enabled = false);
        } else {
            pp.removeClass('muted');
            pp.find('.mute-btn').text('禁止发言');
            stream && stream.getAudioTracks()[0] && (stream.getAudioTracks()[0].enabled = true);
        }  
    }

    // 解除用户的视频
    removeVideo = function(mediaStream) {
        var videoTracks = mediaStream.getVideoTracks();
        var i, length = videoTracks.length;
        for (i = 0; i < length; i++) {
            videoTracks[i].enabled = false;
        }
    };

    // 解除用户的音频
    muteVideo = function(mediaStream, mute){
        
        var audioTracks = mediaStream.getAudioTracks();
        var i, length = audioTracks.length;
        for (i = 0; i < length; i++) {
            audioTracks[i].enabled = false;
        }
    };

    // 初始化之后的回调：本地视频流
    function localStream (stream) {
        // 打印信息
        trialLog.initLocalStream();

        var pp;
        var wrap = $('.v-' + userInfo.role + userInfo.order);

        // 如果是盘观者或者其他角色就删除视频和音频
        if (userInfo.role == 'sp' || userInfo.role === 'ad' || userInfo.role == 'other') {
            muteVideo(stream);
            removeVideo(stream);
            return
        };

        // 如果角色是代理人就显示
        trialTool.showVideoWrapByRoleAndNode(userInfo.role, wrap);

        wrap.html('<video style="width: 100%;" autoplay>')
        .attr('uid', userInfo.userId)
        .parent().removeClass('init')
        .find('.mute-btn').attr('user-id', userInfo.userId);

        
        attachMediaStream(wrap.find('video')[0], stream);
        wrap.find('video')[0].muted = true;
        myStream = stream;
        userInfo.stream = stream;
        if (userInfo.role == 'ju') {
            attachBigWin(stream, userInfo.userId);
        }
        

        if (!myStream.getAudioTracks()[0]) {
            showTip();
            return;
        };

        // 初始化书记员禁言状态为true
        if(getMuteStateByUserRole('re') === null){
            updateStorageMuteState(getUserIdByUserRole('re'), true);
            updateStorageMuteState(getUserIdByUserRole('ju'), false);
        };

        // 初始化全部的禁言状态
        setAllRoleMuteState();
    }

    // 初始化视频并且打开消息端口
    function init () {
        Janus.init({debug: true, callback: function () {
            if (!Janus.isWebrtcSupported()) {
                log("No WebRTC support... ");
                showTip(true);
                return;
            }
            
            janus = new Janus({
                server: server,
                iceServers: [{
                    'url': 'turn:' + serviceIp + ':55000?transport=udp',
                    'username': appName,
                    'credential': credential
                }],
                success: function () {
                    janus.attach({
                        plugin: "janus.plugin.videoroom",
                        // 消息推送句柄
                        success: localSuccess,
                        ondataopen: function () {//数据通道可用，执行操作
                            // 初始化成功数据通道打开
                            trialLog.dataOpenSuccess();

                            canSendData = true;
                           setTimeout( function () {
                                if (userInfo.role == 'ju') {
                                    setInitInfoByRoleJu();
                                } else {
                                    sendData({event: 'initInfo'});
                                    function checkInit () {
                                        setTimeout( function () {
                                            if (!isInit) {
                                               sendData({event: 'initInfo'}, function () {
                                               }, function () {
                                                    modal.alert(0, '数据发送失败，请刷新页面或联系管理员');
                                               }); 
                                               checkInit();
                                            }
                                        }, 2000);
                                    }
                                    checkInit();
                                }
                            }, 1000);
                        },
                        error: function(error) {
                            console.error('数据通道打开失败', error);
                        },
                        consentDialog: function(on) {
                        },
                        ondata: function (data) {
                            log('this data is not expected: ' + data);
                        },
                        onmessage: localMsg,
                        // 视屏流
                        onlocalstream: localStream,
                        onremotestream: function(stream) {},
                        oncleanup: function() {
                            log(" ::: local cleanup :::");
                        }
                    });
                },
                error: function(error) {
                    if (error && error.indexOf('Lost connection to the gateway') == 0) {
                        modal.alert(0, '视频连接失败，请检查网络或者联系管理员');
                        errorLog('gateway', offline);
                        if (!offline) {
                            window.location.reload()
                        } else {
                           refreshPage = true; 
                        }
                    } else {
                        errorLog('error', JSON.stringify(error));
                    }
                    log(error);
                },
                destroyed: function() {
                    window.location.reload();
                }
            });
        }});
    }

    function errorLog (type, value) {
        var crash = localStorage[type +  lawCase.id];
        crash = JSON.parse(crash || '{}');
        crash[Date.now()] = value;
        localStorage[type +  lawCase.id] = JSON.stringify(crash);
    }

    // 初始化信息：用户信息，创建原、被告视频窗口，静音，笔录 [布局页面在这里]
    function initInfo (res, ac, de, al, dl) {
        var retValue;
        var count;
        var html = '';
        // 一切顺利
        if (res.hasError || !res.content.isSuccess) {
        } else {
            //初始化案件信息、当前用户信息
            retValue = res.content.retValue;
            // 总数
            count = trialTool.getAllCount(ac, al, de, dl);
            // 用户信息存储 ID 名称 角色
            userInfo.userId = retValue.userId;
            userInfo.userName = retValue.userName;
            userInfo.role = trialTool.updateJuWhenAeEnter( retValue.role );

            $('.fn-right.user').text(retValue.userName);

            if (retValue.order) {
                userInfo.order = retValue.order;
            };

            userList[userInfo.userId] = userInfo;

            //如果用户角色是旁观者、屏幕、法庭，则只能旁观视频
            viewonly = userInfo.role == 'sp' || userInfo.role == 'sc' || userInfo.role == 'ct';
            //计算视频窗口宽度，高度
            width = count <= 3 ? ( bigVideoWidth - 5 )/2 : Math.floor( (computeLayout.mainWidth - 20)/count ) - 5;
            height = width * 3 / 4;

            muteData = localStorage['muteData' + lawCase.id];
            muteData = muteData ? JSON.parse(muteData) : {};

            // 为[原告，原告代理人，被告，被告代理人]告创建视频窗口 开始布局
            // console.log(dl);
            trialTool.getAllLitigantList(ac, al, de, dl).forEach( function (item, k) {
                html += '<li title="' + trialTool.getRoleNameByRole(item) + '：' + item.userName + '" data-target="video" class="' + (userList[item.userId].stream && muteData[item.userId] ? '' : 'init') + ( trialTool.isAgentByRole(item.role) ? ' fn-hide': '' ) +'">\
                        <div style="width:' + width + 'px; height: ' + height + 'px;overflow:hidden;" class="v-'+ item.role + item.order + '">\
                            <img style="width:' + width + 'px;height: ' + height + 'px" src="' + img + '"/>\
                        </div>\
                        <div class="mask"></div>\
                        <div class="user-info">\
                            <i></i>\
                            <span class="fn-FS14 elli">'+ trialTool.getRoleNameByRole(item) + '：' + item.userName + '</span>\
                            <span class="mute-btn">' + (muteData[item.userId] ? '允许发言' : '禁止发言') + '</span>' + 
                            ( trialTool.hasStopViewBtnByUserId(item.userId) ? '<span class="stop-btn" sid="' + item.userId + '">暂停视频</span>' : '' ) + 
                        '</div>\
                    </li>';
            });
    
            // 塞入DOM
            $('.video-list').html(html);

            // 初始化法官的禁言按钮
            initJuMuteBtn();

            // 初始化数据员的禁言按钮
            initReMuteBtn();

            // 初始化视频在这里
            $(document).ready(init);

            // 通过本地缓存初始化信息
            getInitInfoByLocalStorae();
            
        }

        if (userInfo.role == 'ju' || userInfo.role == 're' || userInfo.role == 'sp') {
            $('.stop-btn').remove();
        };

        // 如果是旁观者删除多余的操作按钮
        if(userInfo.role === 'sp'){
            $('.last-time').remove();
            $('#start').remove();
            $('#pause').remove();
        }else{
            $('.last-time').removeClass('fn-hide');
        };

        $('.recorder .stop-btn').remove();

        $('.big-win, .big-win img').css({
            width: bigVideoWidth,
            height: bigVideoHeight
        });

        $('.v-ju1, .v-ju1 img, .v-re1, .v-re1 img').css({
            width: videoWidth,
            height: videoHeight
        });

        $('.main-list .elli').css('max-width', (width - 100) > 0 ? width - 100 : 0);

        //$('.v-re1').parent().addClass('muted');
    };

    // 初始化法官按钮
    function initJuMuteBtn(){
        var juObj = userList[getUserIdByUserRole('ju')],
                juName = juObj.userName,
                juUserId = juObj.userId;
            $('.judge').append('\
                    <div class="mask"></div>\
                    <div class="user-info">\
                        <i></i>\
                        <span class="fn-FS14 elli" title="' + juName + '">'+ juName + '</span>\
                        <span class="mute-btn" user-id="'+juUserId+'">禁止发言</span>\
                    </div>\
            ');
            // 如果是初始状态就增加init
            if( getMuteStateByUserRole('ju') === null ){
                $('.judge').addClass('init');
            };
    };

    // 初始化数据员的禁言按钮
    function initReMuteBtn(){
        var reObj = userList[getUserIdByUserRole('re')],
                reName = reObj.userName,
                reUserId = reObj.userId;
            $('.recorder').append('\
                    <div class="mask"></div>\
                    <div class="user-info">\
                        <i></i>\
                        <span class="fn-FS14 elli" title="' + '证据展示' + '">'+ '证据展示' + '</span>\
                        <span class="mute-btn" user-id="'+reUserId+'">禁止发言</span>\
                    </div>\
            ');
    };

    var getTrialRecord = {};

    // 事件开始
    // 页面初始化
    if (token) {//获取登录用户信息
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/account/lassenSSORpc/checkToken.json?tk=' + decodeURIComponent(token)
        }).done( function (res) {
            if (res.hasError || !res.content.isSuccess) {
                modal.alert(0, res.errors[0].msg);
                return;
            }
            var resConteVal = res.content.retValue;

            getTrialRecord.securityId = resConteVal.caseId;
            getTrialRecord.securityCaseId = resConteVal.sid;

            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: '/account/lassenSSORpc/getInitialState.json?tk=' + decodeURIComponent(token)
            }).done( function (resp) {
                var retValue;
                
                if (resp.hasError || !resp.content.isSuccess) {
                    modal.alert(0, resp.errors[0].msg);
                } else {
                    retValue = resp.content.retValue;
                    // 对测试第三方测试[ae]的处理
                    trialTool.updateResultForAe(retValue);
                    // 纠正顺序保证正确
                    trialTool.updateOrderForALAndDl(retValue, resConteVal);
                    // 确认笔录用的人员信息
                    result = trialTool.getAllLitigantList(retValue.ac, retValue.al, retValue.de, retValue.dl);
                    // 视频服务器IP
                    serviceIp = retValue.serviceIp;
                    server[0] = 'https://' + serviceIp + ':8089/janus';
                    // 视屏要用的，加密ID：Oa1m3FACB7ZXz9O34GC67uym_Fw
                    credential = retValue.credential;
                    // 视频要用的，应用名称："1452676314045:lassen"
                    appName = retValue.appName;
                    for (var i in retValue) { //创建用户列表
                        if (roleNameMap[i]) {
                            retValue[i].forEach( function (item) {
                                userList[item.userId] = {
                                    userId: item.userId,
                                    userName: item.userName,
                                    role: item.role,
                                    order: item.order ? item.order : ''
                                };
                            });
                        }
                    }
                    // 案件信息和当前人信息, 原告，被告
                    // 检查确保存在原告被告
                    if(!retValue.ac){
                        return modal.alert(0, '缺少原告');
                    };
                    if(!retValue.de){
                        return modal.alert(0, '缺少被告');
                    };

                    // 案件ID
                    lawCase.id = resConteVal.caseId;
                    // 案件标题
                    lawCase.title =  resConteVal.caseTitle;

                    // 初始化数据
                    trialLog.initUserInfoAndList(userInfo, userList);
                    trialTool.initUserInfoAndList(userInfo, userList, retValue, lawCase);

                    // 初始化布局
                    trialLayoutExp = new TrialLayout({
                        data: {
                            role: resConteVal.role,
                            sid: resConteVal.sid,
                            courtName: retValue.courtName,
                            caseTitle: resConteVal.caseTitle
                        },
                        events: {
                            // 禁言
                            'click .mute-btn': function(e){ triggerToMuteUser.call(e.target) },
                            // 视频
                            'click .stop-btn': function(e){ triggerToStopVideoUser.call(e.target, e) },
                            // 焦点视频
                            'click video': function(e){ triggerToFocusVideoUser.call(e.target) },
                            // 开庭
                            'click #start': function(e){ triggerToOpenCourt.call(e.target) },
                            // 休庭
                            'click #pause': function(e){ triggerToAdjourned.call(e.target) },
                            // 提交笔录
                            'click #submitRecord': function(e){ triggerToSubmitRecord.call(e.target, e) },
                            // 确认笔录
                            'click #confirmRecord': function(e){ triggerToConfirmRecord.call(e.target, e) },
                            // 最终确认
                            'click #saveRecord': function(e){ triggerToFinalConfirm.call(e.target) }
                        }
                    });

                    // 初始化信息
                    initInfo(res, retValue.ac, retValue.de, retValue.al, retValue.dl);
                }
            });
        });
    };

    function getRecordByRpc(flag){
        new Ajax({
            request: '/court/courtScheduleRpc/getIntralRecord.json',
            param: getTrialRecord,
            needPop: false,
            onAjaxSuccess: function(rtv){
                trialTool.setRecord(rtv.courtRecord || '');
                flag && setTimeout(function(){
                    $('#term').prop('checked', false).focus();
                }, 500);
            }
        }).submit();
    };

    // 把审判庭的当前信息广播给所有用户
    function setInitInfoByRoleJu(){
        var msg = {event: 'setInitInfo'};
        // 禁言信息
        msg.muteData = trialTool.getLocalStorageByName('muteData', {});
        // 笔录
        // msg.recordData = trialTool.getLocalStorageByName('recordData', '');
        // 是否开庭
        msg.isOpenCourt = trialTool.getLocalStorageByName('isOpenCourt', false);
        // 如果开庭把时间传递过去且开始计算
        if (msg.isOpenCourt) {
            msg.openTime = trialTool.getLocalStorageByName('openTime');
        };
        // 是否提交过笔录
        msg.isSubmit = trialTool.getLocalStorageByName('isSubmit', false);
        // 确认笔录名单
        msg.confirmList = trialTool.getLocalStorageByName('confirmList', {});
        // 是否最终确认
        msg.isFinalConfirm = trialTool.getLocalStorageByName('isFinalConfirm', false);
        sendData(msg, function () {}, function () {
            modal.alert(0, '数据发送失败，请刷新页面或联系管理员');
        });
    };

    // 是否是由setInitInfo初始化的
    var isFirstGetInitInfo = false;
    // 获取审判庭的初始化信息
    function getInitInfoByRoleJu(data){
        // 设置禁言状态
        trialTool.setLocalStorageByName('muteData', data.muteData);
        // [全部角色]
        if (data.muteData) {
            for (i in userList) {
                pp = $('.mute-btn[user-id='  + i  + ']').closest('li,.recorder,.judge');
                if (data.muteData[i]) {
                    pp.addClass('muted');
                    pp.find('.mute-btn').text('允许发言');
                    userList[i].stream && (userList[i].stream.getAudioTracks()[0].enabled = false);
                } else {
                    pp.removeClass('muted');
                    pp.find('.mute-btn').text('禁止发言');
                    userList[i].stream && (userList[i].stream.getAudioTracks()[0].enabled = true);
                }
            };
        };

        // 如果开庭
        trialTool.setLocalStorageByName('isOpenCourt', data.isOpenCourt);
        if (data.isOpenCourt) {
            $('#start').text('退 出').addClass('started');
            // 不是书记员 不是旁观者 不是管理员
            (userInfo.role != 're' &&  userInfo.role != 'sp' && userInfo.role != 'ad') && $('#start').css('display', 'inline');
            // 设置开庭时间
            trialLayoutExp.startTimer(data.openTime);
        };

        setInitInfoBySometheing(data);

        isFirstGetInitInfo = true;
    };

    // 通过本地缓存初始化信息
    function getInitInfoByLocalStorae(){
        //根据角色初始化庭审页面事件按钮
        if (userInfo.role == 'ju') {
            if (localStorage['isOpenCourt' + lawCase.id] == "true") {
                $('#start').text('结束庭审').addClass('started');
                $('#pause').css('display', 'inline');
                if (localStorage['isPaused' + lawCase.id] == "true") {
                    $('#pause').text('开庭');
                }else{
                    $('#pause').text('休庭');
                };
            }
            $('#start').css('display', 'inline');
        } else if (userInfo.role == 'ac' || userInfo.role == 're' || userInfo.role == 'de') {
            if (localStorage['isOpenCourt' + lawCase.id] == "true") {
                $('#start').text('退 出').addClass('started');
                userInfo.role != 're' && $('#start').css('display', 'inline');
            }
        };

        setInitInfoBySometheing();

        // 如果是书记员笔录的轮询保存
        // if( limit.contains(['re'] , userInfo.role) ){
            // setInterval(sendAndSaveRecord, trialConstant.saveRecordTime);
        // };

    };

    // 设置笔录，已提交，最终确认的状态
    function setInitInfoBySometheing(data){
        // 如果data存在就存入到本地
        if(data){
            // 如果提交过笔录
            trialTool.setLocalStorageByName('isSubmit', data.isSubmit);
            // 确认列表
            trialTool.setLocalStorageByName('confirmList', data.confirmList);
            // 如果最终确认过[书记员]
            trialTool.setLocalStorageByName('isFinalConfirm', data.isFinalConfirm);
        }else{
            data = {
                isSubmit: trialTool.getLocalStorageByName('isSubmit', false),
                confirmList: trialTool.getLocalStorageByName('confirmList', {}),
                isFinalConfirm: trialTool.getLocalStorageByName('isFinalConfirm', false),
            };
        };
        // 设置笔录 [书记员是不需要设置笔录的]为了防止输入的光标移动
        if( !isFirstGetInitInfo ){
            getRecordByRpc();
        };
        // 如果已提交
        if(data.isSubmit){
            // 如果是审判员和书记员的已提交
            if( limit.contains(['ju', 're'], userInfo.role) ){
                renderList();
            };
            // 如果是当是人且确认过
            if ( trialTool.isLitigantByRole(userInfo.role) ) {
                if( data.confirmList[userInfo.userId] ){
                    checkedRecord();
                }else{
                    // 如果为最终确认
                    if( !data.isFinalConfirm ){
                         reCheckedRecord();
                    }else{
                        $('#confirmRecordCheck').hide();
                    };
                };
            };
        }else{
            $('.record-list').hide();
        };

        // 如果是书记员且没有最终确认过
        if( limit.contains(['re'], userInfo.role) ) {
            if( data.isFinalConfirm ){
                $('#submitRecordUserRe').hide();
            }else{
                $('#submitRecordUserRe').show();
            };
        };
    };
        
    // 设置全部角色的禁言状态
    function setAllRoleMuteState(){
        var data = localStorage['muteData' + lawCase.id];
        data = data ? JSON.parse(data) : {};
        limit.each(data, function(val, key){
            userList[key] && setMute(key, userList[key].stream, getWrapByUserId(key));
        });
    };

    // 根据ID获取DOM
    function getWrapByUserId(key){
        return $('.mute-btn[user-id=' + key + ']').closest('li,.recorder,.judge');
    };

    // 获取角色的禁言状态
    function getMuteStateByUserRole(role){
        var state,
            data = localStorage['muteData' + lawCase.id];
        data = data ? JSON.parse(data) : {};
        state = data[getUserIdByUserRole(role)]
        return state === void 0 ? null : state;
    };

    // 更新存储中的禁言状态
    function updateStorageMuteState(userId, isMute){
        var data = localStorage['muteData' + lawCase.id];
        data = data ? JSON.parse(data) : {};
        data[userId] = isMute;
        localStorage['muteData' + lawCase.id] = JSON.stringify(data);
    };
    
    // 审判和数据的禁言切换
    function toggleMuteWithJuAndRe(role, isMute){
        // 防御只有两种角色呢个进
        if( role !== 'ju' && role !== 're' ) return;
        var userObj, //角色对象 
            userNode; //角色DOM
        // 如果是审判员操作的就是书记员
        if(role === 'ju'){
            userObj = userList[getUserIdByUserRole('re')];
            userNode = $('.recorder');
        }else if(role === 're'){
            userObj = userList[getUserIdByUserRole('ju')];
            userNode = $('.judge');
        };

        sendData({
            event: 'setMute',
            userId: userObj.userId,
            mute: !isMute
        }, function(){
            updateStorageMuteState(userObj.userId, !isMute);
            setMute(userObj.userId, userObj.stream, userNode);
        }, function(){
             modal.alert(0, '数据发送失败，请刷新页面或联系管理员'); 
        });

    };

    // 确认笔录
    function checkedRecord(){
        $('#confirmRecordTitle').show();
        $('#confirmRecordCheck').hide();
    };

    // 再次确认
    function reCheckedRecord(){
        trialTool.setLocalStorageByName('isConfirmed', false);
        $('#confirmRecordCheck').show();
        $('#confirmRecordTitle').hide();
        
    };

    // ajax简化函数 
    function post (url, cb) {
        $.ajax({
            url: url,
            type: 'POST'
        }).done( function (res) {
            if (res.hasError) {
                log(res);
            }
            cb && cb();
        });
    };

    // 在最终确认前，检查是不是所有的当事人都确认了
    function checkAllPersonConfirmBefreFinalConfirm(){
        var confirmList = trialTool.getLocalStorageByName('confirmList'),
            allPerson =  limit.whiteList(userList, {role: 'ac'}, {role: 'al'}, {role: 'de'}, {role: 'dl'});
        return limit.size( confirmList ) === limit.size( allPerson ) ? '' : '还有未确认笔录的用户，';
    };
    
    // 事件:::禁止发言triggetToMuteUser
    function triggerToMuteUser() {
        // 只有审判员能进行操作
        if (userInfo.role == 'ju' || userInfo.role === 'ad') {
            var pp = $(this).closest('li,.recorder,.judge');
            var userId = $(this).attr('user-id');
            var video = pp.find('video');
            var msg = {
                event: 'setMute',
                userId: userId,
                mute: !(pp.hasClass('init') || pp.hasClass('muted'))
            }

            if (!canSendData) {
                modal.alert(0, '不能发送数据，请刷新页面或联系管理员');
                return;
            }
            if (!userId || !video.length) {
                return;
            }

            sendData(msg, function () {
                muteData = localStorage['muteData' + lawCase.id];
                muteData = muteData ? JSON.parse(muteData) : {};
                muteData[userId] = msg.mute;
                localStorage['muteData' + lawCase.id] = JSON.stringify(muteData);
                setMute(userId, userList[userId].stream, pp);
            }, function () {
                modal.alert(0, '数据发送失败，请刷新页面或联系管理员'); 
            });

            // 如果禁言的用户是审判员[ju]就把书记员[re]的打开反之亦然
            toggleMuteWithJuAndRe(getUserRoleByUserId(userId), msg.mute);
        }
    }

    // 事件:::停止视频
    function triggerToStopVideoUser(e){
        e.preventDefault();
        var publish;
        var uid = $(this).attr('sid');

        if (!uid || !userList[uid] || !userList[uid].stream || !userList[uid].handle) {
            return;
        }

        if ($(this).hasClass('stoped')) {
            $(this).text('暂停视频');
            $(this).removeClass('stoped');
            publish = { "request": "configure", "audio": true, "video": true,  data: true, token: token};
            
        } else {
            $(this).text('恢复视频');
            $(this).addClass('stoped');
            publish = { "request": "configure", "audio": true, "video": false,  data: true, token: token};
        }

        userList[uid].handle.send({"message": publish});
    };

    // 事件:::焦点视频
    function triggerToFocusVideoUser(){
        var userId,
            p = $(this).parent();
        if (p.hasClass('big-win')) {

        } else {
            userId = p.attr('uid');
            if (userId == $('.big-win').attr('user-id')) {
                return;
            }
            if ($('.big-win video').length) {
                reattachBigWin(this, userId);
            } else {
                if (userId == userInfo.userId) {
                    attachBigWin(myStream, userId);
                } else {
                    attachBigWin(userList[userId].stream, userId);
                }
            }
        }
    };

    // 事件:::开庭
    function triggerToOpenCourt(){
        if (!mcutest || !canSendData) {
            modal.alert(0, '不能发送数据，请刷新页面或联系管理员');
            return;
        };
        // 如果是审判员就是开庭和休庭，原被告就是退出庭审
        if (userInfo.role == 'ju') {
            if ($(this).hasClass('started')) {//休 庭
                modal.confirm('提示', '<span style="font-size:13px;font-weight:bold;">' + (trialTool.getLocalStorageByName('isFinalConfirm') ? '': '书记员的笔录还未确认完成，') + '确定要结束庭审吗？</span>', function () {
                    mcutest.data({
                        text: JSON.stringify({event: 'quitCourt'}),
                        success: function () {
                            mcutest.send({"message": {"request":"destroy", room: lawCase.id, token: token}});
                            post('/account/lassenSSORpc/trialEnd.json?tk=' + token, function () {
                                clearData({clear: true});
                                window.close();
                            });
                        },
                        error: function () {
                            modal.alert(0, '数据发送失败，请刷新页面或联系管理员');
                        }
                    });
                });
            } else {//开庭
                var self = this;
                sendData({event: 'openCourt'}, function () {
                    localStorage['isOpenCourt' + lawCase.id] = true;
                    $(self).addClass('started')
                    $(self).text('结束庭审');
                    $('#pause').css('display', 'inline').text('休庭');
                    mcutest.send({"message": {"request":"start_record",  "room": lawCase.id, token: token}}); // 开始录制
                    // 设置开庭时间
                    trialLayoutExp.startTimer( new Date().getTime() );

                    post('/account/lassenSSORpc/trialStart.json?tk=' + token);
                }, function () {
                    modal.alert(0, '数据发送失败，请刷新页面或联系管理员');
                });
                
            }
        } else if ( trialTool.isLitigantByRole(userInfo.role) ) {//原被告退出庭审
            modal.confirm('提示', '确定要退出庭审吗？', function () {
                sendData({
                    event: 'leaveCourt',
                    userId: userInfo.userId
                }, function () {
                    mcutest.send({"message": {"request":"leave"}}); 
                    post('/account/lassenSSORpc/trialEnd.json?tk=' + token, function () {
                        window.close();
                    });
                }, function () {
                    modal.alert(0, '数据发送失败，请刷新页面或联系管理员');
                });
                
            });
        }
    };

    // 事件:::休庭
    function triggerToAdjourned(){
        if (!mcutest) {
            return;
        }
        if (localStorage['isPaused' + lawCase.id] == "true")  {
            localStorage['isPaused' + lawCase.id]= false;
            $(this).text('休庭');
            mcutest.send({"message": {"request":"start_record", room: lawCase.id, token: token}});
        } else {
            localStorage['isPaused' + lawCase.id] = true;
            $(this).text('开庭');
            mcutest.send({"message": {"request":"pause_record", room: lawCase.id, token: token}});
        }
    };

    // 事件:::提交笔录
    function triggerToSubmitRecord(e){
        modal.confirm('提示', '确定要提交笔录吗？', function(){
            sendAndSaveRecord();
            sendData({event: 'submitRecord'}, function () {
                localStorage['isSubmit' + lawCase.id] = true;
                trialTool.setLocalStorageByName('confirmList', {});
                renderList();
            }, function () {
                modal.alert(0, '数据发送失败，请刷新页面或联系管理员');
            });
            
        });
    };

    // 事件:::确认笔录
    function triggerToConfirmRecord(e){
        e.preventDefault();
        if (!canSendData) {
            modal.alert(0, '不能发送数据，请刷新页面或联系管理员');
            return;
        }
        if ($('#term').prop('checked')) {
            if ( trialTool.isLitigantByRole(userInfo.role) ) {
                modal.confirm('提示', '确定要确认笔录吗？', function () {
                    sendData({
                        event: 'confirmRecord',
                        userId: userInfo.userId
                    }, function () {
                        checkedRecord();
                        localStorage['isConfirmed' + lawCase.id] = true;
                    }, function () {
                       modal.alert(0, '数据发送失败，请刷新页面或联系管理员'); 
                    });
                });
            }
        } else {
            modal.alert(0, '请勾选已阅读笔录');
        }
    };

    // 事件:::最终确认
    function triggerToFinalConfirm(){
        var record = trialTool.getRecord();
        if (userInfo.role != 're') {
            return;
        };
        if (!record) {
            modal.alert(0, '请输入笔录');
            return;
        };
        modal.confirm('提示', '<span style="font-size:13px;font-weight:bold;">' + checkAllPersonConfirmBefreFinalConfirm() + '您确定要完成笔录的确认吗？确认后无法再提交！</span>', function(){
            saving = true;
            sendData({event: 'finalConfirm'}, function () {
                trialTool.setLocalStorageByName('isFinalConfirm', true);
                $('#submitRecordUserRe').hide();
            }, function () {
                modal.alert(0, '数据发送失败，请刷新页面或联系管理员');
            });
            
        });
        
    };

    // 笔录的保存
    function sendAndSaveRecord(){
        var record = trialTool.getRecord();
        // record = record.replace(/"/g, '\\\"').replace(/'/g, '\\\'');
        // if( record.length > 65535 ){
        //     return modal.alert(0, '笔录超长，请联系管理员。')
        // };

        // sendData({
        //     event: 'setRecord',
        //     data: record
        // }, function(){

        // });
        trialTool.setLocalStorageByName('recordData', record);
        new Ajax({
            request: '/account/lassenSSORpc/trialRecord.json',
            needPop: false,
            param: {tk: token, record: record},
            paramName: 'param',
            onAjaxSuccess: function(){
                sendData({ event: 'setRecord' });
            }
        }).submit();
    };

    // 确认笔录后触发的渲染列表
    function renderList (userId) {//渲染确认列表
        var html = '',
            confirmList = trialTool.getLocalStorageByName('confirmList') || {};
        if (userId) {
            confirmList[userId] = true;
        };
        trialTool.setLocalStorageByName('confirmList', confirmList);
        if (result) {
            result.forEach( function (item) {
                html += '<tr><td>' + trialTool.getRoleNameByRole(item, true) + '</td><td>' + item.userName + '</td><td>' + (confirmList[item.userId] ? '已确认' : '未确认') + '</td></tr>';
            });
        }
        $('.record-list tbody').html(html);
        $('.record-list').show();
    }
    

    var refreshPage = false;
    var offline = false;
    window.ononline = function () {
        log(':::网络连接成功');
        offline = false;
        if (refreshPage) {
            window.location.reload();
        };
    }
    window.onoffline = function () {
        log(':::网络连接失败');
        offline = true;
    }


});