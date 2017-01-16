"use strict";
/**
 * 组件：选择法条
 * 2015,06,28 邵红亮
 */
define(function(require, exports, module) {

	// 依赖
	var MyWidget = require('common/myWidget'),
		Ajax = require('model/ajax/main'),
		Handlerbars = require('common/handlerbars');
		
	// 类
	var CascadeSelect = MyWidget.extend({
		// 类名
		clssName: 'CascadeSelect',
		// 属性
		attrs: {
			element: '.cascadeSelect',
			deptUserJson: null,
			needInit: false
		},
		// 事件
		events: {
			'change select[data-child]': function(e){
				e.preventDefault();
				var me = this,
					target = me.jQuery(e.target);

				var child = target.data('child'), 
					parent = target.data('parent'),
					currentChild = child,
					childList = currentChild.split(' ');
				
				if(target.val()){
					//将当前元素以及所有的父节点元素放到堆栈里
					var regions = new Array();
					regions.push({name: target.prop('name'), value: target.val()});
					while(parent){
						var parentNode =  me.jQuery("select[name='" + parent+"']")
						if(parentNode.val()){
							regions.push({name: parent, value: parentNode.val()})
						}
						parent = parentNode.data('parent');
					}
					
					//对于当前元素的每一个子节点，
					for(var i in childList){
						var aChild = childList[i],
							currentRegion = regions.concat(); //数组的copy

						var code = currentRegion.pop(),
						list = me.get("deptUserJson");
						//获得子节点数据列表
						while(code){
							var current =  me.jQuery("select[name='" + code.name +"']"),
								id = current.data('id'), //获取列表中id字段的名称。
								cld = current.data('child'),
								cldList = (cld? cld.split(" "): ""),
								ChildJson = cldList.length > 1 ? aChild : cld; //如果一个元素的data-child设置了多个值，用逗号分隔，且这些子节点将会成为叶子节点
							var ChildJsonListName = me.jQuery(generateSelector(ChildJson)).data('listName');
								ChildJson =  (ChildJsonListName ? ChildJsonListName : ChildJson);
							$.each(list, function(i, item){
								if(item[id] == code.value){
									list = item[ChildJson];
								}
							});
							code = currentRegion.pop();
						} 
						var childT = me.jQuery(generateSelector(aChild)),
							id = childT.data('id');
							childT.html(getOptionHandler(id, '',(me.get('isInit')? childT.data('defaultValue') : ''))(list));
					}
				}else{
					//清空所有当前元素子节点
					for(var i in childList){
						var aChild = childList[i];
						me.jQuery("select[name='" + aChild+"']").html('<option value=""></option>');
					}
				}
				
				//子节点的子节点
				child = me.jQuery("select[name='" + currentChild +"']").data('child');
				//清空所有子节点
				while(child){
					var childList = child.split(' ');
					var childNode = me.jQuery("select[name='" + child+"']")
					if(childNode){
						childNode.val();
						childNode.html('<option value=""></option>');
					}
					child = childNode.data('child');
				}
			}
		},

		setup : function(){
			var me = this;
			//初始化第一个select控件
			if(me.get("needInit")){
				me.set('isInit', true);
				var firstSelect = me.element.find('select').eq(0)
				firstSelect.html(getOptionHandler(firstSelect.data('id'), '', firstSelect.data('defaultValue'))(me.get("deptUserJson")));
				// firstSelect.trigger('change');
				// 邵红亮FIXED
				me.element.find('select').trigger('change');
				me.set('isInit', false);
			}
			
		}
		
	});
	
	//option 列表 handlerbar
	function getOptionHandler(id, name, defaultValue){
		var options = Handlerbars.compile([
			'<option value=""></option>',
			'{{#each this}}',
            '<option value={{',
				id ? id : "id",
			'}}',
			generateSelected(id ? id : "id", defaultValue),
			'>',
            '{{',
				name ? name: "name",
			'}}',
            '</option>',
            '{{/each}}'
		].join(''))
		return options;
	}

	//默认值
	function generateSelected(id, defaultValue){
		if(defaultValue){
			if(!isNaN(defaultValue)){
				return ['{{#isEqual ', id , ' ', defaultValue, '}} selected {{/isEqual}}'].join('');
			}else{
				return ['{{#isEqual ', id , ' "', defaultValue, '"}} selected {{/isEqual}}'].join('');
			}
		}else{
			return '';
		}
	}
	
	//形成选择器
	function generateSelector(name){
		return ["select[name='", name,"']"].join('');
	}

	return CascadeSelect

});