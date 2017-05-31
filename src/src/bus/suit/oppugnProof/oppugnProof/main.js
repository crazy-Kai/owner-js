"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		handlerbars = require('common/handlerbars'),
		CountDown = require('model/countDown/main');

	//变量
	var countDownTime = $('#count-down-time'),
		countDownNode = $('#count-down-node'),
		countDownTemplate = $('#count-down-template'),
		template = handlerbars.compile( countDownTemplate.html() ),
		intervalID;


	var countDownExp = new CountDown({
		target: +countDownTime.val()
	});

	intervalID = setInterval(function(){
		var data = countDownExp.use();
		//不存在 干掉定时器
		if(!data){
			return clearInterval(intervalID)
		}
		countDownNode.html( template(data) );
	}, 1000);



});