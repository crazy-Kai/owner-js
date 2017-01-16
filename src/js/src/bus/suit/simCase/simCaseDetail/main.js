"use strict";

define(function(require, exports, module) {

    // 依赖模块
    var Delegate = require('common/delegate');
    // 意见反馈
    new(require('../common/feedback'))();
    // 意见反馈
    Delegate.on("click", ".dialogLink", function(e) {
        $(".dialogLink").removeClass("fn-color-0073bf");
        $(this).addClass("fn-color-0073bf");
        $(".currentImg").hide();
        $(".seconddialogImg").show();
        $(this).parent().find(".seconddialogImg").hide();
        $(this).parent().find(".currentImg").show();
    })
   
});
