"use strict";
define("src/common/cookie-debug", [], function(require, exports) {
    var DOC = document,
        cookiePath = window.location.href,
        cookieDomain = DOC.domain,
        cookieSecure = !1;
    exports.set = function(name, value, second) {
        var date, flag = void 0 === second;
        flag || (date = new Date, date.setSeconds(date.getSeconds() + second)), DOC.cookie = name + "=" + escape(value) + (flag ? "" : "; expires=" + date.toUTCString()) + "; path=" + cookiePath
    }, exports.setPath = function(path) {
        cookiePath = path
    }, exports.setDomain = function(domain) {
        cookieDomain = domain
    }, exports.setSecure = function(flag) {
        cookieSecure = !!flag
    }, exports.get = function(name) {
        for (var temp, cookieStr = DOC.cookie, arr = cookieStr.split("; "), i = 0, j = arr.length; i < j; i++)
            if (temp = arr[i].split("="), temp[0] === name) return unescape(temp[1] || "");
        return ""
    }, exports.remove = function(name) {
        var date = new Date;
        date.setTime(0), DOC.cookie = name + "=v; expires=" + date.toUTCString() + "; path=" + cookiePath
    }
});