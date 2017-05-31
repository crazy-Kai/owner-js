"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    require('bus/global/main');
    var $ = require('$'),
    	ImgView = require('model/imgView/main');
    	
	// 组件：图片查看
	new ImgView();

    // [退回]&[预立案通过]
    new ( require('./preFilingCaseBtn') )();

    // 悬浮层
    new ( require('./suspendedLayer') )({element: '#preFilingCaseBtn'})
    
});