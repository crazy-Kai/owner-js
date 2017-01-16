define(function(require, exports, module) {

	require('bus/global/main');
	//依赖
    var $ = require('$'),
     delegate = require('common/delegate'),
     Ajax = require('model/ajax/main'),
     Modal = require('model/modal/main'); //提示框
    //事件：庭审排期
    delegate.on('click', '.JS-trigger-click-submit', function(){

    	if(!($("input[name='focus1']").val() || $("input[name='focus2']").val() || $("input[name='focus3']").val() || $("input[name='focus4']").val() || $("input[name='focus5']").val())){
			Modal.alert(0, '请输入至少一个问题');
			return;
    	}

		new Ajax({
			request: "/court/courtFocusRpc/submitCourtFocus.json?securityCaseId=" + encodeURIComponent( $("input[name='securityCaseId']").val() ),
			paramName: "courtFocusDo",
			parseForm: "#disputeFocus-form"
		}).on('ajaxSuccess', function(rtv, msg, con){
			Modal.alert(1, msg);
			// location.href = "disputeFocus.htm?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val());
		}).submit();
    });

});
