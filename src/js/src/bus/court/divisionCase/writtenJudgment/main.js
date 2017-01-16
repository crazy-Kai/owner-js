define(function(require, exports, module) {

    require('bus/global/main');
	//依赖
    var $ = require('$'),
    	Upload = require('model/upload/main'),
     	delegate = require('common/delegate'),
        Validator = require('common/validator'),
     	Ajax = require('model/ajax/main'),
        tinymceUse = require('common/tinymce');//编辑器

    var validatorExp = Validator.use('#writtenJudgment-form');

    tinymceUse({selector: '#content'});

    //事件：编写判决书
    delegate.on('click', '.JS-trigger-click-publish', function(){
    	$("input[name='division']").val('publish');
        validatorExp.execute(function(flag, err){
            if(!flag){
    	       handleAction();
            }
        })
    });

    delegate.on('click', '.JS-trigger-click-save', function(){
		$("input[name='division']").val('save');
		handleAction();
    });

    //鼠标覆盖时改变样式
    delegate.on('mouseover', '.JS-trigger-click-link', function(target){
		$(target.target).addClass("fn-btn-primary");
    });

    //鼠标离开时，改回样式
    delegate.on('mouseout', '.JS-trigger-click-link', function(target){
		$(target.target).removeClass("fn-btn-primary");
    });

	var uploadExp = Upload.use('.JS-trigger-click-upload');

    function handleAction(){
        $("#content").val( tinymce.get("content").getContent());
		new Ajax({
			request: "/court/lassenCourtJudgmentRpc/saveCourtJudgment.json?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val()), 
			paramName: "lassenCourtJudgmentVo",
			parseForm: $("#writtenJudgment-form")
		}).on('ajaxSuccess', function(rtv, msg, con){
			location.reload();
            // location.href = "writtenJudgment.htm?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val());
		}).submit();
    }

});
