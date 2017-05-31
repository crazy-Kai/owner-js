"use strict";
/**
 * 业务：我的诉讼[suit/myCase]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');

    //依赖
    var $ = require('$'),
        util = require('common/util'),
        FilterConditions = require('model/filterConditions/main'),
        Modal = require('model/modal/main'), //提示框
        CountDown = require('model/countDown/main'),
        Dialog = require('common/dialog'),
        domUtil = require('common/domUtil'),
        SearchList = require('model/searchList/main'),
        Delegate = require('common/delegate'),
        Dialog = require('common/dialog'),
        backdataHbs = require('./backdata-hbs'),
        paymessageHbs = require('./paymessage-hbs'),
        Validator = require('common/validator'),
        Ajax = require('model/ajax/main');

    var statusMap = require('common/statusMap');

    var errorMsg = $('#errorMsg').val();
    //组件：确认框
    errorMsg && Modal.confirm('提醒', errorMsg, function() {
        domUtil.redirect('/suit/newMySuit.htm#personInfo');
    }, function() {
        domUtil.redirect('/portal/main/domain/index.htm');
    });

    var beforeFillingStatus = ['will_submit', 'submit', 'audit', 'correction', 'dropped', 'return'];

    $.ajaxSetup({ cache: false });

    //组件：
    new FilterConditions({ element: '#filter-conditions' }).on('change', function() {
        searchListExp[0].searchListReload();
    });

    //组件：查询
    var searchListExp = SearchList.use('.searchList', {
        request: '/account/mySuitRpc/queryMySuitInfo.json',
        map: function(data) {
            var i = 0;
            for (; i < data.length; i++) {
                if (data[i].status) {
                    data[i].statusEx = statusMap[data[i].status];
                    //if(data[i].amount){
                    //	data[i].amount = data[i].amount.toFixed(2);
                    //}
                }

                //立案前（待提交、已提交、立案审核、立案补正、原告已撤诉、退回）弹出案件详情单页面，否则多页面
                if (!data[i].status || $.inArray(data[i].status, beforeFillingStatus) > 0) {
                    data[i].fillingTab = "false"
                } else {
                    data[i].fillingTab = "true"
                }

            }

            return data;
        }
    });

    //组件：弹出框
    /*	var dialogExp = new Dialog({
    		content: '#dialog',
    		width: "560px",
    		events: {
    			'click .JS-trigger-click-submit': function(e){
    				var me = this;
    			}
    		}
    	});*/




    //组件：完成支付
    var dialogPay = new Dialog({
        content: '#dialogPay',
        width: "250px",
        height: "100px",
        closeTpl: "",
        events: {
            'click .JS-trigger-click-refresh': function(e) {
                var me = this;
                new Ajax({
                    request: "/suit/aliPayRpc/paySuccess.json?securityCaseId=" + me.get('securityCaseId')
                }).on('ajaxSuccess', function(rtv, msg, con) {
                    searchListExp[0].searchListAjax();
                    me.hide();
                }).submit();
            },
            'click .JS-trigger-click-close': function(e) {
                this.hide();
            }
        }
    });
    $("#relativeCase").on('click', function() {
        dialogExp.show();
    });

    //倒计时
    $('.JS-target-count-down').each(function() {
        var node = $(this),
            endTime = node.data('endTime'),
            countDownExp = new CountDown({
                target: endTime
            }),
            intervalID;
        //定时器
        intervalID = setInterval(function() {
            var data = countDownExp.use();
            //不存在 干掉定时器
            if (!data) {
                return clearInterval(intervalID)
            }
            node.html(data.hour + ' 时 ' + data.minute + ' 分 ' + data.second + ' 秒 ');
        }, 1000);
    });

    //组件：弹出框
    var dialogExp = new Dialog({
        content: '#dialog',
        width: "560px",
        autoDestroy: true,
        events: {
            'click .JS-trigger-click-submit': function(e) {
                e.preventDefault();
                var accociateCode = $.trim($('#caseRelevanceCode').val());
                if (/^\w{8}$/.test(accociateCode)) {
                    var me = $(this);
                    new Ajax({
                        request: '/account/mySuitRpc/showCaseEntity.json',
                        param: $.extend({}, { accociateCode: accociateCode })
                    }).on('ajaxSuccess', function(rtv, msg, con) {
                        dialogExp.hide();
                        Dialog.showTemplate('#dialogCode', rtv, {
                            width: 400,
                            events: {
                                'click .JS-trigger-click-codeSure': function() {
                                    var me = this;
                                    new Ajax({
                                        request: '/account/mySuitRpc/checkAssociateCode.json?accociateCode=' + accociateCode
                                    }).on('ajaxSuccess', function(rtv, msg, con) {
                                        me.hide();
                                        searchListExp[0].searchListReload();
                                    }).submit();
                                },
                                'click .JS-trigger-click-codeCancel': function() {
                                    this.hide();
                                },
                            }
                        });
                    }).submit();
                } else {
                    Modal.alert(0, '查询码是由数字或字母组成的8位字符串');
                }
            },
        }
    });
    dialogExp.after('hide', function() {
        $('#caseRelevanceCode').val('');
    });

    $('#dialog input[name=caseRelevanceCode]').on('keydown', function(e) {

        if (e.keyCode == 13) {
            e.preventDefault();
            $('.JS-trigger-click-submit').click();
        }

    });

    //案件状态，更多和收起
    $('[data-action="toggleStatus"] span').on('click', function(e) {
        var target = $('[data-action="toggleStatus"]');

        if (target.find('.kuma-icon-triangle-down').size() > 0) {
            $('.JS-tirgger-more').removeClass('fn-hide');
            target.find('a').text('收起');
            target.find('.kuma-icon-triangle-down').addClass('kuma-icon-triangle-up').removeClass("kuma-icon-triangle-down");
        } else {
            $('.JS-tirgger-more').addClass('fn-hide');
            target.find('a').text('更多');
            target.find('.kuma-icon-triangle-up').addClass('kuma-icon-triangle-down').removeClass("kuma-icon-triangle-up");
        }
    });

    // 跳过 JS-trigger-click-skip
    new Ajax({
        element: '#filter-content',
        autoDestroy: false,
        autoSuccessAlert: true,
        type: 'get',
        events: {
            'click .JS-trigger-click-skip': function(e) {
                e.preventDefault();
                var me = this,
                    node = $(e.target),
                    targetsource = node.prop('href');
                Modal.confirm('提示', '您确定要' + node.html() + '吗？', function() {
                    me.set('request', targetsource);
                    me.submit();
                })
            },
            'click .JS-trigger-click-pay': function(e) {
                //alert($(e.target).('href'));
                dialogPay.show();
                dialogPay.set('securityCaseId', $(e.target).data('param'));
                return true;
            }
        },
        onAjaxSuccess: function() {
            searchListExp[0].searchListAjax();
        }
    });
    //送达方式确认
    Delegate.on("click", "[data-item='click']", function(e) {
            var securityCaseIds = $(e.target).data("param");
            new Ajax({
                request: "/suit/accusedReceiveConfirmRpc/getDebtorInfo.json",
                param: { securityCaseId: securityCaseIds }
            }).on("ajaxSuccess", function(rtv) {
                var dia = Dialog.show(backdataHbs(rtv), {
                    width: 460,
                    events: {
                        'click [data-trigger="save"]': function() {
                            this.validatorExp.execute(function(isErr) {
                                if (!isErr) {
                                    new Ajax({
                                        request: '/suit/accusedReceiveConfirmRpc/save.json',
                                        parseForm: dia.element,
                                        paramName: "fileMap"
                                    }).on("ajaxSuccess", function() {
                                        dia.hide();
                                        Modal.alert(1, "提交成功!")
                                    }).submit();
                                }
                            })
                        }
                    },
                    autoShow: false
                }).after("show", function() {
                    this.validatorExp = Validator.use(this.element, '[data-widget="validator"]')
                }).show();
            }).submit();


        })
    //缴费
    Delegate.on("click", "[data-item='pay']", function(e) {
        var securityCaseIds = $(e.target).data("param"),
            payurl = $(e.target).data("url");
            new Ajax({
               request:"/suit/aliPayRpc/queryPaymentInfo.json",
               param:{securityCaseId:securityCaseIds}
            }).on("ajaxSuccess",function(rtv){
              var dia = Dialog.show(paymessageHbs($.extend({securityCaseId:securityCaseIds},rtv)), {
                  width: 420,
                  events: {
                      "click [data-tigger='pay']":function(){
                         dia.hide();
                         window.open(payurl,"_blank")
                      }
                  }
              })
            }).submit();
    })
});
