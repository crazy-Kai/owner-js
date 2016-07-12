"use strict";

define(function (require, exports, module) {
	//依赖
	var React = require('react'),
		util = require('common/util'),
	    Reflux = require('reflux');
	var ListenToActions = Reflux.createActions(['dataChange', 'getInitData', 'delete']);

	module.exports = ListenToActions;
});