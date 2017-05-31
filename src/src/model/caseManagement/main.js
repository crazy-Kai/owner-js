"use strict";
/**
 * 原被告的增删改查
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {
    
    //依赖
    var $ = require('$'),
        MyWidget = require('common/myWidget'),
        Multiple = require('model/multiple/main'),
        ImgView = require('model/imgView/main'),
        Handlerbars = require('common/handlerbars'),
        util = require('common/util'),
        Ajax = require('model/ajax/main'),
        Scroller = require('common/scroller'),
        Modal = require('model/modal/main'), //提示框
        CascadeSelect = require('model/cascadeSelect/main'), //提示框
        Validator = require('common/validator');

    //类
    var CaseManagement = MyWidget.extend({
        //组件：类名
        clssName: 'CaseManagement',
        //组件：属性
        attrs: {
            element: 'body',
            multiple: null,
            theConclusion: null,
            multipleMap: null,
            buttonSave: '<input type="button" class="fn-btn fn-btn-primary fn-btn-sm fn-W60 JS-trigger-click-save" value="保存"/>',
            buttonCommitSyn: '<input type="button" class="fn-btn fn-btn-primary fn-btn-sm fn-W70 JS-trigger-click-commit-syn" value="提交同步"/><span class="fn-PL5 fn-color-F00">您好！提交后便进入审判系统进行立案。<span>'
        },
        //组件：事件
        events: {
            'change [name="conclusion"]': function(e){
                var me = this,
                    node = $(e.target);
                //如果审查结论是退回
                if(node.val() === 'return' ||　node.val() === 'not_accepted'){
                    //显示
                    me.show('#multiple');
                    //可用
                    me.disabledFalse(node.next());
                }else{
                    //隐藏
                    me.hide('#multiple');
                    //不可用
                    me.disabledTrue(node.next());
                }

                //显示隐藏编辑案号
                if(node.val() === 'make'){
                    //显示
                    if($('input[name="fromTongdahai"]').val() == 'y'){
                        $("#remarkTr").addClass('fn-hide');
                        $("#buttonTd").html(buttonCommitSyn);
                    }else{
                        me.show('#caseCodeTr');
                    }
                }else{
                    //隐藏
                    if($('input[name="fromTongdahai"]').val() == 'y'){
                        $("#remarkTr").removeClass('fn-hide');
                        $("#buttonTd").html(buttonSave);
                    }else{
                        $("[name='caseCode'], [name='dept'], [name='trialCourt'], [name='clerk']").val("");
                        $("[name=dept]").trigger("change");
                        me.hide('#caseCodeTr');
                    }
                }
            },
            'click .JS-trigger-click-save': function(){
                var me = this;
                me.valExp.execute(function(isErr, errList){
                    if(!isErr){
                        var reasonStr = $("input[name='reason']").val(),
                            conclusion = $("select[name='conclusion']").val();
                        if(reasonStr && reasonStr.indexOf('other') >=0 && !$("textarea[name='remark']").val()){
                            if(conclusion === 'not_accepted'){
                                Modal.alert(0, '选择其他"不予受理"原因，备注不能为空。');
                            }else if(conclusion === 'return'){
                                Modal.alert(0, '选择其他"退回"原因，备注不能为空。');
                            }
                        }else{
                            var submitAjax = new Ajax({
                                    element: '#caseManage-form',
                                    autoSuccessAlert: true,
                                    autoDestroy: false
                                }).on('ajaxSuccess', function(rtv, msg, res){
                                    // 2015.12.17刷新页面让头上的页签正确显示
                                    location.reload();
                                    //2015.07.29邵红亮修改
                                    //if(rtv.conclusion == "make"){
                                    rtv.conclusionExp = me.get('theConclusion')[rtv.conclusion];
                                    var arr = [];
                                    rtv.reason && util.breakEachArr(rtv.reason.split(','), function(val){
                                        arr.push(me.get('multiple')[val] );
                                    })
                                    

                                    //2015.08.03 设置【立案时间】
                                    if( rtv.gmtModified && $('[name="conclusion"]').val() === 'make' ){
                                        me.$("#fillingTime").text(dateToString(new Date(rtv.gmtModified)))
                                    }

                                    rtv.reason = arr.join(',');
                                    this.element.replaceWith( me.templateCaseManage(rtv) );
                                    //}
                                });

                            (conclusion === "make") ? Modal.confirm('提醒', '<span style="font-size:13px;font-weight:bold;">立案后不可跳回，确定要立案吗？</span>', function(){
                                submitAjax.submit();
                            }) : submitAjax.submit();
                        }
                    }
                });
            },
            'click .JS-trigger-click-commit-syn': function(){
                var me = this;
                me.valExp.execute(function(isErr, errList){
                    if(!isErr){
                        var reasonStr = $("input[name='reason']").val(),
                            conclusion = $("select[name='conclusion']").val();
                        if(reasonStr && reasonStr.indexOf('other') >=0 && !$("textarea[name='remark']").val()){
                            if(conclusion === 'not_accepted'){
                                Modal.alert(0, '选择其他"不予受理"原因，备注不能为空。');
                            }else if(conclusion === 'return'){
                                Modal.alert(0, '选择其他"退回"原因，备注不能为空。');
                            }
                        }else{
                            var commitSynAction = new Ajax({
                                    request:'/court/courtHandlerRpc/courtFileByYunjia.json?',
                                    paramName: "lassenCourtFilingVo",
                                    param:{securityCaseId:encodeURIComponent($("input[name='securityCaseId']").val()), courtId:encodeURIComponent($("input[name='courtId']").val())},
                                    autoSuccessAlert: true
                                }).on('ajaxSuccess', function(){
                                    location.reload();
                                    $("#caseManage-form").replaceWith($("#template-caseManage-syn").html());
                                });

                            (conclusion === "make") ? Modal.confirm('提醒', '<span style="font-size:13px;font-weight:bold;">立案后不可跳回，确定要立案吗？</span>', function(){
                                commitSynAction.submit();
                            }) : commitSynAction.submit();
                        }
                    }
                });
            },            
            'change [name="trialCourt"]': function(e){
                var me = this;
                var trialCourt = $(e.target);
                me.$('[name="trialCourtName"]').val(trialCourt.find('option:selected').text()); 
            },
            'change [name="clerk"]': function(e){
                var me = this;
                var clerk = $(e.target);
                me.$('[name="clerkName"]').val(clerk.find('option:selected').text()); 
            },
            'change [name="dept"]': function(e){
                var me = this;
                var dept = $(e.target);
                me.$('[name="deptName"]').val(dept.find('option:selected').text()); 
                me.$('[name="clerkName"]').val('');
                me.$('[name="trialCourtName"]').val('');
            },
            'click .JS-trigger-more-information': function(e){
                var me = this;
                me.$("#court-more-information").removeClass("fn-hide");
                //组件：滚动条
                Scroller.use('.JS-need-scroller'); 
                me.$(e.target).parent().remove();
            }
        },
        //组件：初始化数据
        initProps: function() {
            var me = this;
            me.templateCaseManage = Handlerbars.compile('#template-caseManage', true);
            //添加校验
            me.valExp = Validator.use('#caseManage-form');
        },
        //组件：页面操作入口
        setup: function() {
            var me = this;
            new ImgView();
            if (me.$("select[name='conclusion']").size() == 0 && me.$("#multiple")){
                var code= me.$("#multiple").data("reason");
                if(code!=null && code!=""){
                    me.$("#multiple").html(me.getReasons(code));
                }
            }

            if(me.$("select[name='conclusion']").size()>0){
                new Multiple({
                    trigger:'#multiple',
                    width: 420,
                    data: me.get('multipleMap')
                });
            }

            if(me.$(".cascadeSelect").size() > 0){
                var deptUserJson = me.$('[name="deptUserJson"]').val();
                new CascadeSelect({"deptUserJson": eval(deptUserJson), needInit: true});
            }
        },

        getReasons: function(code){
            var me = this;
            var description = "";
            if(code){
                var codes = code.split(',');
                for(var c =0; c<codes.length; c++){
                    if(description != ""){
                        description = description + ", " + me.get('multiple')[codes[c]];
                    }else{
                        description = me.get('multiple')[codes[c]];
                    }
                }
            }
            return description;
        }
    });

        //转义日期
    function dateToString(date) {
        if (date instanceof Date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month < 10 ? '0' + month: month;
            var day = date.getDate();
            day = day < 10 ? '0' + day: day;
            var hour = date.getHours();
            hour = hour < 10 ? '0' + hour: hour;
            var minus = date.getMinutes();
            minus = minus < 10 ? '0' + minus: minus;
            var seconds = date.getSeconds();
            seconds = seconds < 10 ? '0' + seconds: seconds;

            return '' + year + '-' + month + '-' + day + ' ' + hour + ':' + minus + ':' + seconds;
        }
        return '';
    }

    return CaseManagement;

});
