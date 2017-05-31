"use strict";
/**
 * 业务：支付令/被申请人送达确认
 * 2016,04,21 陈志文
 */
define(function(require, exports, module) {
	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
        sendConfirmHbs = require('./sendConfirm-hbs'),
	    Validator = require('common/validator'),
        Calendar = require('common/calendar'),
        Upload = require('model/upload/main'),
        domUtil = require('common/domUtil'),
        Ajax = require('model/ajax/main'),
        Tip = require('common/tip'),
        Dialog = require('common/dialog');
	   
    Tip.use($(".JS-need-tip"));

	//变量
    var sendConfirm = Dialog.show(sendConfirmHbs({}), {
    	width:450, autoDestroy:false, autoShow:false,
    	events: {
    		//保存
    		'click [data-role="sure"]': function(e){
                validatorExp.execute(function(flag, err){
                    if(!flag){
                        //$("input[name='scheduleTime']").val(new Date($("#holdHearing").val().replace(/-/g, '/')).getTime());
                        new Ajax({
                            request:'/paymentorder/documentConfirmRpc/saveDocumentConfirm.json?',
                            parseForm: $("#sendConfirm-form"),
                            autoErrorAlert: true,
                            //paramName: 'lassenDocumentConfirmDo',
                            param:{securityCaseId: $('input[name="securityCaseId"]').val()},
                            paramParse: function(json){
                                for(var i in json){
                                    if(typeof json[i] == 'object'){
                                        json[i] = JSON.stringify(json[i]);
                                    }
                                }
                                return json;
                            }
                        }).on('ajaxSuccess', function(){
                            location.reload();
                        }).submit();
                    }
                });
            }
    	}
    }).after('hide', function(){
        var me = this;
        domUtil.resetForm(me.$('#sendConfirm-form'));
        validatorExp.clearError();
        upload[0].uploadRenderClear();
    }).render();

    var validatorExp = Validator.use('#sendConfirm-form');
    //组件：上传
    var upload = Upload.use('.JS-need-upload');

	//变换审查结论
	$('[data-role="sendConfirm"]').on('click', function(){
		sendConfirm.show();
	});


    //再次发送
    $('[data-role="send-again"]').on('click', function(e){
        var param = $(e.target).data('param');
        new Ajax({
            request:'/paymentorder/paymentOrderRpc/sendAgainPaymentOrder.json',
            autoErrorAlert: true,
            param: param
        }).submit();
    });


    //组件：日期
    new Calendar({
        trigger: '.JS-need-calendar',
        showTime: false,
        range:function(date){
            var currentDate = (new Date()).getTime() - 1000*60*60*24;
            return date > currentDate;
        }
    });

});