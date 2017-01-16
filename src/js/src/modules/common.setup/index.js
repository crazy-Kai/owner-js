/* 
* @Author: caoke
* @Date:   2015-02-11 15:45:16
* @Last Modified by:   caoke
* @Last Modified time: 2015-05-22 16:07:51
*/
define(function(require, exports, module) {

    var $ = require('$');
    var crystal = require('crystal');
    var app = crystal.app;
    var Util = require('util');
    var gLang = require('../../i18n/{locale}');
    var DetectZoom = require('detect-zoom');
    var errorHandler = require('../common.errorhandler/index');
    require('nprogress');
    require('detect-zoom.css');
    require('console');

    module.exports = function(config) {
        window.crystal = crystal;

        // className
        crystal.getClassName = function(mod) {
            return mod.id.split('/modules/')[1].split('/')[0].replace(/\./g, '-')
        };

        // 模板封装
        crystal.wrapTpl = function(tpl, rLang) {
            var lang = Util.extend({}, gLang, rLang);
            var i18nHelper = Util.i18nHelper(Util.extend({}, gLang, rLang));
            var t = function(data, options) {
                options = options || {};
                options.helpers = options.helpers || {};
                options.helpers.i18n = i18nHelper;
                return tpl(data, options);
            };
            t.i18n = i18nHelper;
            return t;
        };

        // 缩放检测
        new DetectZoom(seajs.data.vars.locale == 'en' ? 'en' : 'cn', false);

        // 请求进度条
        $(document).ajaxStart(function () {
            NProgress.start();
        });
        $(document).ajaxComplete(function () {
            NProgress.done();
        });

        // IE title with hash issus
        if (document.attachEvent) {
            setInterval(function() {
                if (document.title.charAt(0) == '#') {
                    document.title = config.pageTitle || '';
                }
            }, 1000);
        }

        // 应用设置
        app.set('debug', config.debug);
        app.set('defaultIndex', 'index');
        app.set('mapping', {
            '^~/': [ config.family, config.name, config.gitVersion, 'modules/' ].join('/')
        });
        app.set('ajax', {
            unescapeJson: true,
            csrfToken: config.csrfToken,
            tokenWhiteList: function(options) { // 白名单里的请求不带csrfToken
                if (/^(http(s)?:)?\/\//.test(options.url)) {
                    var lPrefix = location.href.split('/').slice(2, 4).join('/');
                    var uPrefix = options.url.split('/').slice(2, 4).join('/');
                    if (lPrefix == uPrefix) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return false;
            },
            data: config.defaultParams,
            isbuctest: config.debug,
            appName: config.appName,
            backUrl: location.protocol + '//' + location.host + config.backUrl,
            errorHandler: errorHandler,
            contextPath: config.contextPath
        });
        app.start();
    };
});
