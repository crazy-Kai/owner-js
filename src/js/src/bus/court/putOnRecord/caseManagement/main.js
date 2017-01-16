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
		"no_plaintiff_qualification" : "原告主体资格不符",
		"no_defendant" : "无明确的被告或被告主体资格不符",
		"no_request" : "无具体诉讼请求，事实和理由",
		"no_range" : "不属于民事诉讼范围",
		"no_mycourt" : "不属于本院管辖",
		"no_proof" : "没有新的事实和证据重新起诉",
		"no_sue" : "依法在一定期限内不得起诉的案件",
		"other" : "其他"
	},

	theConclusion = {
		"make" : "决定立案",
		"correction": "退回补证",
		"not_accepted" : "不予受理",
		"return": "退回"
	},

	multipleMap = [
				{"key": "原告主体资格不符",
	                "value": "no_plaintiff_qualification"
	            },{
	                "key": "无明确的被告或被告主体资格不符",
	                "value": "no_defendant"
	            },{
	                "key": "无具体诉讼请求，事实和理由",
	                "value": "no_request"
	            },{
	                "key": "不属于民事诉讼范围",
	                "value": "no_range"
	            },{
	                "key": "不属于本院管辖",
	                "value": "no_mycourt"
	            },{
	                "key": "没有新的事实和证据重新起诉",
	                "value": "no_proof"
	            },{
	                "key": "依法在一定期限内不得起诉的案件",
	                "value": "no_sue"
	            },{
	                "key": "其他",
	                "value": "other"
	            }

	        ];

	




	new caseManagement({"multiple": multiple, "theConclusion": theConclusion, "multipleMap": multipleMap})

});