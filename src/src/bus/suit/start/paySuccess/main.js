
define(function(require, exports, module) {

	//依赖
   var $ = require('$'),
       Dialog = require('dialog');

        //组件：弹出框
   var dialogExp = new Dialog({
      content: '#dialog',
      width: "800px"
   });
   
   $("#paySuccess").on('click', function(){
      dialogExp.show();
   });
	
});
