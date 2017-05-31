"use strict";
/**
 * 业务:通知书[domain/index]
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		delegate = require('common/delegate'),
        Dialog = require('common/dialog'),
        handlerbars = require('common/handlerbars'),
        Ajax = require('model/ajax/main'),
        tinymceUse = require('common/tinymce'),
		domUtil = require('common/domUtil'),
		Scroller = require('common/scroller'),
		Tab = require('model/tab/main'),
		ImgView = require('model/imgView/main'),
		CountDown = require('model/countDown/main');

	// 变量
	var evidenceOppugnNav = $('#evidenceOppugnNav');

	if(evidenceOppugnNav.length){
		var EvidenceOppugnEnd = new require('bus/suit/oppugn/evidenceOppugnEnd/main');
		new EvidenceOppugnEnd({fixClassName: 'go-nav-fix go-nav-fix-det'});
	}else{
		// 组件滚动条
		Scroller.use('.JS-need-scroller');
		// 组件：图片查看
		new ImgView();
	}
	
	//查询撤诉书文本
	function queryAndOpen(element){
        new Ajax({
            request: "/court/lassenSuitWithdrawalRpc/queryWithdrawalDocument.json", 
            paramName:"withdrawalDocMap",
            param: $(element.target).data("sendParam")
        }).on('ajaxSuccess', function(rtv, msg, con){
        	if(rtv){
        		rtv.securityDocId = $(element.target).data("sendParam").securityDocId;
        	}
            var param = $(element.target).data("sendParam");
            openFullTextDialog(rtv, param);
        }).submit();
    }

	//打开撤诉书编辑对话框
    function openFullTextDialog(fullTextContent, param){
        var temp = handlerbars.compile('#template-full-text', true),
            html = temp(fullTextContent);
        var dialog = new Dialog({content:html, width:800, 
                    events:{
                        'click .JS-trigger-click-save' : function(e){
                            var me = this;
                            me.$("#content").val( tinymce.get("content").getContent());

                            new Ajax({
                                    request: "/court/lassenSuitWithdrawalRpc/saveWithdrawalDocument.json", 
                                    paramName:"withdrawalDocMap",
                                    param: $.extend(param, {content : me.$("#content").val()}),
                                    autoSuccessAlert: true
                            }).on('ajaxSuccess', function(rtv, msg, con){
                                    tinymce.remove('#content');
                                    me.hide();
                            }).submit();
                            
                        },
                        'click .JS-trigger-click-send' : function(e){
                            var me = this;
                            me.$("#content").val( tinymce.get("content").getContent());
                            new Ajax({
                                    request: "/court/lassenSuitWithdrawalRpc/resendWithdrawalNofity.json", 
                                    paramName:"withdrawalDocMap",
                                    param: $.extend(param, {content : me.$("#content").val()}),
                                    autoSuccessAlert: true
                            }).on('ajaxSuccess', function(rtv, msg, con){
                                    tinymce.remove('#content');
                                    me.hide();
                            }).submit();
                        }
                    }
            }).after('show', function(){
                var me  = this;
                tinymceUse({
                    selector: '#content',
                    init_instance_callback: function(eb){
                       me._setPosition();
                    }
                });
            }).after('hide',function(){
                this.destroy();
            }).show();
    }

    //事件：再次发送
    delegate.on('click', '.JS-trigger-click-sendagain', function(element){
        queryAndOpen(element);
    });


});