// 庭审日志
define(function(require, exports, module) {

    // 依赖
    var limit = require('common/limit'),
        trialConstant = require('./trialConstant'),
        trialTool = require('./trialTool');

    // 变量
    var trialLog = {},
        roleNameMap = trialConstant.roleNameMap,
        userInfo, // 用户信息
        userList; // 用户列表

    // 初始化用户信息的数据源
    trialLog.initUserInfoAndList = function(info, list){
        userInfo = info;
        userList = list;
    };

    // 成功创建房间
    trialLog.initRoom = function(res){
        return limit.log( 'log', '初始化视频房间', '返回内容：'+JSON.stringify(res) );
    };

    // 获取服务器消息
    trialLog.getServeMsg = function(msg){
        return limit.log( 'warn', '获取服务器消息', '当前用户:'+ getUserName(), '消息内容:' + JSON.stringify(msg) );
    };

    // 初始化本地视屏流
    trialLog.initLocalStream = function(){
        return limit.log( 'log', '初始化本地视屏', '当前用户:'+ getUserName() );
    };

    // 初始化成功数据通道打开
    trialLog.dataOpenSuccess = function(){
        return limit.log( 'log', '初始化数据通道', '当前用户:'+ getUserName() );
    };

    // 格式化信息
    function formatMSG(msg){
        msg = limit.clone(msg);
        limit.each(['data', 'recordData'], function(val){
            if(msg[val]){
                msg[val] = msg[val].slice(0, 20) + '...';
            };
        })
        return msg;
    };

    // 广播消息
    trialLog.sendMsgSuccess = function(msg){
        return limit.log( 'warn', '发送点对点消息', '发送用户:'+ getUserName(), '消息内容:' + JSON.stringify( formatMSG(msg) ) ); 
    };

    // 接收消息
    trialLog.receiveMsgSuccess = function(data){
        return limit.log( 'warn', '接收点对点消息', '接收用户:'+ getUserName(userList[data.myUserId]), '消息内容:' + JSON.stringify( formatMSG(data) ) ); 
    };

    // 获取远程视频
    trialLog.getOtherStreamSuccess = function(userId){
        return limit.log('log', '获取推送视频流', '推送角色:'+getUserName(userList[userId]));
    };

    // 暂时离开
    trialLog.unpublishedPerson = function(vid){

        return limit.log( 'error', '暂时有用户离开', '推送角色:' + getUserName( userList[trialTool.getUserIdByVid(vid)] ), ''+vid );
    };

    // 确认离开
    trialLog.LeavingPerson = function(vid){
        return limit.log( 'error', '确认有用户离开', '推送角色:' + getUserName( userList[trialTool.getUserIdByVid(vid)] ), ''+vid );
    };

    // 私有方法

    // 获取用户信息
    function getUserName(user){
        user = user || userInfo;
        return roleNameMap[user.role] + '#' + user.userName + '['+user.role+']';
    };

    return trialLog;

});