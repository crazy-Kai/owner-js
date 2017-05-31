/* 
 * @Author: caoke
 * @Date:   2015-01-08 10:50:23
 * @Last Modified by:   caoke
 * @Last Modified time: 2015-05-22 14:57:24
 */
define(function (require, exports, module) {

    var $ = require('$')
    var crystal = require('crystal');
    var app = crystal.app;
    var LightPop = require('../component.lightpop/index');
    var Util = require('util');
    var codes = require('../../errors/{locale}');
    var i18n = Util.i18nHelper(codes);

    module.exports = function(err) {
        err.params.unshift(err.code);
        LightPop.error(i18n.apply(null, err.params));
        if (app.get('debug') && window.console) {
            console.error([
                '[ERROR]',
                'URL:\t' + err.url,
                'CODE:\t' + err.code,
                'MSG:\t' + err.msg,
                'FIELD:\t' + err.field,
                'PARAMS:\t' + err.params
            ].join('\n'));
        }
    };
});