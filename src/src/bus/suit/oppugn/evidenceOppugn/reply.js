"use strict";
/**
 * 业务：质证
 * 2015,09,02 邵红亮
 */
define(function(require, exports, module) {

	// 默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	// 依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		Validator = require('common/validator'),
		Ajax = require('model/ajax/main'),
		Upload = require('model/upload/main'),
		Modal = require('model/modal/main'),
		Dialog = require('common/dialog'),
		Tip = require('common/tip');

	// 回复模块
	var Reply = MyWidget.extend({
		// 类名
		clssName: 'Reply',
		// 配置
		attrs: {
			'evidenceOppugnSave': '/suit/evidenceOppugn/save.json',
			'evidenceOppugnGet': '/suit/evidenceOppugn/get.json'
		},
		// 事件委派
		events: {
			// 按钮回复
			'click .JS-trigger-click-reply': function(e){
				var me = this,
					target = me.jQuery(e.target);
				// 回复的弹出层
				var dialogExp = Dialog.showTemplate('#template-reply', {}, {
					events: {
						// 按钮提交
						'click .JS-trigger-click-save': function(){
							// 验证
							if( !Validator.oneExecute(dialogExp.contentElement) ){
								setAjax.call(me, dialogExp, target);
							};
						},
						// 选择框是否认可
						'change select[name="isAgree"]': function(e){
							useIsAgree( me.jQuery(e.target).closest('.JS-target-table') );
						}
					}
				}).before('hide', function(){
					// 销毁上传控件
					uploadExp.destroy();
				});
				// 初始化上传控件
				var uploadExp = new Upload({trigger: dialogExp.$('.JS-need-upload'), rule: '(\.jpg|\.jpeg|\.png|\.bmp)$', ruleErrMsg: '请上传后缀是jpg,jpeg,png,bmp的图片', accept: 'image/jpg, image/jpeg, image/png, image/bmp'});
				// 初始化元素
				useIsAgree( dialogExp.$('.JS-target-table') );
			},
			// 查看回复
			'click .JS-trigger-click-view': function(e){
				getView.call(this, e, '.JS-trigger-click-view', '#template-view');
			},
			// 按钮证据回复
			'click .JS-trigger-click-evidence-reply': function(e){
				var me = this,
					target = me.jQuery(e.target);
				// 回复的弹出层
				var dialogExp = Dialog.showTemplate('#template-evidence-reply', {}, {
					events: {
						// 选择框是否认可
						'change select[name="isAgree"]': function(e){
							useIsAgree( me.jQuery(e.target).closest('.JS-target-table') );
						},
						// 提交保存
						'click .JS-trigger-click-save': function(){
							if( !Validator.oneExecute(dialogExp.contentElement) ){
								setAjax.call(me, dialogExp, target);
							};
						}
					}
				}).before('hide', function(){
					// 销毁上传控件
					Upload.remove( dialogExp.$('.JS-need-upload') );
					// 销毁小提示
					Tip.remove( dialogExp.$('.JS-need-tip') );
				});
				// 初始化上传控件
				Upload.use( dialogExp.$('.JS-need-upload'), {rule: '(\.jpg|\.jpeg|\.png|\.bmp)$', ruleErrMsg: '请上传后缀是jpg,jpeg,png,bmp的图片', accept: 'image/jpg, image/jpeg, image/png, image/bmp'} );
				// 初始化小提示
				Tip.use(dialogExp.$('.JS-need-tip'), {zIndex:9999, arrowPosition: 9});
				// 初始化元素
				useIsAgree( dialogExp.$('.JS-target-table') );
			},
			// 查看证据回复
			'click .JS-trigger-click-evidence-view': function(e){
				getView.call(this, e, '.JS-trigger-click-evidence-view', '#template-evidence-view');
			}
		},
		// 私有属性
		initProps: function(){
			var me = this;
		},
		// 销毁
		destroy: function(){
			var me = this;

			// 父类的销毁
			Reply.superclass.destroy.call(me);
		}
	});

	// 函数
	function useIsAgree(tables){
		tables.each(function(){
			var table = $(this),
				flag = table.find('select[name="isAgree"]').val() === 'y',
				noAgree = table.find('.noAgree');
			// 隐藏显示不认可的内容
			noAgree[ flag ? 'addClass' : 'removeClass' ]('fn-hide');
			MyWidget[flag ? 'disabledTrue': 'disabledFalse'](noAgree);
		});
	};

	// 触发请求
	function setAjax(theDial, target){
		var me = this;
		Modal.confirm('警告', '您确定要提交吗？提交后不可修改。', function(){
			new Ajax({
				request: me.get('evidenceOppugnSave'),
				paramName: 'evidenceOppugnVos',
				autoSuccessAlert: true,
				parseForm: theDial.contentElement,
				param: target.data('param'),
				paramParse: function(data){
					var evidenceOppugnVos = data.evidenceOppugnVos;
					delete data.evidenceOppugnVos;
					me.breakEachArr(evidenceOppugnVos, function(val){
						$.extend(val, data);
					});
					return evidenceOppugnVos;
				},
				autoSubmit: true,
				onAjaxSuccess: function(rtv){
					var listBlock = target.closest('.JS-target-list-block');
					// 隐藏弹出层
					theDial.hide();
					// 更换显示文本
					listBlock.find('.JS-target-isanswer').html('您已回复');
					// 删除回复和那个回车
					target.next().remove();
					target.remove();
					// 回写几人回复
					listBlock.find('.JS-target-allanswer').html(rtv.allAnswerCount);
				}
			});
		});
			
	};

	// 获取请求
	function getView(e, btn, tpl){
		var me = this,
			target = me.jQuery(e.target).closest(btn);
		new Ajax({
			request: me.get('evidenceOppugnGet'),
			autoSubmit: true,
			param: target.data('param'),
			onAjaxSuccess: function(rtv, msg, req){
				Dialog.showTemplate(tpl, rtv);
			}
		});
	};


	// 接口
	module.exports = Reply;

});