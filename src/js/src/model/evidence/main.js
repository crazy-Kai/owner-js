"use strict";
/**
 * 组件：证据
 * 2015,06,28 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Validator = require('common/validator'),
		Dialog = require('dialog'),
		Upload = require('model/upload/main'),
		Modal = require('model/modal/main');

	//变量
	var $ = MyWidget.jQuery,
		handlerbars = MyWidget.handlerbars;

	//函数

	//类
	var Evidence = MyWidget.extend({
		//类名
		clssName: 'Evidence',
		//属性
		attrs: {
			dialogForm: '.JS-target-form',//弹出层
			dataTemple: '.JS-target-temple',//数据模板
			dataContent: '.JS-target-content',//数据展示
			pageParam: '#pageParam',//页面参数
			rpcSaveOrUpdate: '/suit/suitEvidence/saveOrUpdate.json',//保存更新接口 
			rpcSaveOrUpdateName: 'suitEvidenceDTo',//保存更新参数名
			rpcList: '/suit/suitEvidence/list.json',//列表
			rpcListName: 'paraMap',//查询列表
			rpcDelete: '/suit/suitEvidence/delete.json',//删除
			rpcDeleteName: 'paraMap',//删除
			rpcQuery: '/suit/suitEvidence/query.json',//查询一条
			rpcQueryName: 'paraMap'//查询一条
		},
		//事件
		events: {
			'click .JS-trigger-click-editor': 'evidenceEditor',
			'click .JS-trigger-click-add': 'evidenceAdd',
			'click .JS-trigger-click-delete': 'evidenceDel'
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//页面统一数据
			me.pageParam = me.serialize( $( me.get('pageParam') ) );
			//弹出层
			me.selectLawForm = me.$(me.get('dialogForm'));
			me.selectLawDialog = new Dialog({
				width: 420,
				content: me.selectLawForm,
				events: {
					'click .JS-trigger-click-submit': function(){
						me.validator.execute(function(flag, err){
							if(flag){
								me.log(err);
							}else{
								me.evidenceSubmit();
							}
						});
					}
				}
			}).render();
			me.selectLawDialog.after('hide', function(){
				me.evidenceClearForm();
			});
			//上传
			me.selectLawUpload = new Upload({trigger: me.selectLawDialog.$('.JS-target-upload')});
			//增加验证
			me.validator = Validator.use(me.selectLawForm);
			//模板
			me.selectLawTemple = handlerbars.compile( me.$(me.get('dataTemple')).html() );
			//展示
			me.selectLawContent = me.$(me.get('dataContent'));
		},
		//入口
		setup: function(){
			var me = this;
			//渲染数据
			me.evidenceDataRender();
		},
		//新增
		evidenceAdd: function(e){
			var me = this;
			me.evidenceDialogShow( me.closest(e.target, '.JS-trigger-click-add').prop('title') );
			return me;
		},
		//编辑
		evidenceEditor: function(e){
			var me = this,
				target = $(e.target);
			me.http(me.get('rpcQuery'), me.paseParam(me.get('rpcQueryName'), target.data('param')), function(err, rtv, msg, con){
				if(err){
					Modal.alert(0, err);
				}else{
					//表单回写
					me.unSerialize(me.selectLawForm, rtv);
					//上传回写
					me.selectLawUpload.set('list', $.map(rtv.uploadFileDos, function(val, key){
						return {
							name: val.fileName,
							id: val.securityId,
							url: val.url
						}
					}));
					me.selectLawUpload.uploadRenderList();
					me.evidenceDialogShow(target.prop('title'));
				}
			});
			return me;
		},
		//删除
		evidenceDel: function(e){
			var me = this,
				target = $(e.target);
			Modal.confirm('提示','确认要删除吗？', function(){
				me.http(me.get('rpcDelete'), me.paseParam(me.get('rpcDeleteName'), target.data('param')), function(err, rtv, msg, con){
					if(err){
						Modal.alert(0, err);
					}else{
						Modal.alert(1, msg);
						me.evidenceDataRender();
					}
				});
			});
			return me;
		},
		//显示弹出层
		evidenceDialogShow: function(title){
			var me = this;
			me.selectLawDialog.$('.JS-target-title').html(title||'');
			me.selectLawDialog.show();
			return me;
		},
		//隐藏弹出层
		evidenceDialogHide: function(title){
			var me = this;
			me.selectLawDialog.hide();
			return me;
		},
		//提交数据
		evidenceSubmit: function(){
			var me = this;
			me.http(me.get('rpcSaveOrUpdate'), me.paseParam(me.get('rpcSaveOrUpdateName'), $.extend(me.pageParam, me.serialize(me.selectLawForm))), 'post', function(err, rtv, msg, cont){
				if(err){
					Modal.alert(0, err);
				}else{
					Modal.alert(1, msg);
					me.evidenceDialogHide();
					me.evidenceDataRender();
				}
			});
			return me;
		},
		//数据渲染
		evidenceDataRender: function(){
			var me = this;
			me.ajax(me.get('rpcList'), me.paseParam(me.get('rpcListName'), me.pageParam), 'post', function(err, cont){
				if(err){
					Modal.alert(0, err);
				}else{
					me.get('pageStatus') && (cont.pageStatus = 'suit');
					// 如果只显示原告
					// if( me.get('onlyAccuser') ){
					// 	var tempArr = [];
					// 	me.breakEachArr(cont.data, function(val){
					// 		if(val.entityRole === 'accuser'){
					// 			tempArr.push(val);
					// 		}
					// 	});
					// 	cont.data = tempArr;
					// }
					me.selectLawContent.html( me.selectLawTemple(cont) );
				}
			});
		},
		//表单清楚
		evidenceClearForm: function(){
			var me = this;
			me.selectLawForm.find('.JS-target-input').val('');
			me.selectLawUpload.uploadRenderClear();
			return me;
		}
	});

	return Evidence

});