"use strict";
/**
 * 业务：法官调档[court/calldoc]
 * 2016,03,21 张一通
 */
define(function(require, exports, module) {
  require('bus/global/main');
	//依赖
	var $ = require('$'),
      calldocdetailHbs = require('./calldocdetail-hbs'),
      Ajax = require('model/ajax/main'),
      Handlebars = require('common/handlerbars');

   new Ajax({
        request: '/court/CourtRpc/getCallDoc.json',
        paramName:'securityCaseId',
        param: $(".fn-table").data("securitycaseid")
    }).on('ajaxSuccess', function(rtv, msg, con) {
      $(".fn-table").prepend(calldocdetailHbs(rtv));
    }).submit();
});