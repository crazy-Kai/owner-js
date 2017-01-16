"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var Validator = require('common/validator'),
        domUtil = require('common/domUtil'),
        Modal = require('model/modal/main'),
        Ajax = require('model/ajax/main'),
        RealTime = require('model/realTime/main');

    //组件：提交
    new Ajax({
        element: '#page-param',
        "autoDestroy": false,
        events: {
            'click .JS-trigger-click-submit': function(){
                var me = this;
                if( !Validator.oneExecute('#objectionTable') ){
                    Modal.confirm('提示 ', '提交后无法修改，确认提交么？', function(){
                        me.submit();
                    });
                }
            }
        }
    }).on('ajaxSuccess', function(){
        domUtil.redirect(this.get('jump'));
    });

    //组件：输入
    new RealTime({ element: '#objectionTable' });


});