"use strict";
/**
 * 业务：选择诉讼类型[lawsuit/start/chooseType]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	// 默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	// 依赖
	var $ = require('$');

	// 变量
	var JWIN = $(window),
		needPrint = $('#needPrint'),
		print = $('#print'),
		showEvidenceMenu = $('#showEvidenceMenu'),
		focus = showEvidenceMenu.find('[data-target="focus"]'),
		steps = $('[data-role="step"]');

	// 事件：左边的焦点
	JWIN.on('scroll', function(){
		var top = window.scrollY || document.documentElement.scrollTop,
			index = 0;
		steps.each(function(i){
			var self = $(this);
			if(self.offset().top - 30 < top){
				index = i;
			};
		});
		focus.removeClass('ch-focus').eq(index).addClass('ch-focus');
	});
	JWIN.trigger('scroll');

	// 事件：打印
	print.on('click', function(){
		var tempWin = window.open(),
			tempDoc = tempWin.document;

		tempDoc.open('about:blank');
		// console.log($('head').html());
		tempDoc.write('<!DOCTYPE html><html lang="en"><head>');
		tempDoc.write('<link rel="stylesheet" type="text/css" href="'+window.CONFIG.assetsLink+'/assets/css/main.css" />');
		tempDoc.write('<style type="text/css">body{font-size:18px;}.global-tab{font-size:20px;line-height:40px;margin-top:30px;}</style>');
		tempDoc.write('</head><body>');
		tempDoc.write(needPrint.html());
		tempDoc.write('</body></html>')
		tempDoc.close();
		function main(){
			$(tempDoc).find('[data-role="step"]').css('width', '100%');
			$(tempDoc).find('#showEvidenceMenu').remove();
			$(tempDoc).find('#print').remove();
			$(tempDoc).find('#printBox').remove();
			$(tempDoc).find('#logistics').css('height', 'auto');
			$(tempDoc).find('#logo').removeClass('fn-hide');
			$(tempDoc).find('#Inscription').removeClass('fn-hide');
			tempWin.print();
			tempWin.close();
		};
		tempWin.onload = main;
		tempDoc.readyState === 'complete' && main();
		
	});

});