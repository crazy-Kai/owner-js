'use strict';

define(function (require, exports, module) {
	//依赖
	var React = require('react'),
	    Reflux = require('reflux'),
	    util = require('common/util'),
	    ListenToActions = require('./listenToActions');

	var ListenToStore = Reflux.createStore({
		listenables: [ListenToActions],
		init: function init() {
			this.onGetInitData();
		},
		onGetInitData: function onGetInitData() {
			var me = this;
			util.getInitData('../data.json').then(function (data) {
				me.trigger({
					type: "init",
					value: data
				});
			}).catch(function (err) {
				console.log(err);
			});
		},
		onDataChange: function onDataChange(newData) {
			console.log(11);
			var me = this;
			newData.id ? me.onModify(newData) : me.onAdd(newData);
		},
		onAdd: function onAdd(newData) {
			console.log(11);
			var me = this;
			newData.id = util.mathRandom(500);
			me.trigger({
				type: "add",
				value: newData
			});
		},
		onModify: function onModify(newData) {
			var me = this;
			me.trigger({
				type: "modify",
				value: newData
			});
		},
		onDelete: function onDelete(delData) {
			var me = this;
			me.trigger({
				type: 'delete',
				value: delData
			});
		}

	});
	module.exports = ListenToStore;
});