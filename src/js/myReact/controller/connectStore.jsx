define(function(require,exports,module){
	"use strict"
	//依赖
	var React = require('react'),
		Reflux = require('reflux'),
		ConnectActions = require('./connectActions'),
		ConnectStore = Reflux.createStore({
			listenables:[ConnectActions],
			isShow:false,
			onAdd:function(){
				var me =this;
				console.log(me)
				me.trigger({
					boxStyle:{
						display:me.isShow ? "none" : "block"
					}
				},function(){
						console.log(11111)
					me.isShow = !me.isShow;

				})
			},
			onGetTarget:function(e){
				console.log($(e.target).attr('data-reactid'))
			}
		})

 return  ConnectStore;
})