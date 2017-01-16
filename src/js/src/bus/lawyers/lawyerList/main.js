"use strict";
/**
 * 业务：律师服务[lawyers/lawyerList]
 * 
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		FilterConditions = require('model/filterConditions/main'),
		Modal = require('model/modal/main'),
		Handlebars = require('handlebars'),
		Ajax = require('model/ajax/main'),
		SearchList = require('model/searchList/main');

	//组件：
	new FilterConditions({element: '#filter-conditions'}).on('change', function(){
		searchListExp[0].searchListReload();
	});

	//组件：查询
	var searchListExp = SearchList.use('.searchList', {
		onAjaxSuccess: function(respone){
			this.$('.JS-target-totle').html(respone.count);
		}
	});

	// 定义模板
	var templateArea = Handlebars.compile(
		'{{#each this}}\
		<span class="child-labelbox">\
            <label class="JS-target-label"><input type="radio" name="areaCode" value="{{areaCode}}" class="child-radio JS-trigger-click">{{getAreaByAreaCode areaCode}}</label>\
        </span>\
        {{/each}}'
	);

	// 定义节点
	var areaContent = $('#areaContent');

	// 初始化城市
	function initAreaByAreaCode(){
		new Ajax({
			request: '/portal/LawyerServiceRpc/getAllFirmAreaCode.json'
		}).on('ajaxSuccess', function(rtv, msg, con){
			areaContent.append(templateArea(rtv));
		}).submit();
	};

	initAreaByAreaCode();

	//城市，更多和收起
	$('[data-action="toggleStatus"] span').on('click', function(e){
		var target =  $('[data-action="toggleStatus"]'); 
		if(target.find('.kuma-icon-triangle-down').size() > 0){
			$('#areaContent').removeClass('fn-H30');
			target.find('a').text('收起');
			target.find('.kuma-icon-triangle-down').addClass('kuma-icon-triangle-up').removeClass("kuma-icon-triangle-down");
		}else{
			$('#areaContent').addClass('fn-H30');
			target.find('a').text('更多');
			target.find('.kuma-icon-triangle-up').addClass('kuma-icon-triangle-down').removeClass("kuma-icon-triangle-up");
		}
	});
});