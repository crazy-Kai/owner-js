define(function(require,exports,module){
 "use strict"
 	//依赖
 	var React = require('react'),
 		Reflux = require('reflux'),
 		ConnectActions = Reflux.createActions([
 			'add',"getTarget"
 		]);

 		module.exports = ConnectActions;
})