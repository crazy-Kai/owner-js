"use strict";
/**
 * 业务:通知书[domain/index]
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var Validator = require('common/validator'),
        Ajax = require('model/ajax/main'),
        PerChecked = require('model/perChecked/main');

    //组件:确认
    new PerChecked({
        element: '#page-check'
    }).after('psCheckedNext', function(flag){   
        if(flag){
            new Ajax({
                element: '#page-param',
                autoSuccessAlert: true
            }).on('ajaxSuccess', function(){
                window.close();
            }).submit();
        }
    })
});