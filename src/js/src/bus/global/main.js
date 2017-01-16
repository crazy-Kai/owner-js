"use strict";
/**
 * 业务：全局[global]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		constant = require('common/constant'),
		limit = require('common/limit'),
		domUtil = require('common/domUtil'),
		dialog = require('common/dialog'),
		delegate = require('common/delegate'),
		PlaceHolder = require('model/placeHolder/main'),
		imgViewGlobal = require('model/imgView/global'),
		PostMessage = require('model/postMessage/main');

	new imgViewGlobal();
	
	//变量
	var WIN = window,
		DOC = document,
		documentMode = DOC.documentMode,
		REX_AMOUNT = /^(?:\d+\.|\d+\.\d{1,2}|\d+)$/,
		REX_AMOUNT_GET = /\d+(?:\.\d{1,2})?/;
 
	// 导航固定
	new (require('model/mainnav/main'));

	//组件：占位符
	$('[placeholder]').each(function(){
		new PlaceHolder( { element:this, shadowTextCss: {left:'10px',top:'1px'} } );
	});


	//函数：最大长度
	function maxlength(){
		var self = $(this),
			length = self.attr('maxlength');
		setTimeout(function(){
			var val = self.val();
			if( val.length > length ){
				self.val( val.slice(0, length) );
			}
			//IE9下触发一下input校准
			self.trigger('realTime');
		}, 0);
	}

	//函数：
	function setAmount(){
		var self = $(this);
		setTimeout(function(){
			var val = self.val();
			if( val && !REX_AMOUNT.test(val) ){
				self.val( val.match(REX_AMOUNT_GET) ? val.match(REX_AMOUNT_GET)[0] : '' );
			}
		}, 0);
	}

	//事件：导航查询支持'enter'
	delegate.on('keypress', '.JS-trigger-keypress-search', function(e){
		if(e.charCode === 13){
			domUtil.redirect(constant.getUrl('suitCaseSearch')+"?caseInfo="+ encodeURIComponent($(".JS-trigger-keypress-search").val()));
		}
	});

	//事件：查询
	delegate.on('click', '.JS-trigger-clcik-search', function(){
		domUtil.redirect(constant.getUrl('suitCaseSearch')+"?caseInfo="+ encodeURIComponent($(".JS-trigger-keypress-search").val()));
	});


	//事件：登陆
	delegate.on('click', '.JS-trigger-click-login', function(){
		var dialogIframe = WIN.dialogIframe = dialog.show('/login.htm', {width: 380, height:380}).after('hide', function(){
			postMessageExp.destroy();
		});
		var postMessageExp = new PostMessage();
		postMessageExp.add(function(data){
			if(data.type === 'successLogin'){
				$('#login-success').after('<span><a href="/suit/newMySuit.htm#personInfo" target="_blank" class="fn-color-0073bf underline">'+data.userName+'</a></span> <a href="/loginOut.do" class="underline">退出</a>');
		        $('#login-success').remove();
		        $('.fast_register').remove();
		        dialogIframe.hide();
			};
		});
		
	});

	//事件：IE8，IE9下输入框对maxlength的兼容性处理
	if( documentMode && (documentMode === 8 || documentMode === 9) ){
		//keypress的触发点，比较弱。
		delegate.on('keydown', '[maxlength]', maxlength);
		delegate.on('paste', '[maxlength]', maxlength);
	}

	//事件：金额
	delegate.on('keydown', '[name="amount"],[data-type="amount"]', setAmount);
	delegate.on('paste', '[name="amount"],[data-type="amount"]', setAmount);

	// 全局判断CHROME
	if(!domUtil.isWebkit){
		var node = $('<div class="fn-LH25 fn-color-666 fn-BGC-f2f2f2 fn-TAC" style="height:0;overflow:hidden;top:0">目前网上法庭在线视频庭审只支持Google Chrome浏览器，需要进入庭审请使用Google Chrome浏览器，<a class="global-link" target="_blank" href="http://dlsw.baidu.com/sw-search-sp/soft/9d/14744/ChromeStandalone_V45.0.2454.99_Setup.1442891522.exe">下载地址</a></div>');
		$('body').prepend(node);
		node.animate({height:25});
		$('.bodyer').css({"min-height": "calc(100vh - 365px)"});
	};

	// 如果是手机用户就弹出提醒
	function checkPhoneUser(){
		var userAgentInfo = navigator.userAgent;
		return limit.some(['Android', 'SymbianOS', 'iPhone', 'Windows Phone'], function(val){
			return userAgentInfo.indexOf(val) !== -1;
		});
	};
	if( checkPhoneUser() ){
		alert('建议在电脑上使用Chrom访问本站，以保证显示正确');
	};

	

});