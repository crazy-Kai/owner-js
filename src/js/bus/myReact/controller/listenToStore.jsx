'use strict';
define(function(require,exports,module){
	//依赖
	var React = require('react'),
		Reflux = require('reflux'),
		util = require('common/util'),
		ListenToActions = require('./listenToActions');

	var ListenToStore = Reflux.createStore({
		listenables:[ListenToActions],
		init:function(){
			this.onGetInitData();
		},
		onGetInitData:function(){
				var me = this;
				util.getInitData('../data.json')
				.then(function(data){
					me.trigger({
						type:"init",
						value:data
					})
				})
				.catch(function(err){
					console.log(err);
					
				})
		},
		onDataChange:function(newData){
			var me = this;
			newData.id ? me.onModify(newData) : me.onAdd(newData)
		},
		onAdd:function(newData){
		
			var me = this;
			newData.id = util.mathRandom(500);
			me.trigger({
				type:"add",
				value:newData
			})
		},
		onModify:function(newData){
			var me = this;
			me.trigger({
				type:"modify",
				value:newData
			})
		},
		onDelete:function(delData){
			var me = this;
			me.trigger({
				type:'delete',
				value:delData
			})
		}
		
	})
	module.exports = ListenToStore; 
})