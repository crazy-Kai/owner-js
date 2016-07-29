'use strict';

/*
 time:2016/6/24
 author:wukai
 content:es6练习
*/
define(function (require, exprots, module) {
	var test = 2;
	//有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。
	var promise = new Promise(function (resolve, reject) {
		console.log('promise');
		if (test === 1) {
			resolve();
		} else {
			reject();
		}
	});

	promise.then(function () {
		console.log('Resolved');
	}, function () {
		console.log('Rejected');
	});
	console.log("Hi,一丙");

	/*
 1:'promise'
 2:'Hi,'
 */
	var a = function a(_a, b) {
		return _a + b;
	};
	//promise 异步加载图片的列子
	new Promise(function (resolve, reject) {
		var image = new Image();
		$(document.body).append(image);
		console.log(image);
		image.onload = function () {
			resolve(image);
		};
		image.onerror = function () {
			reject(window.alert("this.url is wrong"));
		};

		image.src = '../../image/Koala.jpg';
		console.log(image);
	});
	// promise resolve()方法 中 传的参数 可以是一个变量的值 也可以是一个异步操作 返回该操作的状态
});