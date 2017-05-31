"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	require('bus/global/main');
	
	//依赖
	var $ = require('$'),
	caseManagement = require('model/caseManagement/main');


	//组件：多选
	var multiple = {
		"NOT_ACCEPCT_REASON_1" : "请求给付的并非金钱或者汇票、本票、支票、股票、债券、国库券、可转让的存款单等有价证券",
		"NOT_ACCEPCT_REASON_2" : "请求给付的金钱或者有价证券未到期或数额不确定，或未写明请求所根据的事实、证据",
		"NOT_ACCEPCT_REASON_3" : "债权人有对待给付义务",
		"NOT_ACCEPCT_REASON_4" : "债务人不在我国境内或下落不明",
		"NOT_ACCEPCT_REASON_5" : "支付令未能送达债务人",
		"NOT_ACCEPCT_REASON_6" : "收到申请书的人民法院无管辖权",
		"NOT_ACCEPCT_REASON_7" : "债权人已向人民法院申请诉前保全"
	},

	theConclusion = {
		"make" : "受理",
		"not_accepted" : "不予受理"
	},

	multipleMap = [
				{"key": "请求给付的并非金钱或者汇票、本票、支票、股票、债券、国库券、可转让的存款单等有价证券",
	                "value": "NOT_ACCEPCT_REASON_1"
	            },{
	                "key": "请求给付的金钱或者有价证券未到期或数额不确定，或未写明请求所根据的事实、证据",
	                "value": "NOT_ACCEPCT_REASON_2"
	            },{
	                "key": "债权人有对待给付义务",
	                "value": "NOT_ACCEPCT_REASON_3"
	            },{
	                "key": "债务人不在我国境内或下落不明",
	                "value": "NOT_ACCEPCT_REASON_4"
	            },{
	                "key": "支付令未能送达债务人",
	                "value": "NOT_ACCEPCT_REASON_5"
	            },{
	                "key": "收到申请书的人民法院无管辖权",
	                "value": "NOT_ACCEPCT_REASON_6"
	            },{
	                "key": "债权人已向人民法院申请诉前保全",
	                "value": "NOT_ACCEPCT_REASON_7"
	            }
	        ];

	new caseManagement({"multiple": multiple, "theConclusion": theConclusion, "multipleMap": multipleMap})


});