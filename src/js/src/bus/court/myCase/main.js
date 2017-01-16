"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {
    require('bus/global/main');
    //依赖
    var $ = require('$'),
        delegate = require('common/delegate'),
        CountDown = require('model/countDown/main'),
        Calendar = require('common/calendar'),
        SearchList = require('model/searchList/main'),
        Ajax = require('model/ajax/main'),
        Modal = require('model/modal/main'),
        Validator = require('common/validator'),
        advancedQuery = require('model/advancedQuery/main'),
        SwitchFilterBtn = require('model/switchFilterBtn/main'),
        util = require('common/util'),
        Dialog = require('common/dialog'),
        Handlebars = require('common/handlerbars');

    //业务判断:比较 , 如果状态不是已判决、管辖异议成立、原告已撤诉、调解、退回、被告无法送达、撤销申请、不予受理、未缴费撤诉
    Handlebars.registerHelper('isNeedPop', function(isFlag, status, options) {
        if (isFlag !== 'n' && (status !== 'not_accepted' && status !== 'unpaid_dropped' && status !== 'return' && status !== 'dropped' && status !== 'jurisediction_objection' && status !== 'conciliate' && status !== 'not_be_served' && status !== 'cancel_apply' && status !== 'sentenced')) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        };
    });

    //添加时间控件
    function getDateMonthRange(date1, range) {
        return date1 + 1000 * 60 * 60 * 24 * 30 * range;
    }

    function getDateToString(date1) {
        var year = date1.getFullYear(),
            month = date1.getMonth() + 1,
            day = date1.getDate();
        var result = year.toString() + "-";
        result = result + (month < 10 ? ('0' + month.toString()) : month.toString()) + '-';
        result = result + (day < 10 ? ('0' + day.toString()) : day.toString());

        return result;
    }

    //清除其他的日期
    function clearOtherDateValue(type) {
        if (type == 2 || type == 3) {
            $("#submit-date-fr").val("");
            $("#submit-date-to").val("");
            $("#submit-date-fr").prop("disabled", "disabled");
            $("#submit-date-to").prop("disabled", "disabled");
        }
        if (type == 1 || type == 3) {
            $("#register-date-fr").val("");
            $("#register-date-to").val("");

            $("#register-date-fr").prop("disabled", "disabled");
            $("#register-date-to").prop("disabled", "disabled");
        }
        if (type == 1 || type == 2) {
            $("#judge-date-fr").val("");
            $("#judge-date-to").val("");
            $("#judge-date-fr").prop("disabled", "disabled");
            $("#judge-date-to").prop("disabled", "disabled");
        }
    }

    //为日期范围添加时间
    function attachSelectDateEvent(c1, c2, type) {
        c1.on('selectDate', function(date) {
            // c2.range([date, null]);
            clearOtherDateValue(type);
            c2.range(
                function(aDate) {
                    if (!date || (date && (aDate >= date))) {
                        return true;
                    } else {
                        return false;
                    }
                });
        });

        c2.on('selectDate', function(date) {
            //  c1.range([null, date]);
            clearOtherDateValue(type);
            c1.range(
                function(aDate) {
                    if (!date || (date && (aDate <= date))) {
                        return true;
                    } else {
                        return false;
                    }
                });

        });
    }
    var c1, c2, c3, c4, c5, c6;
    if ($('#submit-date-fr').length) {
        c1 = new Calendar({ trigger: '#submit-date-fr' })
        c2 = new Calendar({ trigger: '#submit-date-to' })
        attachSelectDateEvent(c1, c2, 1);
    };

    if ($('#register-date-fr').length) {
        c3 = new Calendar({ trigger: '#register-date-fr' })
        c4 = new Calendar({ trigger: '#register-date-to' })
        attachSelectDateEvent(c3, c4, 2);
    };


    if ($('#judge-date-fr').length) {
        c5 = new Calendar({ trigger: '#judge-date-fr' })
        c6 = new Calendar({ trigger: '#judge-date-to' })
        attachSelectDateEvent(c5, c6, 3);
    };


    var calendars = { '#submit-date-fr': c1, '#submit-date-to': c2, '#register-date-fr': c3, '#register-date-to': c4, '#judge-date-fr': c5, '#judge-date-to': c6 }
        //案件状体
    var statusMap = require('common/statusMap');
    var paymentStatusMap = require('common/paymentStatusMap');
    var validatorExp = Validator.use('#mycase-form', '.JS-target-date');

    //组件：查询
    var searchListExp = SearchList.use('.searchList', {
        map: function(data) {
            var i = 0;
            for (; i < data.length; i++) {
                if (data[i].status) {
                    if (data[i].caseType === "payment_order") {

                        data[i].statusEx = paymentStatusMap[data[i].status];
                        data[i].amount = util.formatMoney(data[i].amount, 2);

                    } else {
                        data[i].statusEx = statusMap[data[i].status];
                        data[i].amount = util.formatMoney(data[i].amount, 2);
                    }
                }
            }
            return data;
        }
    });

    new advancedQuery()

    function doSearch() {
        searchListExp[0].searchListReload();
    }

    //添加事件
    delegate.on('click', '#search', function() {
        doSearch();
    });

    //清空设置
    delegate.on('click', '#reset', function() {
        $(":reset").trigger('click');
        $.each("#submit-date-fr #submit-date-to #register-date-fr #register-date-to #judge-date-fr #judge-date-to".split(" "), function() {
            if (calendars[this.toString()]) {
                calendars[this.toString()].trigger("selectDate");
            }
        });
         $('[data-role="class"]').trigger('change'); 
        $("#submit-date-fr, #submit-date-to, #register-date-fr, #register-date-to, #judge-date-fr, #judge-date-to").prop("disabled", "");
    });

    new SwitchFilterBtn({ element: '#filterCondition' }).on('switchSuccess', function() {
        doSearch();
    });

    new SwitchFilterBtn({ element: '#filterOrderBy' }).on('switchSuccess', function() {
        doSearch();
    });


    $(".JS-trigger-click-clear").on('click', function(e) {
        $.each($(e.target).data("clear").split(" "), function() {
            $(this.toString()).val("");
        });

        $.each($(e.target).data("clear").split(" "), function() {
            calendars[this.toString()].trigger("selectDate");
        });
    })

    //为案件查询列表添加事件
    delegate.on('click', '.JS-trigger-action',function(e){
      var action = $(e.target).data('action');
      if(action == 'javascript'){
        Modal.confirm('提醒', '请确认是否不再庭审，确认后案件将不能再庭审', function(){
           new Ajax({
              request: "/suit/legalCaseRpc/endScheduleLegalcase.json?securityCaseId="+encodeURIComponent($(e.target).data('securityid'))
            }).on('ajaxSuccess', function(rtv, msg, con){
              doSearch();
            }).submit();
        });
      }else if(action == 'trial_court_send_message'){
        Modal.confirm('提醒', '是否确认提醒当事人？', function(){

            new Ajax({
                request: "/court/CourtRpc/sendPutProofEndMessage.json?securityId="+encodeURIComponent($(e.target).data('securityid')), 
                autoSuccessAlert: true
            }).on('ajaxSuccess', function(rtv, msg, con){
              
            }).submit();

          });
        }

    });

    // 邮件焦点问题
    delegate.on('click', '.child-nav li', function() {
        $(this).addClass('active').siblings().removeClass('active');
    });

    $('select[data-role="class"]').trigger('change');

    // 举证期限
    new Ajax({
        element: '#suit-content',
        autoDestroy: false,
        events: {
            // 结束举证
            'click [data-role="putProofEnd"]': function(e){
                var me = this;
                // 去掉链接的默认操作
                e.preventDefault();
                // 设置RPC请求
                me.set('request', '/account/mySuitRpc/putProofEnd.json');
                // 设置请求参数
                me.set('param', $(e.target).data('param'));
                Modal.confirm('结束举证期限', '请确认是否提前结束举证', function(){
                    // 发送请求
                    me.submit();
                }, null, {sureBtnText: '确认结束'});
            },
            // 延迟举证期限
            'click [data-role="putProofDayDelay"]': function(e){
                e.preventDefault();
                var me = this;
                me.set('request', '/account/mySuitRpc/putProofDelay.json');
                var param = $(e.target).data('param');
                var list = param.list = [];
                for(var i = 0; i < param.putProofDayDelayMax - ~~param.putProofDayDelay;){
                    list[i] = ++i;
                };
                list.length === 1 && ( param.one = true );
                me.dia = Dialog.showTemplate('#chose-day', param, {
                    width:240,
                    events: {
                        // 弹出层当中的确定
                        'click [data-role="submit"]': function(){
                            me.set('parseForm', this.element);
                            me.submit();
                        }
                    }
                });
            }
        }
    }).on('ajaxSuccess', function(val, msg, request){
        var me = this;
        Modal.alert(1, msg, function(){
            // 当前页面刷新
            searchListExp[0].searchListAjax();
        });
        // 隐藏弹出层，如果有的话
        me.dia && me.dia.hide();
    });
});