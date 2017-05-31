define(function(require, exports, module) {
    require('bus/global/main');
	//依赖
    var $ = require('$'),
        delegate = require('common/delegate'),
        Calendar = require('common/calendar'),
        Dialog = require('common/dialog'),
        Validator = require('common/validator'),
        domUtil = require('common/domUtil'),
        Ajax = require('model/ajax/main'),
        Modal = require('model/modal/main');

    // 组件增加旁观者
    new (require('./addspectator'))();

    //添加庭审时间大于当前时间校验
    Validator.addRule('aftertoday', function(options) {
        var val = $.trim(options.element.val());
        if(!val){
            return true;
        }
        var currentDate = new Date();
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        return (new Date(val.replace(/-/g, '/'))).getTime() - currentDate.getTime() > 600000;

    }, '庭审排期应在当前时间之后');

    //变量
    var schedule = Dialog.showTemplate('#template-schedule', null, {
    	width:370, autoDestroy:false, autoShow:false,
    	events: {
    		//保存
    		'click .JS-trigger-click-save': function(){
                validatorExp.execute(function(flag, err){
                    if(!flag){
                        $("input[name='scheduleTime']").val(new Date($("#holdHearing").val().replace(/-/g, '/')).getTime());
                        new Ajax({
                            request:'/court/courtScheduleRpc/checkSchedule.json?securityCaseId="'+encodeURIComponent($("input[name='securityCaseId']").val()),
                            paramName: "courtScheduleDo",
                            parseForm: $("#courtSchedue-form"),
                            autoErrorAlert: false
                        }).on('ajaxSuccess', function(){
                            resetSchedule();
                        }).on('ajaxError', function(rtv, msg, con){
                            Modal.confirm('提示', rtv, function(){
                                resetSchedule();
                            });
                        }).submit();
                    }
                });
            }
    	}
    }).after('hide', function(){
        var me = this;
        domUtil.resetForm(me.$('#courtSchedue-form'));
        validatorExp.clearError();
    }).render();
    var validatorExp = Validator.use('#courtSchedue-form');

    var viewRecord = 
    //组件：日期
    new Calendar({
    	trigger: '#holdHearing',
    	showTime: true,
        range:function(date){
            var currentDate = (new Date()).getTime() - 1000*60*60*24;
            return date > currentDate;
        },
        showTimeParams: {
            showHour: true,
            showMinute: true, 
            showSecond: false
        },
        onSelectTime: function(){
            //触发验证
            setTimeout(function(){
                $('#holdHearing').trigger('blur');
            }, 0);
        }
    });

    //事件：提示框确认
    function resetSchedule(){
        new Ajax({
                request: $(".JS-trigger-click-schedule").data("request")+"?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val()), 
                paramName: "courtScheduleDo",
                parseForm: $("#courtSchedue-form")
            }).on('ajaxSuccess', function(rtv, msg, con){
                 location.href = "courtSchedue.htm?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val());
            }).submit();
    }

    //事件：庭审排期
    delegate.on('click', '.JS-trigger-click-schedule', function(){
        schedule.show();
    });

    delegate.on('click', '.JS-trigger-click-viewrecord', function(element){
        new Ajax({
            request: "/court/courtScheduleRpc/getRecord.json",
            param : $(element.target).data("param")
        }).on('ajaxSuccess', function(rtv, msg, con){
            Dialog.show( require('./viewrecord-hbs')(rtv), {width: 800} );
        }).submit();
    });

    //视频下载
    delegate.on('click', '.JS-trigger-download-video', function(element){
        var flag;
        var checkUrl = $(element.target).data('url');

        $.ajax({
            url: checkUrl,
            type: 'POST',
            data: {},
            cache: false,
            async: false
        }).done( function (res) {
            if(!res.hasError && res.content && res.content.isSuccess){
               return true;
            }else{
                if(res.content && res.content.message){
                    Modal.alert(0, res.content.message);
                }else{
                    Modal.alert(0, "系统繁忙，请联系管理员");
                }
                if ( element && element.preventDefault )          
                    element.preventDefault();      
                else          
                    window.event.returnValue = false; 
                return false; 
            };
        });
    });
    
});
