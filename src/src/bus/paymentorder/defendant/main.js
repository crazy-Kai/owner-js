/*
2016/4/20
page:送达详情页面
*/
define(function(require,exports,module){
	//依赖
	var $ = require("$"),
	backdata = require('./backdata-hbs'),
	ImgView = require('model/imgView/main'),
	Ajax = require('model/ajax/main');
    var params = $('[name="securityId"]').val();
	new Ajax({
		request:'/suit/accusedReceiveConfirmRpc/getDeliveryDetail.json',
		param:{securityId:params}
	}).on("ajaxSuccess",function(rtv){
		$("#contents").html(backdata(rtv));
	}).submit();
	new ImgView();
})