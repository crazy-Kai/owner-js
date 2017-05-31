"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');
	//业务：我要起诉下的全局引用
	require('bus/suit/trial/global/main');

    var util = require('common/util');
    var Modal = require('model/modal/main');

    var caseId = util.getUrlParam('caseId');
    var url;
    var cookie = require('common/cookie');

    
    if (caseId) {
        url = $('#notic-check-next').attr('href');
        url = url.indexOf('?') == -1 ? url + '?caseId=' + caseId : url + '&caseId=' + caseId;
        $('#notic-check-next').attr('href', url);

        if(!cookie.get('openText')){
            $('#notic-check-next').click( function (e) {
                var node = $(this);
                e.preventDefault();
                cookie.set('openText', "true");
                Modal.show('/suit/trial/trialTest.htm', {width:1200, height:950, closeTpl: '<button class="fn-btn fn-btn-default" type="button">下一步</button>'}).after('hide', function(){
                    location.href = node.prop('href');
                });
            });
        };
        
    } else {
        $('#notic-check-next').click( function (e) {
            e.preventDefault();
            Modal.alert(0, '没有案件id');
        });
    }
	

});