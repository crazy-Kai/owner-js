/*
2016/4/20
page:送达详情页面
*/
define(function(require,exports,module){
	//默认依赖一个全局都引用的业务模块
    require('bus/global/main');
	//依赖
	var $ = require("$"),
	backdata = require('./backdata-hbs'),
	ImgView = require('model/imgView/main'),
	Ajax = require('model/ajax/main');
    var params = $('[name="securityId"]').val();
	//发送请求
	new Ajax({
		request:'/suit/accusedReceiveConfirmRpc/getDeliveryDetail.json',
		param:{securityId:params}
	}).on("ajaxSuccess",function(rtv){
		console.log(rtv)
		$("#contents").html(backdata(rtv));
	}).submit();
})