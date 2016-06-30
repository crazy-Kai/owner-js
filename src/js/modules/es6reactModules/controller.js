"use strict";
/**
 * 模型
 */

define(function (require, exports, module) {

	// 依赖

	var Control = require('common/controller');

	// 隐藏方法 this.updateComponent().then();
	return Control({
		store: {
			a: 'a1'
		},
		getInitialState: function getInitialState() {
			return this.store;
		},
		onAdd: function onAdd() {
			var me = this,
			    store = me.store;
			me.ajax({
				request: '/portal/mediatorRpc/queryMediator.json',
				param: { filterMap: JSON.stringify({ "cityId": "", "mediatorType": "", "page": { "begin": 0, "length": 8 } }) }
			}).then(function () {
				store.b = 'b2';
				me.updateComponent();
			}, function () {
				console.log('error');
			});
		}
	});
});