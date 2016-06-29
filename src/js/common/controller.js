"use strict";

define(function (require, exports) {

	// 依赖
	var Reflux = require('common/reflux');
	var limit = require('common/limit2.0');
	var Ajax = require('model/ajax/main');
	var REX = /on([A-Z]\w*)/;
	var Promise = limit.promise();

	return function (config) {
		var Actions = Reflux.createActions(limit.map(limit.filter(limit.keys(config), function (val) {
			return REX.test(val);
		}), function (val) {
			return val.replace(REX, '$1').toLowerCase();
		}));
		config.listenables = [Actions];
		config.updateComponent = function () {
			var me = this,
			    store = me.getInitialState();
			return new Promise(function (resolve) {
				me.trigger(store, resolve);
			});
		};
		config.ajax = function (config) {
			return new Promise(function (resolve, reject) {
				new Ajax(config).on('ajaxSuccess', resolve).on('ajaxError', reject).submit();
			});
		};
		var Store = Reflux.createStore(config);
		return { Store: Store, Actions: Actions };
	};
});