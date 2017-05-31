"use strict";

define(function(require, exports, module) {
    //依赖主模块
    require('bus/global/main');

    //依赖
    var Dialog = require('common/dialog'),
        $ = require('$'),
        Delegate = require('common/delegate'),
        Modal = require('model/modal/main');
    //查看
    Delegate.on("click", '[data-trigger="click"]', function(e) {
        var html = $(e.target).siblings(".details").html();
        var dialog = Dialog.show(html, {
            width: 1000
        })

    })

    //视频下载
    Delegate.on('click', '.JS-trigger-download-video', function(element) {
        var flag;
        var checkUrl = $(element.target).data('url');

        $.ajax({
            url: checkUrl,
            type: 'POST',
            data: {},
            cache: false,
            async: false
        }).done(function(res) {
            if (!res.hasError && res.content && res.content.isSuccess) {
                return true;
            } else {
                if (res.content && res.content.message) {
                    Modal.alert(0, res.content.message);
                } else {
                    Modal.alert(0, "系统繁忙，请联系管理员");
                }
                if (element && element.preventDefault)
                    element.preventDefault();
                else
                    window.event.returnValue = false;
                return false;
            };
        });
    });


})
