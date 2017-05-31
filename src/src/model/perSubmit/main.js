"use strict";
/**
 * 查询列表组件
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var MyWidget = require('common/myWidget'),
		Modal = require('model/modal/main');

	//类
	var PerSubmit = MyWidget.extend({
		//类名
		clssName: 'PerSubmit',
		//属性
		attrs: {
			"request": "", //接口
			"paramParse": MyWidget.K,  //
			"paramName": null,
			"autoDestroy": true, //自我销毁
		},
		//初始化数据
		initProps: function(){

		},
		//入口
		setup: function(){
					
		},
		//提交
		psSubmit: function(){
			var me = this,
				paramName = me.get('paramName');
			me.http( me.get('request'),
			paramName ? me.paseParam(paramName, me.serialize( me.element, me.get('paramParse') )) : me.serialize( me.element, me.get('paramParse') ), 
			function(err, rtv, msg, con){
                if(err){
                    Modal.alert(0, err);
                    me.trigger('ajaxError', rtv);
                }else{
                    Modal.alert(1, msg);
                    me.trigger('ajaxSuccess', rtv, msg, con);
                }
                //请求：自我销毁
				me.get('autoDestroy') && me.destroy();
            } );
			return me;
		}
	});


	return PerSubmit

});