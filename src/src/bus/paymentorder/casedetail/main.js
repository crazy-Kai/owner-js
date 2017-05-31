/*
page:案件详情
time:2016/5/5
*/
define(function(require,exports,module){
	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');
	  // 依赖模块
    var Delegate = require('common/delegate'),
     	$ = require('$'),
         Ajax = require('model/ajax/main'),
         CaseDetail = require('./casedetails-hbs'),
         Objection = require('./objection-hbs'),
         Recall = require('./recall-hbs'),
         caseId = $('[name="caseId"]').val();

     //tab 点击事件
     Delegate.on("click",'[data-items="tab"]',function(){
     	$('[data-items="tab"]').removeClass("ch-active");
     	$(this).addClass("ch-active");

     })   
     var entityRoles = $('[name="role"]').val();
     //发送请求加载所有数据  
         new Ajax({
         	request:'/paymentorder/paymentCaseDetailRpc/getCaseDetailInfo.json',
         	param:{securityCaseId:caseId}
         }).on("ajaxSuccess",function(rtv){
         	$('#content').append( CaseDetail( $.extend( { entityRole: entityRoles }, rtv ) ) );
            $('[data-item="tab"]').each(function(key,value){
                $(value).attr("id","file"+(key+1)+"");
            })
         }).submit();
})