/*
 time:2016/2/23
 author:wukai
 business:协查详情
*/
"use strict";

define(function(require, exports, module) {

    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');

    // 依赖
    var $ = require('$'),
        Dialog = require('common/dialog'),
        Delegate = require('common/delegate'),
        SearchList = require('model/searchList/main'),
        Ajax = require('model/ajax/main'),
        Cookie = require('common/cookie'),
        Tip = require('common/tip'),
        Validator = require('common/validator'),
        secondCheckHbs = require('./secondCheck-hbs'),
        Timer = require('model/timer/main');
        Cookie.setPath('/');

    // 按退出按钮后 清除cookie
    
    $("body").on('click', '#logoutbtn', function(event) {
        event.preventDefault();
        Cookie.remove('InvestigationPID');
        window.location.href = "/loginOut.do";
    })


    // 结果下载
    Delegate.on('click', '[data-target="resourceList"]', function() {
        var self = $(this),
            resourceId = self.data('resourceId');
        //先进行次数验证
        new Ajax({
            request: '/mercury/investigationRpc/checkDownLoadCount.json'
        }).on("ajaxSuccess", function() {

            //判断cookie
            if (Cookie.get('InvestigationPID') === 'true') {
                window.open('/investfileOperation/download.json?fileIdStr=' + resourceId)
            } else {
                //身份证次数验证
                new Ajax({
                    request: '/mercury/investigationRpc/checkIdCardCount.json'
                }).on("ajaxSuccess", function() {
                    //首次发送验证码并验证验证码错误次数
                    new Ajax({
                        request: '/mercury/investigationRpc/sendMobileMsg.json'
                    }).on("ajaxSuccess", function() {

                        var dialog = Dialog.show(secondCheckHbs(), {
                            width: 500,
                            events: {
                                'click [data-trigger="getTime"]': function(e) {
                                    //手动获取验证码     
                                    var me = this;
                                    new Ajax({
                                        request: '/mercury/investigationRpc/sendMobileMsg.json'
                                    }).on("ajaxSuccess", function() {
                                        $("#messageText").text("验证码会在倒计时60秒内发送至你的手机,有效期为5分钟");
                                        //这里不能用$(this),只能用e.target来找到当前所点击的元素
                                        var target = e.target;
                                        $(target).addClass("fn-hide");
                                        $('[data-trigger="time"]').removeClass("fn-hide");
                                        // 这里的me 指向dialog
                                        me.timer = new Timer({
                                            time: 60
                                        }).on('progress', function(key) {
                                            $('[data-trigger="time"]').val('倒计时：' + key + 's')
                                        }).on('end', function() {
                                            $("#messageText").text("如果未收到验证码，请点击获取验证码按钮");
                                            $('[data-trigger="time"]').addClass("fn-hide");
                                            $('[data-trigger="getTime"]').removeClass("fn-hide");
                                        });

                                    }).submit();

                                },

                                //保存 提交
                                'click [data-trigger="submit"]': function() {
                                    this.validatorExp.execute(function(isErr) {
                                        if (!isErr) {
                                            //验证身份证和验证码是否正确
                                            new Ajax({
                                                request: '/mercury/investigationRpc/checkAuthority.json',
                                                parseForm: dialog.element
                                            }).on('ajaxSuccess', function(val, msg, res) {
                                                Cookie.set('InvestigationPID', res.isSuccess, 1800);
                                                dialog.hide();
                                                window.open('/investfileOperation/download.json?fileIdStr=' + resourceId)
                                            }).submit();
                                        }

                                    })
                                }
                            },
                            autoShow: false
                        }).after('show', function() {
                            // 调用验证插件
                            this.validatorExp = Validator.use('#small-page', '[data-widget="validator"]');

                            //初始化倒计时组件
                            this.timer = new Timer({
                                time: 60
                            }).on('progress', function(key) {
                                $('[data-trigger="time"]').val('倒计时：' + key + 's')
                            }).on('end', function() {
                                $('[data-trigger="time"]').addClass("fn-hide");
                                $('[data-trigger="getTime"]').removeClass("fn-hide");
                                $("#messageText").text("如果未收到验证码，请点击获取验证码按钮");
                            });
                        }).before('hide', function() {
                            this.timer.destroy();
                        }).show();
                    }).submit();

                }).submit();
            }
        }).submit();
    })
 
})
