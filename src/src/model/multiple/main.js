"use strict";
define(function(require, exports, module) {

	/*--依赖--*/
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		util = require('common/util.js'),
		Handlerbars = require('common/handlerbars');
	require('./multiple.css');

	/*--变量--*/
	var DOC = $(document),
		listCompile = Handlerbars.compile([
			'{{#each this}}',
            '<li>',
                '<label for="jsb-multiple-{{@index}}" title="{{key}}">',
                    '<input id="jsb-multiple-{{@index}}" type="checkbox" class="JS-trigger-single" name="multiple" value="{{value}}" data-param=\'{"key": "{{key}}", "value": "{{value}}"}\' {{#if checked}}checked="checked"{{/if}}/> {{key}}',
                '</label>',
            '</li>',
            '{{/each}}'
		].join('')),
		templateCompile = Handlerbars.compile([
			'<div class="jsb-multiple-content">',
				'<div class="jsb-multiple-head clearfix">',
					'<label for="jsb-multiple-all" class="fl">',
						'<input type="checkbox" class="jsb-multiple-all JS-trigger-all" id="jsb-multiple-all" /> 全选',
					'</label>',
					'{{#if filterInput}}<span class="fr">过滤：<input type="text" class="jsb-multiple-search da-input-text w100" /></span>{{/if}}',
				'</div>',
			    '<div class="jsb-multiple-list">',
			        '<ul class="JS-child-list clearfix">',
			        listCompile.source,
			        '</ul>',
			    '</div>',
			    '<div class="jsb-multiple-submit">',
			        '<input type="button" value="确 定" class="JS-trigger-submit fn-btn fn-btn-default fn-btn-mi" />',
			    '</div>',
			'</div>'
		].join(''));

	/*--类--*/
	var Multiple = MyWidget.extend({
		//类名
		clssName: 'Multiple',
		//属性
		attrs: {
			//是否需要实时过滤
			filterInput: false,
			//宽度
			width: null,
			//影子表单
			inputName: null,
			template: {
				getter: function(){
					return templateCompile( {filterInput: this.get('filterInput')} );
				}
			}, //模板
			data: [], //数据
		},
		//事件
		events: {
			'click': function(e){
				e.stopPropagation();
			},
			//提交
			'click .JS-trigger-submit': function(e){
				this.setVal(e).hide();
			},
			//全选
			'click .JS-trigger-all': function(e){
				var self = $(e.target);
				this.$('.JS-child-list [type="checkbox"]').prop('checked', self.prop('checked'));
			},
			//单选确定的全选
			'click .JS-trigger-single': function(e){
				this.isCheckAll();
			}
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//找到影子表单
			me.inputName = me.triggerNode.parent().find('[name="'+me.get('inputName')+'"]');
			//格式化数据 让隐藏表单里面的值可被选中
			me.formatDataByInput();
		},
		//销毁
		destroy: function(){
			var me = this;
			//以防玩意
			DOC.off('click.multiple');
			//如果有特殊事件
			me.get('filterInput') && me.$('.jsb-multiple-search').off('input.multiple');
			Multiple.superclass.destroy.call(this);
			return me;
		},
		//初始化入口
		setup: function(){
			var me = this;
			//渲染数据
			me.model( me.get('data') );
			//渲染到页面当中
			me.render();
			//隐藏
			me.hide();
			//触发节点的事件绑定
			me.delegateEvents(me.triggerNode, 'click',function(e){
				e.stopPropagation();
				me.show();
				DOC.on('click.multiple', function(){
					DOC.off('click.multiple');
					me.hide();
				});
			});
			//特殊的事件绑定
			me.get('filterInput') && me.$('.jsb-multiple-search').on('input.multiple', function(){
				me.model(me.dataFilter(this.value), true);
			});
			return me;
		},
		formatDataByInput: function(){
			var me = this,
				data = me.get('data'),
				inputVal = me.inputName.val(); 
				if(inputVal){
					me.breakEachArr(inputVal.split(','), function(arrVal, index){
						me.breakEachArr(data, function(val, key){
							if(arrVal == val.value){
								val.checked = true;
							}
						});
					});
				}
			return me;			
		},
		//是否选中全部
		isCheckAll: function(){
			var me = this,
				length = me.$('.JS-trigger-single').length;
			me.$('.JS-trigger-all').prop('checked', length && (length === me.$('.JS-trigger-single:checked').length));
			return me;
		},
		//数据过滤
		dataFilter: function(key){
			var me = this,
				arr = [],
				checkData = [],
				data = me.get('data');
			me.$('.JS-trigger-single:checked').each(function(){
				var self = $(this);
				checkData.push(self.data('param').value);
			});
			util.breakEachArr(data, function(val){
				//清洗数据
				delete val.checked;
				if(checkData.indexOf(val.value) !== -1){
					val.checked = true;
					arr.push(val);
				}else if(val.key.indexOf(key) !== -1){
					arr.push(val);
				}
			});
			return arr;
		},
		//数据解析
		model: function(arr, flag){
			var me = this;
			me.$('.JS-child-list').html(listCompile(arr));
			me.isCheckAll();
			if(!flag){
				me.set('data', arr);
				me.setVal();
			}
			return me;
		},
		setVal: function(e){
			var me = this,
				param = me.param();
			me.triggerNode.val(param.key.join(','));
			me.inputName.val(param.value.join(','));
			me.trigger('submit', param, e);
			return me;
		},
		param: function(){
			var me = this,
				rtv = {key:[], value:[]};
			me.$('[name="multiple"]:checked').each(function(){
				var self = $(this),
					param = self.data('param');
				rtv.key.push(param.key);
				rtv.value.push(param.value);
			});
			return rtv;
		},
		//显示
		show: function(){
			var me = this,
				trigger = me.triggerNode,
				pos = trigger.offset();
			me.element.css({
				top: pos.top + trigger.outerHeight() - 1,
				left: pos.left,
				width: me.get('width') || trigger.outerWidth() - 2,
				zIndex: me.get("zIndex") || 999999
			});
			me.element.show();
			return me;
		},
		//隐藏
		hide: function(){
			var me = this;
			me.element.hide();
			return me;
		}
	});

	/*--函数--*/

	/*--接口--*/
	module.exports = Multiple;

});