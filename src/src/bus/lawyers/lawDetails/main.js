"use strict"
define(function(require,exports,module){


	//默认依赖一个全局都引用的业务模块
		require('bus/global/main');
	//依赖
	var $ = require('$'),
		Handlebars = require('handlebars'),
		SearchList = require('model/searchList/main');
	var searchListExp = SearchList.use('.searchList')
})