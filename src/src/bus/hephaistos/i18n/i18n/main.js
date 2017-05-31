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
		Ajax = require('model/ajax/main'),
		ModalEditor = require('model/modalEditor/main');//弹出编辑框

	//组件:查询列表
	var searchListExp = SearchList.use('.searchList', {
		onDeleteSuccess: function(rtv, msg, response, target){
			//点击删除后确认后的会掉
			doSucess(msg);
		},
		onEditorSuccess: function(rtv, msg, response, target){
			//点击编辑后的内容回写
			modalEditorExp.set('title', target.prop('title'));
			rtv.id = rtv.securityId;
			modalEditorExp.modalEditorWriteback(rtv);
		}
	});

	//组件:多选
	Selectpicker.use('.selectpicker');

	 
	//组件:弹出编辑框
	var modalEditorExp = new ModalEditor({trigger: '#addI18N', element: '#addI18NModal'}).on('modalEditorSuccess', function(rtv, msg, response){
		//比那几成功后的会掉
		doSucess(msg);
	}).after('modalEditorReset', function(){		 
	});

	// 函数:成功后的回调
	function doSucess(msg){
		Modal.alert('成功', msg);
		searchListExp[0].searchListReload();
	}
	$("#refreshI18N").on("click",function(){
		new Ajax({
                request: "/hephaistos/i18nRpc/refresh.json",
            }).on('ajaxSuccess', function(rtv, msg, con){
            	Modal.alert('成功', msg);
				searchListExp[0].searchListReload();
            }).submit();
    });
});