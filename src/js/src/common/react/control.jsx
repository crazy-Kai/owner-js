"use strict";
define(function(require, exports) {

	// 依赖
	const Reflux = require('common/reflux');
	const limit = require('common/limit2.0');
	const Ajax = require('model/ajax/main');
	const REX = /on([A-Z]\w*)/;
	const Promise = limit.promise();

	return (config) => {
		let Actions = Reflux.createActions( limit.map(limit.filter(limit.keys(config), (val) => {
			return REX.test(val);
		}), (val) => {
			return val.replace(REX, '$1').toLowerCase();
		}) );
		config.listenables = [Actions];
		config.updateComponent = function(){
	    	let me = this,
	    		store = me.getInitialState();
	    	return new Promise(resolve => {
	    		me.trigger(store, resolve);
	    	});
	    };
	    config.ajax = (config) => {
	    	return new Promise( (resolve, reject) => {
	    		new Ajax( config ).on('ajaxSuccess', resolve).on('ajaxError', reject).submit();
	    	} );
	    };
		let Store = Reflux.createStore(config);
		return {Store, Actions};
	};

});