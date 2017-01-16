"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		limit = require('common/limit'),
		Paginator = require('model/paginator/main'),
		Ajax = require('model/ajax/main');

	var pageHbs = require('./page-hbs');

	//类
	var Page = MyWidget.extend({
		//组件：类名
		clssName: 'Page',
		//组件：属性
		attrs: {
			element: '#simCasePage',
			pageParam: '#pageParam',
			size: 5,
			showTitle: ['全部结果', '全部支持', '部分支持', '全部驳回']
		},
		//组件：事件
		events: {
			'click [data-trigger="type"]': function(e){
				var me = this,
					self = $(e.target),
					type = self.data('type');
				// me.$('[name="staticType"]').val(type);
				me.$('[data-target="show"]').html( me.get('showTitle')[~~type] );
				initPage.call(me, secondFormat.call(me, ''+type) );
			},
			'mouseenter .sim-select': function(e){
				var me = this;
				me.$('[data-target="list"]').removeClass('fn-hide');
			},
			'mouseleave [data-target="list"]': function(e){
				var me = this,
					self = $(e.target);
				me.$('[data-target="list"]').addClass('fn-hide');
			},
			'click [data-trigger="post"]': function(e){
				var me = this;
				e.preventDefault();
				fictionalPost.call(me, $(e.target).prop('href'));
			},
			'click [data-trigger="reSearch"]': function(e){
				var me = this;
				e.preventDefault();
				fictionalPost.call(me, $(e.target).prop('href'), true);
			}
		},
		//组件：初始化数据
		initProps: function(){

		},
		//组件：页面操作入口
		setup: function(){
			var me = this;
			me.ajax();
		},
		// 组件：触发请求
		ajax: function(){
			var me = this;
			new Ajax({
				request: '/suit/simCaseRpc/querySimCaseInfo.json',
				paramName: 'simCase',
				parseForm: me.get('pageParam'),
				autoErrorAlert: false
			}).on('ajaxSuccess', function(rtv){
				formatData(rtv);
				me.sourceData = rtv;
				initPage.call(me, rtv);
			}).on('ajaxError', function(){
				me.$('[data-target="content"]').html( pageHbs( {simCaseList: { }, statistics: {count: 0} } ) );
			}).submit();
		}
	});
	
	function formatData(data){
		var list = data.simCaseList.data = limit.whiteList(data.simCaseList.data, {winner: "1"}, {winner: "2"}, {winner: "3"});
		data.simCaseList.sourceList = list;
		data.simCaseList.count = data.statistics.count = list.length;
	};

	function secondFormat(type){
		var me = this,
			data = me.sourceData,
			list = data.simCaseList.data = type ? limit.whiteList(data.simCaseList.sourceList, {winner: type}) : data.simCaseList.sourceList;
		data.simCaseList.count = list.length;
		return data;
	};

	var paginatorExp;
	// 初始化分页
	function initPage(data){
		var me = this,
			size = me.get('size');
		if(paginatorExp){
			paginatorExp.destroy();
		};
		// 补充数据
		if( !data.simCaseList.data ){
			data.simCaseList.data = [];
		};
		if(data.simCaseList.count){
			paginatorExp = new Paginator({
				element: me.$('.paginator'),
				size: size,
				totle: data.simCaseList.count
			}).on('change', function(index){
				parseHtml.call( me, data, index );
			});
		};
		parseHtml.call( me, data, 1 );
	};

	// 渲染
	function parseHtml(data, index){
		var me = this,
			size = me.get('size');
		data.simCaseList.list = data.simCaseList.data.slice( (index - 1)*size, index*size );
		me.$('[data-target="content"]').html( pageHbs(data) );
	};

	// 模拟POST提交
	function fictionalPost(url, flag){
		var me = this,
			form = document.createElement('form'),
			obj = me.serialize( me.get('pageParam') );
		form.action = url;
		!flag && (form.target = "_blank");
        form.method = "post";
        limit.each(obj, function(val, name){
        	var input = document.createElement('input');
        	input.type = 'hidden';
        	input.name = name;
        	input.value = val;
        	form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        $(form).remove();
	};

	return Page;
    
});