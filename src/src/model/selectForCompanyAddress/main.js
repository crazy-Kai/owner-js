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
		MyWidget = require('common/myWidget');

	// 模板
	var tpl = Handlerbars.compile( [
		'<ul>',
			'{{#each this}}',
				'<li data-id="{{securityId}}">{{companyName}}</li>',
			'{{/each}}',
		'</ul>'
	].join('') );

	// 类
	var SelectForCompanyAddress = MyWidget.extend({
		// 组件：类名
		clssName: 'SelectForCompanyAddress',
		// 组件：属性
		attrs: {
			className: 'select-company',
			width: null,
			top: -1,
			left: 0,
			timeout: 500
		},
		events: {
			'click li': function(e){
				console.log(123);
				var me = this,
					id = $(e.target).data('id');
				domUtil.unSerialize(me.element.closest('.JS-target-company'), getDataById.call(me, id));
			}
		},
		initProps: function(){
			var me = this;
			// 重定向父元素
			me.set( 'parentNode', me.triggerNode.parent() );
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
				me.delayGetCompanyList();
				DOC.on('click.SelectForCompanyAddress', function(){
					me.removeDataAndHideList();
					DOC.off('click.SelectForCompanyAddress');
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
			SelectForCompanyAddress.superclass.destroy.call(me);
		},
		// 销货数据
		removeDataAndHideList: function(){
			var me = this;
			delete me.cacheData;
			me.element.hide();
		},
		// 延迟获取公司列表
		delayGetCompanyList: function(){
			var me = this;
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
			if(name){
				new Ajax({
					request: '/aeolus/lassenMaintenanceRpc/queryAeolusAccountsByCompanyName.json',
					param: {companyName: name},
					needPop: false,
					method: 'ajax'
				}).on('ajaxSuccess', function(content){
					var data = content.data;
					if(data.length){
						me.cacheData = data;
						me.element.show();
						// 设置位置
						me.setCompanyLayout();
						// 触发请求
						me.element.html( tpl(data) );
					}else{
						me.removeDataAndHideList();
					};
				}).submit();
			}else{
				me.removeDataAndHideList();
			};
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

	// 通过ID获取对应的数据
	function getDataById(id){
		var me = this,
			data,
			cacheData = me.cacheData;
		util.breakEachArr(cacheData, function(val){
			if(id === val.securityId){
				data = val;
				return true;
			};
		});
		// 对数据进行业务处理
		for(var i in data){
			data['lassenSuitEntityDo.'+i] = data[i];
			delete data[i];
		};
		return data;

	};

	return SelectForCompanyAddress;

});