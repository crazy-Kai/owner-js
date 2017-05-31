"use strict";
define(function(require, exports, module){

	//默认依赖一个全局都引用的业务模块
		require('bus/global/main');
	//依赖
		var $ = require('$'),
			SearchList = require('model/searchList/main'),
			statusMap = require('common/statusMap'),
			areaData = require('model/address/data');
			//组件：查询
		var searchListExp = SearchList.use('.searchList', {
			// 转意案件状态
			map: function (data) {
				if(data){
					var i = 0;
					for (; i < data.length; i++) {
						if (data[i].status) {
							data[i].statusEx = statusMap[data[i].status];
						}

					
					}
					
				}
				return data;
			}
		});

		// 通过编码转义地区
		// 不通过模板直接渲染到HTML页面中
		function formatAreaByCode(){
			var areaCodeDom = $('#areaCode'),
				areaCode = ''+areaCodeDom.data('codes');
				// 在 areaCode前面加上''是因为要将其变成字符串 
			// 格式化areaCode
			areaCode = areaCode.slice(0, 4) + '00';
			//把数字转换为中文的模块
			areaCodeDom.html(areaData[areaCode][0]);
		};
		formatAreaByCode();
		
	
});



