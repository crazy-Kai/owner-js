"use strict";
define(function(require, exports, module) {

	// 依赖
	var $ = require('$'),
		limit = require('common/limit'),
		Cookie = require('common/cookie'),
		Reflux = require('reflux');


	// 数据入口
	var mainNode = $('#suit-content')

	var nav = mainNode.data('nav');

	var navData = firstNav();

	// Action
	var Actions = Reflux.createActions(['targetNav', 'loginOut']);
	
	// Stroe
	var Stroe = Reflux.createStore({
		listenables: [Actions],
		getInitialState: function(){
			return this.store;
		},
		store: {
			'head': mainNode.data('head'),
			'nav': nav,
			'navMap': mainNode.data('navMap'),
			'indexLink': '/portal/main/domain/index.htm',
			'loginOutLink': '/loginOut.do',
			'navKey': navData.firstKey,
			'iframeName': 'newMysuitIframe',
			'firstNav': navData.firstUrl
		},
		onTargetNav: function(e){
			var me = this,
				node = $(e.target),
				key;
			if( node.prop('target') !== '_blank' ){
				key = node.data('key');
				me.store.navKey = key;
				me.trigger(me.store);
				// 设置锚点
				window.location.hash = key;
			};
		},
		onLoginOut: function(){
			var me = this,
				toLoginOut = top.toLoginOut;
			// 后门入口
			limit.isFunction(toLoginOut) && toLoginOut();
			// 进入登出页面
			Cookie.setPath('/');
			Cookie.remove("InvestigationPID");
			window.location.href = me.store.loginOutLink;
		}
	});
	
	// 序列化nav
	function parseNav(){
		var firstKey,
			firstUrl,
			map = {};
		nav.forEach(function(val, index){
			val.forEach(function(val, key){
				if(val.val){
					if(!firstUrl){
						firstKey = val.key;
						firstUrl = val.val;
					};
					map[val.key] = val.val;
				};
				
			});
		});
		return {
			firstKey: firstKey,
			firstUrl: firstUrl,
			map: map
		};
	};

	// 获取第一个URL
	function firstNav(){
		var nav = parseNav(),
			map = {},
			hash = window.location.hash.slice(1),
			hashVal;
		if( hashVal = nav.map[hash] ){	
			map.firstKey = hash;
			map.firstUrl = hashVal;
		}else{
			map.firstKey = nav.firstKey;
			map.firstUrl = nav.firstUrl;
		}
		return map;
	};

	// 接口
	module.exports = {
		Actions: Actions,
		Stroe: Stroe,
		Reflux: Reflux
	};

});