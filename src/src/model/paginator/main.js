"use strict";
/**
 * 分页组件
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget');

	//变量
	var $ = MyWidget.jQuery,
		handlerbars = MyWidget.handlerbars;

	//模板
	//焦点样式:active 不可用样式:disabled
	var template = handlerbars.compile([
		'<nav class="clearfix">',
	      	'<ul class="pagination" style="float:left;">',
		        '<li class="JS-click-prev {{#isEqual nowTarget 1}}disabled{{/isEqual}}" data-label="prev"><a href="javascript:;" aria-label="Previous"><span aria-hidden="true">«</span></a></li>',
		        '{{#each list}}',
		        '<li class="JS-click-active {{#isEqual this ../nowTarget}}active{{/isEqual}} {{#isEqual this "..."}}other{{/isEqual}}" data-now-target="{{this}}"><a href="javascript:;">{{this}}</li>',
		        '{{/each}}',
		        '<li class="JS-click-next {{#isEqual nowTarget totle}}disabled{{/isEqual}}" data-label="next"><a href="javascript:;" aria-label="Next"><span aria-hidden="true">»</span></a></li>',
	     	'</ul>',
	     	'<div style="float:left;margin-left:5px;margin-top:20px;" class="form-group-sm">',
	     		'共 {{count}} 条',
	     		' <input type="text" class="form-control JS-target-page" style="display:inline-block;width:50px;" />',
	     		' <button class="btn btn-primary btn-sm JS-click-jump" style="vertical-align:top;">跳 转</button>',
	     	'</div>',
	   	'</nav>'
	].join(''));

	//函数

	//类
	var Paginator = MyWidget.extend({
		//类名
		clssName: 'Paginator',
		//属性
		attrs: {
			totle: 100,//总数量
			size: 10,//每页数量
			nowTarget: 1,//当前第几页 1+
			minLength: 9,//最小长度
			className: 'paginator',
			diff: 3//差值
		},
		//事件
		events: {
			//焦点点击
			'click .JS-click-active': function(e){
				var me = this,
					node = MyWidget.closest(e.target, '.JS-click-active'),
					index = node.data('nowTarget');
				if(!node.hasClass('active') && !node.hasClass('other')){
					me.paginatorJump(index, e);
				}
			},
			//跳转
			'click .JS-click-jump': function(e){
				var me = this,
					index = ~~me.$('.JS-target-page').val();
				me.paginatorJump(index, e);
			},
			//上一个
			'click .JS-click-prev': 'paginatorPrevNext',
			//下一个
			'click .JS-click-next': 'paginatorPrevNext'
		},
		//初始化数据
		initProps: function(){
			var me = this;
			me.paginatorRenderData();
		},
		//入口
		setup: function(){
			var me = this;
			me.paginatorRender();
		},
		//更新数据
		paginatorRenderData: function(){
			var me = this,
				totle = me.get('totle'),
				size = me.get('size'),
				minLength = me.get('minLength'),
				nowTarget = me.get('nowTarget'),
				diff = me.get('diff'),
				paginatorData,
				paginatorMax,
				list,
				index = 1;
			//数据
			paginatorData = me.paginatorData = {};
			//总数据
			paginatorData.count = totle;
			//最大值
			paginatorMax = me.paginatorMax = paginatorData.totle = Math.ceil(totle/size);
			//当前值
			paginatorData.nowTarget = checkMaxMin(nowTarget, paginatorMax);
			//按钮
			list = paginatorData.list = [];
			// 1 ~ 9
			for(; index <= paginatorMax; index++){
				//页数少的情况
				if(paginatorMax <= minLength){
					list.push(index);
				}else{
					//头尾
					if( index === 1 || index === paginatorMax){
						if(nowTarget === index && index === paginatorMax){
							list.push('...');
							list.push(index - 2);
							list.push(index - 1);
						}
						list.push(index);
						if(nowTarget === index && index === 1){
							list.push(index + 1);
							list.push(index + 2);
							list.push('...');
						}
					}
					//开头端
					else if( index <= diff && index === nowTarget){
						index === diff && list.push(index - 1);
						list.push(index);
						list.push(index + 1);
						list.push('...');
					}
					//末尾端
					else if( index >= paginatorMax - diff + 1 && index === nowTarget){
						list.push('...');
						list.push(index - 1);
						list.push(index);
						index === paginatorMax - diff + 1 && list.push(index + 1);
					}
					//中间
					else if( index === nowTarget ){
						list.push('...');
						list.push(index - 1);
						list.push(index);
						list.push(index + 1);
						list.push('...');
					}
				}
			}
			return me;
		},
		//渲染DOM
		paginatorRender: function(){
			var me = this;
			//初始化模板
			me.element.html(template(me.paginatorData));
			return me;
		},
		//上一个下一个
		paginatorPrevNext: function(e){
			//陈志完fix587320， ie8下>>跳转到最后一页
			e.stopPropagation();
			var me = this;
			//事件对象是必须存在的
			if(e && e.target){
				var node = MyWidget.closest(e.target, '[data-label]'),
					label = node.data('label'),
					nowTarget = me.get('nowTarget'),
					index = label === 'prev' ? --nowTarget : ++nowTarget;//自增还是自减
				if(!node.hasClass('disabled')){
					//最大最小
					me.paginatorJump(index, e);
				}
			}else{
				me.log('缺少事件对象。');
			}
		},
		paginatorJump: function(index, e){
			var me = this;
			index = checkMaxMin(index, me.paginatorMax);
			me.set('nowTarget', index);
			me.paginatorRenderData().paginatorRender();
			me.trigger('change', index, e);
			return me;
		},
		//重置
		paginatorReload: function(config){
			var me = this;
			//重置
			me.resetConfig(config);
			me.paginatorRenderData().paginatorRender();
			return me;
		}
	});

	//函数:确定最大最小值
	function checkMaxMin(index, max){
		index >= max && ( index = max );
		index < 1 && (index = 1);
		return index;
	}

	return Paginator

});

