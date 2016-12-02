'use strict';

define(function (require, exports, module) {
	"use strict";
	//依赖

	var React = require('react'),
	    Reflux = require('reflux'),
	    ConnectActions = require('./connectActions'),
	    ConnectStore = Reflux.createStore({
		listenables: [ConnectActions],
		isShow: false,
		onAdd: function onAdd() {
			var me = this;

			console.log(me.isShow);
			me.trigger({
				boxStyle: {
					display: me.isShow ? "none" : "block"
				}
			}, function (e) {
				console.log(e);
				me.isShow = !me.isShow;
				//方法一： trigger的回掉函数，等trigger后将me.isShow状态改成true;从而来用三目来切换数据状态！
			});

			// 方法二： me.isShow = !me.isShow;(trigger后把状态false改成true,下次调用此方法的时候就切换了数据的状态)
		},
		onGetTarget: function onGetTarget(e) {
			console.log($(e.target).attr('data-reactid'));
		}
	});

	//异步action获取后端数据的方法一：（利用action的completed()和failded()方法写在tore里）
	// init:function(){
	// 	var me = this;
	// 	ConnectActions.getData().then(function(data){
	// 		me.trigger({data:data})
	// 	}).catch(function(){
	// 		window.alert("获取数据失败了")
	// 	})
	// },
	//   onGetData:function(e){
	//   	var me = this;
	//   		$.ajax({
	//                   url:'../data.json',
	//                   type: 'get',
	//                   dataType: 'json',
	//                   success:function(data){	ConnectActions.getData.completed(data)},
	//                   error:function(data){ConnectActions.getData.failed(data)}           
	//               });
	//   }
	//异步action获取后端数据的方法二：（利用异步action的钩子方法preEmit()在action中用completed,failed方法发送ajax请求，然后在store里trigger数据）
	// init:function(){
	// 	var me = this;
	// 	ConnectActions.getData().then(function(data){
	// 		me.trigger({data:data})
	// 	}).catch(function(){
	// 		window.alert("获取数据失败了")
	// 	})
	// },
	//   onGetData:function(e){
	//   	var me = this;
	//   		
	//   }
	return ConnectStore;
});