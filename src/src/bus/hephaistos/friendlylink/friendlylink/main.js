"use strict";
/**
 * 业务
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		SearchList = require('model/searchList/main'), //查询列表
		Modal = require('model/modal/main'), //提示框
		Selectpicker = require('model/selectpicker/main'),//单选，多选
		ModalEditor = require('model/modalEditor/main');//弹出编辑框

	//组件:查询列表
	var searchListExp = SearchList.use('.searchList', {
		onDeleteSuccess: function(rtv, msg, response, target){
			doSucess(msg);
		},
		onEditorSuccess: function(rtv, msg, response, target){
			modalEditorExp.set('title', target.prop('title'));
			modalEditorExp.modalEditorWriteback(rtv);
		}
	});

	//组件:多选
	Selectpicker.use('.selectpicker');

	//组件:弹出编辑框
	var modalEditorExp = new ModalEditor({trigger: '#addMedoatpr', element: '#medoatprModal'}).on('modalEditorSuccess', function(rtv, msg, response){
		doSucess(msg);
	});

	// 函数:成功后的回调
	function doSucess(msg){
		Modal.alert('成功', msg);
		searchListExp[0].searchListReload();
	}


});