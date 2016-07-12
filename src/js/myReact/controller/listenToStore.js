'use strict';

define(function (require, exports, module) {
	//依赖
	var React = require('react'),
	    Reflux = require('Reflux'),
	    ListenToActions = require('./listenToActions');

	var ListenToStore = Reflux.createStore({
		listenables: [ListenToActions]

	});
});