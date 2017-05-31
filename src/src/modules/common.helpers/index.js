/* 
* @Author: caoke
* @Date:   2014-12-19 14:09:53
* @Last Modified by:   caoke
* @Last Modified time: 2015-05-22 23:56:50
*/
define(function (require, exports, module) {
    var $ = require('$');
    var crystal = require('crystal');
    var app = crystal.app;

    module.exports = {
        nameNick: function(name, nickName) {
            return nickName ? name + '(' + nickName + ')' : name;
        },
        uriBroker: function(prefix, path) {
            var args = Array.prototype.slice.call(arguments, 2, arguments.length - 1);
            return app.get(prefix) + path.replace(/\{(\d+)\}/g, function(p, p1) {
                var index = parseInt(p1);
                return (index in args) ? args[index] : '';
            });
        }
    };
});