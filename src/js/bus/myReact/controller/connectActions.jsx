define(function(require,exports,module){
 "use strict"
 	//依赖
 	var React = require('react'),
 		Reflux = require('reflux'),
 		ConnectActions = Reflux.createActions({add:{},getTarget:{},
 			getData:{
 				asyncResult:true,
 				preEmit:function(){
 					$.ajax({
	                    url:'../data.json',
	                    type: 'get',
	                    dataType: 'json',
	                    success:function(data){	ConnectActions.getData.completed(data)},
	                    error:function(data){this.failed}
	                   
	                });

 				}
 			}
 		});
 		module.exports = ConnectActions;
})