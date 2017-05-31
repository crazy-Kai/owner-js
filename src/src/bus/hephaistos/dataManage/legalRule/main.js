"use strict";

define(function(require, exports, module) {

	//依赖
	var $ = require('$');
	var SearchList = require('model/searchList/main');//查询列表
	var Selectpicker = require('model/selectpicker/main');//单选，多选
	var Modal = require('model/modal/main'); //提示框
	var ModalEditor = require('model/modalEditor/main');//弹出编辑框

	//组件:多选
	Selectpicker.use('.selectpicker');

	//组件:查询列表
	var searchListExp = SearchList.use('.searchList', {
		onDeleteSuccess: function(rtv, msg, response, target){
			doSucess(msg);
		},
		onEditorSuccess: function(rtv, msg, response, target){
			//点击编辑后的内容回写
			modalEditorExp.set('title', target.prop('title'));
			$("#legalRule_name").val( rtv.name );
			$("#legalRule_securityId").val( rtv.securityId );
			modalEditorExp.modalEditorWriteback(rtv);
		}
	});

	//组件:弹出编辑框
	var modalEditorExp = new ModalEditor({trigger: '#addLegalRule', element: '#legalRuleModal'})
	//成功保存
	.on('modalEditorSuccess', function(rtv, msg, response){
		doSucess(msg);
	})
	//验证之前
	.before('modalEditorExecute', function(){
		var me = this;
		//设置编辑器的值
	})
	//重置表单之后
	.after('modalEditorReset', function(){
		var me = this;
		
	});


	function addBasis(securityId){
		alert(securityId);
	}

	// 函数:成功后的回调
	function doSucess(msg){
		Modal.alert('成功', msg);
		searchListExp[0].searchListReload();
	}
});