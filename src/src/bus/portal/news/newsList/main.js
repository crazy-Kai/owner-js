"use strict";
/**
 * 业务：案件查询[suit/caseSearch]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var SearchList = require('model/searchList/main');

	//组件：查询
	SearchList.use('.searchList');

});