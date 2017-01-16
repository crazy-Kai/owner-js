"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$');

    var util = require('common/util');
    var Modal = require('model/modal/main');

    var caseId = util.getUrlParam('caseId');
    var url;

    function closeWindow () {
        setTimeout( function () {
            window.close();
        }, 1000);
    } 

    if (caseId) {
        url = $('#prev').attr('href');
        url = url.indexOf('?') == -1 ? url + '?caseId=' + caseId : url + '&caseId=' + caseId;
        $('#prev').attr('href', url);
    }

    $('#notic-check-next').click( function (e) {
        e.preventDefault();
        if (caseId) {
            if ($('input[name=diffect]:checked').val() == "1") {
                Modal.alert(0, '提出异议, 请联系审判法官');
            } else {
                url = $('#notic-check-next').attr('href');
                url = url.indexOf('?') == -1 ? url + '?caseId=' + caseId : url + '&caseId=' + caseId;
                window.location.href = url;
            }  
        } else {
            Modal.alert(0, '没有案件id');
        }
    });
	

});