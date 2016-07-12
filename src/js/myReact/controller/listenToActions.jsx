"use strict"
define(function(require,exports,module){
	//依赖
	var React = require('react'),
	    Reflux = require('reflux');
	var ListenToActions = Reflux.createActions([
		'dataChange','getInitData','delete'	
		]) ;

	module.exports=ListenToActions;
})