"use strict";
/*
page:案件详情
time:2016/5/5
*/
define(function(require, exports, module) {
    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');
    // 依赖模块
    var Delegate = require('common/delegate'),
        $ = require('$'),
        Ajax = require('model/ajax/main'),
        CaseDetail = require('./casedetails-hbs'),
        Objection = require('./objection-hbs'),
        Recall = require('./recall-hbs'),
        dialog = require('common/dialog'),
        View = require('model/paymentFact/view'),
        domUtil = require('common/domUtil'),
        limit = require('common/limit'),
        imgViewGlobal = require('model/imgView/global'),
        caseId = $('[name="caseId"]').val(),
        ConfirmView = require('model/paymentTips/main');
    // 图片
    new imgViewGlobal;
    //运行点击事件和滚轮事件的开关
    var Switch = false;
    // 判断当前用户的角色
    var entityRoles = $('[name="role"]').val();
    //存放每块数据div距离顶部的距离
    var topList = [];

    //tab 点击事件
    Delegate.on("click", '[data-items="tab"]', function() {
        //点击事件的时候关掉滚动事件中执行的函数，不然会有冲突
        Switch = true;
        var self = this;
        $('[data-items="tab"]').removeClass("ch-active");
        $(self).addClass("ch-active");
    });

    //发送请求加载所有数据  
    new Ajax({
        request: '/paymentorder/paymentCaseDetailRpc/getCaseDetailInfo.json',
        param: { securityCaseId: caseId }
    }).on("ajaxSuccess", function(rtv) {
        $('#content').append(CaseDetail($.extend({ entityRole: entityRoles }, rtv)));
        new View({ element: "#factDetail" });
        new ConfirmView({ element:"#confirm"});
        $("[data-item='tab']").each(function(key, value) {
            $(value).prop("id", "file" + (key + 1));
            var self = $(value),
                offset = self.offset();
            if (offset) {
                topList[key] = offset.top;
            }
        });
        /*给数组中添加最后一块div的offset加上它的自身高度的值以此来和scrollTop作比较,不然右侧tab栏的描点会直接跳至第一个，因为index 是从--key开始算的*/
        var lastIndex = $("[data-item='tab']").length - 1;
        var lastHeight = topList[lastIndex] + ($("[data-item='tab']").last().height());
        topList.push(lastHeight);
    }).submit();
    $(window).scroll(function() {
            var scrollTop = domUtil.winScrollY();
            var index = 0;
            limit.breakEach(topList, function(value, key) {
                if (scrollTop <= value) {
                    index = --key;
                    return false;
                }
            });
            !Switch && $("[data-items='tab']").removeClass("ch-active").eq(index < 0 ? 0 : index).addClass("ch-active");
            Switch = false;
        })
        //查看异议裁定
    Delegate.on("click", '[data-click="objection"]', function(e) {
        var securityId = $(e.target).data("param");
        new Ajax({
            request: "/paymentorder/paymentObjectionRpc/getObjectionDeal.json",
            param: { securityCaseId: caseId }
        }).on("ajaxSuccess", function(rtv) {
            var Dialogs = dialog.show(Objection($.extend({ securityCaseId: caseId }, rtv)), { width: 500})

        }).submit()
    })
    //撤回记录
      Delegate.on("click", '[data-click="recall"]', function(e) {
        var securityId = $(e.target).data("param");
        new Ajax({
            request: "/court/lassenSuitWithdrawalRpc/queryPaymentWithdrawalDetail.json",
            param: { securityId: securityId }
        }).on("ajaxSuccess", function(rtv) {
            var Dialogs = dialog.show(Recall($.extend({ securityCaseId: caseId }, rtv)), { width: 500})

        }).submit()
    })
})
