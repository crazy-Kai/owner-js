/* 
* @Author: caoke
* @Date:   2014-12-22 15:37:57
* @Last Modified by:   caoke
* @Last Modified time: 2015-01-19 10:46:40
*/
define(function(require, exports, module) {

    var $ = require('$');
    var ConfirmBox = require('confirmbox');
    var sizeTest = require('./testsize');
    var Overlay = require('overlay');

    var mask = new Overlay({
        width: '100%',
        height: '100%',
        className: 'ui-mask',
        zIndex: 800,
        style: {
            position: 'fixed',
            top: 0,
            left: 0
        }
    });
    var maskCount = 0;

    exports.success = function(message, callback) {
        showMessage('success', message, callback);
    };

    exports.error = function(message, callback) {
        showMessage('error', message, callback, true);
    };

    exports.loading = function() {
        !maskCount && mask.show();
        maskCount++;
    };

    exports.loaded = function() {
        maskCount--;
        !maskCount && mask.hide();
    };

    function showMessage(type, message, callback, modal) {
        var size = sizeTest.test(message, {
            fontSize: '14px'
        });
        var maxWidth = Math.max($(window).width() * .7, 500);
        if (size.width > maxWidth) {
            size.width = maxWidth;
        }
        var o = ConfirmBox.iconView('', function() {
            $.isFunction(callback) && callback();
            $(window).off('scroll', onScroll);
        }, {
            iconType: type,
            msgTile: message,
            hasMask: false,
            simple: true,
            zIndex: 999,
            timeout: type === 'error' ? 3500 : 1500,
            width: size.width + 100,
            confirmTpl: '',
            cancelTpl: '',
            closeTpl: type === 'error' ? '×' : ''
        });
        if (modal) {
            exports.loading();
            mask.element.css('background', 'rgba(255,255,255,.8)');
            o.before('hide', function() {
                exports.loaded();
                mask.element.css('background', 'none');
            });
        }
        var onScroll = function() {
            try {
                o._setPosition();
            } catch (e) {
                $(window).off('scroll', onScroll);
            }
        };
        $(window).on('scroll', onScroll);
    }
});
