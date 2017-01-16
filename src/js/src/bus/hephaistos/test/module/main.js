"use strict";
/**
 * 业务
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		Paginator = require('model/paginator/main'), //分页
		SearchList = require('model/searchList/main'), //查询列表
		Modal = require('model/modal/main'), //提示框
		Selectpicker = require('model/selectpicker/main'),//单选，多选
		Upload = require('model/upload/main'); //上传

	//组件:分页
	var a = new Paginator({element: '#paginator', totle: 100});

	//组件:查询列表
	var b = new SearchList({
		element: '#searchList'
	});

	//组件:弹出框
	$('#modal').on('click', function(){
		Modal.alert('123', '456');
	});

	//组件:多选
	var c = Selectpicker.use('.selectpicker');
	
	//组件:上传
	Upload.use('.JS-trigger-click-upload');

});