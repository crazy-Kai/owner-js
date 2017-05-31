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
    var domUtil = require('common/domUtil');
    var Modal = require('model/modal/main');

    var caseId = util.getUrlParam('caseId');
    var url;

    if (caseId) {
        url = $('#prev').attr('href');
        url = url.indexOf('?') == -1 ? url + '?caseId=' + caseId : url + '&caseId=' + caseId;
        $('#prev').attr('href', url);
    }

    $('#notic-check-next').click( function (e) {
        e.preventDefault();
        // 浏览器判断
        if(!domUtil.isWebkit){
            return Modal.confirm('请使用Google Chrome浏览器进入庭审',
                '目前网上法庭在线视频庭审只支持Google Chrome浏览器，需要进入庭审请使用Google Chrome浏览器，<a class="global-link" target="_blank" href="http://dlsw.baidu.com/sw-search-sp/soft/9d/14744/ChromeStandalone_V45.0.2454.99_Setup.1442891522.exe">下载地址</a>',
                null, null, {width:500, noCancle: true, closeTpl: '', noSure: true});
        };
        if (caseId) {
            if ($('#trial-checked').prop('checked')) {
                window.location.href = '/suit/trial/trialStart.do?caseId=' + caseId
            }
        } else {
            Modal.alert(0, '没有案件id');
        }
        
    });
});