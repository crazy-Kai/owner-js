"use strict";
/**
 * 查询列表组件
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var PerSearch = require('model/perSearch/main'),
		Modal = require('model/modal/main'); //提示框

	//类
	var SearchList = PerSearch.extend({
		//类名
		clssName: 'SearchList',
		events: {
			'click .JS-click-reload': 'searchListReload',
			// 点击删除
			'click .JS-trigger-click-delete': function(e){
				var me = this,
					target = me.jQuery(e.target);
				Modal.confirm('提示', '确认要删除么？', function(){
					me.http(me.get('requestDelete'), target.data('param'), 'post', function(err, rtv, msg, response){
						if(err){
							Modal.alert('错误', err);
						}else{
							me.trigger('deleteSuccess', rtv, msg, response, target);
						}
					});
				});
			},
			// 点击编辑
			'click .JS-trigger-click-editor': function(e){
				var me = this,
					target = me.jQuery(e.target);
				me.http(me.get('requestEditor'), target.data('param'), 'post', function(err, rtv, msg, response){
					if(err){
						Modal.alert('错误', err);
					}else{
						me.trigger('editorSuccess', rtv, msg, response, target);
					}
				});
			}
		}
	});

	return SearchList

});