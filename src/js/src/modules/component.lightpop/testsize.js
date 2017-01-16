/* 
* @Author: caoke
* @Date:   2014-12-22 15:41:19
* @Last Modified by:   caoke
* @Last Modified time: 2014-12-22 15:42:04
*/
define(function(require, exports, module) {

    var $ = require('$');
    var style = {
        position: 'absolute',
        top: -1000,
        visibility: 'hidden'
    };
    var testDiv = $('<div>').css(style).appendTo('body');

    exports.test = function(html, css) {
        testDiv.removeAttr('style').css(style);
        if ($.isPlainObject(css)) {
            testDiv.css(css);
        }
        testDiv.html(html);
        var size = {
            width: testDiv.width(),
            height: testDiv.height()
        };
        return size;
    };
});
