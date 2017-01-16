"use strict";
/**
 * 查询列表组件
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Paginator = require('model/paginator/main'),
		Modal = require('model/modal/main'); //提示框

	//类
	var PerSearch = MyWidget.extend({
		//类名
		clssName: 'PerSearch',
		//属性
		attrs: {
			request: '/lassen/demo/test1Rpc/queryTest.json', //请求地址
			size: 10, //长度
			nowTarget: 1, //默认第几页
			param: null, //参数
			paramName: 'perSearch', //参数名
			template: null, //模板
			pageParentNode: null, //分页的父级节点
			autoStart: true,
			hidePage: false,
			map: MyWidget.K,//格式化数据
			mapResponse: MyWidget.K//格式化请求
		},
		//销毁
		destroy: function(){
			var me = this;
			//销毁内容
			me.content.empty();
			//销毁分页
			me.searchListPaginator && me.searchListPaginator.destroy();
			//销毁
			PerSearch.superclass.destroy.call(me);
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//序列化参数
			me.searchListSerilize();
			//容器
			me.content = me.$('.content');
			//模板
			me.template = MyWidget.handlerbars.compile( me.get('template') || me.$('.template').html() || '' );
		},
		//序列化参数
		searchListSerilize: function(){
			var me = this;
			//主参数
			me.searchListParam = MyWidget.serialize(me.$('.param'));
			$.extend(me.searchListParam, me.get('param'));
			var page = me.searchListParam.page = {};
			page.begin = (me.get('nowTarget') - 1) * me.get('size');
			page.length = me.get('size');
			return me;
		},
		//入口
		setup: function(){
			var me = this;
			//初始化请求
			me.get('autoStart') && me.searchListAjax();
			return me;			
		},
		//请求
		searchListAjax: function(flag){
			var me = this;
			MyWidget.ajax(me.get('request'), MyWidget.paseParam(me.get('paramName'), me.searchListParam) , 'post', function(err, response){
				if(err){
					Modal.alert(0, err);
					me.trigger('ajaxError', response);
				}else{
					var response = me.get('mapResponse')(response);
					if( response.success ){
						var	size = me.get('size'),
							data = me.get('map')(response.data);
						//内容
						me.content.html( me.template(data) );
						//如果是reload就销毁分页，在这里销毁是为了不让分页抖动
						flag && me.searchListDestroyPage();
						//初始化
						if( !me.get('hidePage') ){
							if(!me.searchListPaginator){
								me.searchListPaginator = new Paginator({
									parentNode: me.get('pageParentNode') || me.element,
									size: size,
									totle: response.count,
									nowTarget: me.get('nowTarget')
								}).on('change', function(index){
									me.searchListParam.page.begin = (index - 1) * me.get('size');
									me.searchListAjax();
								});
								response.count && me.searchListPaginator.render();
								me.set('count', response.count);
								//如果页面布局是律师服务页面的则更改分页器的摆放位置
								if(location.href.indexOf("lawyerDetail.htm")!== -1){
									$(".paginator").addClass("fn-ML215")
								}
							}else{
								//如果数值变化了重设全部值
								if( me.get('count') !== response.count ){
									me.searchListPaginator.paginatorReload({totle: response.count});
								}
							};
						};
						me.trigger('ajaxSuccess', response);
					}else{
						Modal.alert(0, response.errMsg);
						me.trigger('ajaxError', response);
					};
				}
			});
			return me;
		},
		//重置
		searchListReload: function(){
			var me = this;
			//重设分页
			me.searchListPaginator && me.searchListPaginator.set('nowTarget', 0);
			//重设参数，重新请求
			me.searchListSerilize().searchListAjax(true);
			return me;
		},
		//销毁分页
		searchListDestroyPage: function(){
			var me = this;
			//销毁分页
			me.searchListPaginator && me.searchListPaginator.destroy();
			delete me.searchListPaginator;
			return me;
		}
	});


	return PerSearch

});