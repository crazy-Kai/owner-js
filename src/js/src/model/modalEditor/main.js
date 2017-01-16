"use strict";
/**
 * 弹出编辑框
 * 2015,06,17 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Modal = require('model/modal/main'),
		Validator = require('common/validator');

	//变量

	//类
	var ModalEditor = MyWidget.extend({
		//类名
		clssName: 'ModalEditor',
		//属性
		attrs: {
			request: '/hephaistos/mediatorRpc/queryMediator.json',
			paramName: 'paramName',
			title: null,
			autoReset: true
		},
		//事件
		events: {
			'click .JS-trigger-click-submit': 'modalEditorExecute'
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//设置trigger
			me.triggerNode = $( me.get('trigger') );
			//初始化表单
			me.form = me.$('.kuma-form');
			//初始化验证
			me.validator = new Validator({element: me.form});
		},
		//入口
		setup: function(){
			var me = this;
			//注册触发器的事件
			me.modalEditorBindEvent();
			//增加验证
			me.modalEditorAddValidator();
			//事件
			me.element.on('hidden.bs.modal', function(){
				me.get('autoReset') && me.modalEditorReset();
			});
		},
		//弹层的显示
		modalEditorShow: function(){
			var me = this,
				title = me.get('title');
			me.element.modal()
			title && me.$('.JS-target-title').html(title);
			return me;
		},
		//弹层的隐藏
		modalEditorHide: function(){
			var me = this;
			me.element.modal('hide');
			return me;
		},
		//注册触发器的事件
		modalEditorBindEvent: function(){
			var me = this;
			me.triggerNode.on('click', function(){
				me.set('title', me.triggerNode.prop('title'))
				me.modalEditorShow();
			});
			return me;
		},
		//增加验证
		modalEditorAddValidator: function(){
			var me = this;
			me.$('.kuma-input,select.kuma-select').each(function(){
				me.validator.addItem({element: this});
			});
			return me;
		},
		//触发验证
		modalEditorExecute: function(){
			var me = this;
			me.validator.execute(function(flag, list){
				if(flag){
					me.log('验证没过。', list);
				}else{
					me.modalEditorPostData();
				}
			});
			return me;
		},
		//重置表单
		modalEditorReset: function(){
			var me = this;
			//文本域
			me.$('[type="text"],textarea,.JS-need-clean').each(function(){
				this.value = '';
			});
			//checkbox
			me.$('input[type="checkbox"]').prop('checked', false);
			//选择框
			me.$('select.kuma-select').each(function(){
				if(this[0]){
					this[0].selected = true;
					me.jQuery(this).trigger('change');
				}
			});
			// 多选框
			me.$('[multiple="multiple"]').each(function(){
				var self = me.jQuery(this);
				self.val('请选择');
				self.data('selectpicker').refresh();
			});
			
			//Option 配置， 清除多余的行， 去掉当前行的校验
			me.$("#content").find('tr:gt(1)').each(function(index, item){
				$(item).find('[data-required="true"]').each(function(){
                    me.validator.removeItem($(this));
                });
				$(item).remove();
			});

			me.validator.clearError();
			return me;
		},
		//提交数据
		modalEditorPostData: function(){
			var me = this;
			me.http(me.get('request'), me.paseParam(me.get('paramName'), me.serialize(me.form)), 'post', function(err, rtv, msg, response){
				if(err){
					me.log(err);
					Modal.alert('错误', err);
				}else{
					me.trigger('modalEditorSuccess', rtv, msg, response);
					me.modalEditorHide();
				}
			});
			return me;
		},
		//回写数据
		modalEditorWriteback: function(data){
			var me = this;
			me.modalEditorShow();
			me.unSerialize(me.form, data);
			//选择框
			me.$('select.kuma-select').each(function(){
				me.jQuery(this).data('selectpicker').refresh();
			});
			// 多选框
			me.$('[multiple="multiple"]').each(function(){
				var self = me.jQuery(this),
					arr = data[self.prop('name')].split(',');
				self.val(arr);
				self.data('selectpicker').refresh();
			});
			return me;
		}
	});

	return ModalEditor

});