"use strict";
/**
 * 模型
 */
define(function(require, exports, module) {
	
	// 依赖
	
	const Control = require('common/controller');

	// 隐藏方法 this.updateComponent().then();
	return Control({
		store: {
			a: 'a1'
		},
		getInitialState(){
			return this.store;
		},
		onAdd(){
			let me = this,
				store = me.store;
			me.ajax({
				request: '/portal/mediatorRpc/queryMediator.json',
				param: {filterMap: JSON.stringify({"cityId":"","mediatorType":"","page":{"begin":0,"length":8}})}
			}).then(() => {
				store.b = 'b2';
				me.updateComponent();
			}, () => {
				console.log('error');
			});
		}
	});

});