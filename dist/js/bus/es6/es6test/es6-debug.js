"use strict";
define("js/bus/es6/es6test/es6-debug", [], function(require, exprots, module) {
    var test = 2,
        promise = new Promise(function(resolve, reject) {
            1 === test ? resolve() : reject()
        });
    promise.then(function() {}, function() {});
    new Promise(function(resolve, reject) {
        var image = new Image;
        $(document.body).append(image), image.onload = function() {
            resolve(image)
        }, image.onerror = function() {
            reject(window.alert("this.url is wrong"))
        }, image.src = "../../image/Koala.jpg"
    })
});