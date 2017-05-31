"use strict";
/**
 * 业务：案件查询[suit/caseSearch]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		FilterConditions = require('model/filterConditions/main'),
		SearchList = require('model/searchList/main');


	var statusMap = require('common/statusMap'),
    	multiple = {
		"no_plaintiff_qualification" : "原告主体资格不符",
		"no_defendant" : "无明确的被告或被告主体资格不符",
		"no_request" : "无具体诉讼请求，事实和理由",
		"no_range" : "不属于民事诉讼范围",
		"no_mycourt" : "不属于本院管辖",
		"no_proof" : "没有新的事实和证据重新起诉",
		"no_sue" : "依法在一定期限内不得起诉的案件",
		"other" : "其他"
	};

	function getReasons(code, remark, status){
		var result = [];
		if(code){
			var codes = code.split(',');
			for(var c =0; c<codes.length; c++){
				if(result.length > 0){
					result.push(", ");
				}
				if( codes[c] == 'other' && remark){
					result.push(remark);
				}else{
					result.push(multiple[codes[c]]);
				}
			}
		}
		if(status=="return"){
			result.unshift('退回原因：');
		}else if(status=="not_accepted"){
			result.unshift('不予受理原因：');
		}

		return result.join('');
	}

	//组件：查询
	var searchListExp = SearchList.use('.searchList', {
		map: function (data) {
			var i = 0;
			for (; i < data.length; i++) {
				if (data[i].status) {
					data[i].statusEx = statusMap[data[i].status];
				}

				if(data[i].reason){
					data[i].reasonEx = getReasons(data[i].reason, data[i].remark, data[i].status);
				}
			}
			return data;
		}
	});

	//组件：
	new FilterConditions({element: '#filter-conditions'}).on('change', function(){
		searchListExp[0].searchListReload();
	});

	$("#search").on('click', function(){
		searchListExp[0].searchListReload();
	});


	//案件状态，更多和收起
	$('[data-action="toggleStatus"] span').on('click', function(e){
		var target =  $('[data-action="toggleStatus"]'); 

		if(target.find('.kuma-icon-triangle-down').size() > 0){
			$('.JS-tirgger-more').removeClass('fn-hide');
			target.find('a').text('收起');
			target.find('.kuma-icon-triangle-down').addClass('kuma-icon-triangle-up').removeClass("kuma-icon-triangle-down");
		}else{
			$('.JS-tirgger-more').addClass('fn-hide');
			target.find('a').text('更多');
			target.find('.kuma-icon-triangle-up').addClass('kuma-icon-triangle-down').removeClass("kuma-icon-triangle-up");
		}
	});


});