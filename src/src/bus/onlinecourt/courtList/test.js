"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {


	var MyWidget = require('common/myWidget');

	return MyWidget.extend({
		setup: function(){
			console.log( this, 'test', this.get('aaa') );
		}
	});
	

});