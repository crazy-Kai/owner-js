"use strict";
/**
 * 获取公司列表
 * 2015,11,11 邵红亮
 */
define(function(require, exports, module) {

	// 依赖
	var $ = require('$'),
		domUtil = require('common/domUtil'),
		util = require('common/util'),
		Handlerbars = require('common/handlerbars'),
		Ajax = require('model/ajax/main'),
		MyWidget = require('common/myWidget'),
		//模板
		tpl = require('./properties-hbs');

	// 类
	var SelectProperty = MyWidget.extend({
		// 组件：类名
		clssName: 'selectProperty',
		// 组件：属性
		attrs: {
			className: 'select-property',
			width: 300,
			top: 1,
			left: 0,
			timeout: 500
		},
		events: {
			'click td': function(e){
				var me = this,
					ele = me.$(e.target).closest('tr');	
					console.log(ele.data('key'), ele.data('value').toString());
					me.get('parentTr').find('[name="propertyKey"]').val(ele.data('key'));
					if(typeof(ele.data('value'))=='object'){
					me.get('parentTr').find('[name="value"]').val(JSON.stringify(ele.data('value')));
					}else{
					me.get('parentTr').find('[name="value"]').val(ele.data('value'));
					}
					me.triggerNode.trigger('blur');
			}
		},
		initProps: function(){
			var me = this;
			// 重定向父元素
			me.set( 'parentNode', me.triggerNode.parent() );
			me.set( 'parentTr', me.triggerNode.closest('tr') );
		},
		setup: function(){
			var me = this,
				DOC = $(document),
				timeId;
			// 注册事件
			domUtil.onChange(me.triggerNode, function(){
				me.delayGetCompanyList();
			});
			// 获取焦点
			me.triggerNode.on('focus', function(){
				DOC.trigger('click.SelectProperty');
				me.delayGetCompanyList();
				DOC.on('click.SelectProperty', function(){
					me.removeDataAndHideList();
					DOC.off('click.SelectProperty');
				});
			});
			me.triggerNode.on('click', function(e){ e.stopPropagation() });
			// 
			// 渲染
			me.render();
		},
		destroy: function(){
			var me = this;
			// 解绑事件
			domUtil.offChange(me.triggerNode);
			me.triggerNode.off('click').off('focus');
			SelectProperty.superclass.destroy.call(me);
		},
		// 销货数据
		removeDataAndHideList: function(){
			var me = this;
			me.element.hide();
		},
		// 延迟获取公司列表
		delayGetCompanyList: function(){
			var me = this;
			me.element.show();
			// 设置位置
			me.setCompanyLayout();

			clearTimeout(me.timeId);
			me.timeId = setTimeout(function(){
				me.getCompanyListByName();
			}, me.get('timeout'));
			return me;
		},
		// 获取公司列表
		getCompanyListByName: function(){
			var me = this,
				name = me.triggerNode.val();
			if(name&&name.length>3){
				new Ajax({
					request: '/hephaistos/i18nRpc/query.json',
					param: {searchKey: name},
					needPop: false,
					method: 'ajax'
				}).on('ajaxSuccess', function(content){
					
					
					if(content.length){
						 me.cacheData =content;
						//me.element.show();
						// 设置位置
						//me.setCompanyLayout();
						// 触发请求
						me.element.html(tpl(content));
					}else{
						me.removeDataAndHideList();
					};
				}).submit();
			}else{
				me.removeDataAndHideList();
			};
			//me.element.html( tpl({}) );

		},
		// 设置布局
		setCompanyLayout: function(){
			var me = this,
				pos = me.triggerNode.position();
			// 设置宽度
			me.element.width( me.get('width') || me.triggerNode.outerWidth() );
			// 设置相对于触发器的位置
			me.element.css('top', pos.top + me.triggerNode.outerHeight() + me.get('top'));
			me.element.css('left', pos.left + me.get('left'));
		}
	});


	return SelectProperty;

});