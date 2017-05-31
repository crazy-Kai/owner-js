"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	require('bus/global/main');
	//依赖
	var $ = require('$'),
	handlerbars = require('common/handlerbars'),
	Ajax = require('model/ajax/main'),
	Validator = require('common/validator'),
	ImgView = require('model/imgView/main'),
	CascadeSelect = require('model/cascadeSelect/main'), //级联选择
	Scroller = require('common/scroller');

	var validatorExp = Validator.use('#caseManage-form');

	$("#save").on('click',function(){
		validatorExp.execute(function(flag, err){
            if(!flag){
                new Ajax({
					request: "/paymentorder/paymentOrderRpc/divisionCase.json?securityCaseId="+encodeURIComponent($("input[name='securityCaseId']").val()), 
					paramName: "lassenCourtAssignDo",
					parseForm: $("#caseManage-form")
				}).on('ajaxSuccess', function(rtv, msg, con){
					displayResult(rtv, msg, con);
					// location.reload();
				}).submit();
            }
        });
	});

	// 组件：图片查看
	new ImgView();
	
	//显示静态页面，删除form
	function displayResult(){
		var result = {};
		result.deptName =  $("input[name='deptName']").val();
		result.trialName =  $("input[name='trialName']").val();
		result.clerkName =  $("input[name='clerkName']").val();
		result.remark =  $("[name='remark']").val();
		var templat = handlerbars.compile($('#template').html());
		$('.content').html(templat(result));
		$("#caseManage-form").remove();
	}

	//添加事件
	$("#load-more-details").on('click', function(){
		$("#more-details").removeClass("fn-hide");
		Scroller.use('.JS-need-scroller'); 
		$("#load-more-details").css("display","none");
	});

    $(".JS-trigger-more-information").on('click', function(e){
    	$("#court-more-information").removeClass("fn-hide");
    	//组件：滚动条
    	Scroller.use('.JS-need-scroller'); 
    	$(e.target).parent().remove();
    });

    $('[name="trialId"]').on('change', function(e){
    	var trialCourt = $(e.target);
		$('[name="trialName"]').val(trialCourt.find('option:selected').text()); 
    });

    $('[name="clerkId"]').on('change', function(e){
    	var clerk = $(e.target);
		$('[name="clerkName"]').val(clerk.find('option:selected').text()); 
    });

    $('[name="deptId"]').on('change', function(e){
    	var dept = $(e.target);
		$('[name="deptName"]').val(dept.find('option:selected').text()); 
		$('[name="trialName"]').val('');
		$('[name="clerkName"]').val('');
    });

    if($(".cascadeSelect").size() > 0){
    	var deptUserJson = $('[name="deptUserJson"]').val();
    	new CascadeSelect({"deptUserJson": eval(deptUserJson), needInit: true});
    }

});