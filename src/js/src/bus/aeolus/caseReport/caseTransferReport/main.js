"use strict";
/**
 * 业务：报表
 * 2016,01,20 张一通
 */
define(function(require, exports, module) {
	//依赖
	var $ = require('$'),
	 Calendar = require('common/calendar'),
	 SearchList = require('model/searchList/main'),
	 Ajax = require('model/ajax/main');

	 var c1 = new Calendar({trigger: '#submit-date-fr'})
     var c2 = new Calendar({trigger: '#submit-date-to'})
     var dataMap={};
	 $.ajaxSetup({ cache: false });
	//搜 索 按钮事件
	$("#search").on('click', function(){
		myChart.showLoading();
		new Ajax({
			request:$(".searchList").data("ajaxurl"),
			//"/aeolus/caseReportRpc/caseTransferReport.json",
			param:"startTime="+$("#submit-date-fr").val()+"&&endTime="+$("#submit-date-to").val()
		}).on("ajaxSuccess", function(rtv, msg, con){
			myChart.setOption({options:buildOptions(buildData(msg,dataMap))});
			myChart.hideLoading();
		}).submit();
		//myChart.setOption({options:buildOptions(buildData(result,dataMap))});
	});


	 c1.on('selectDate', function(date) {
        c2.range(
          function(aDate){
            if(!date || (date && (aDate>=date))){
                return true;
            }else{
              return false;
            }
        });
    });
    c2.on('selectDate', function(date) {
        c1.range(
          function(aDate){
            if(!date || (date && (aDate<=date))){
              return true;
            }else{
              return false;
            }
          });       
    });

	function dataFormatter(obj) {
	    var pList = JSON.parse($("#courtNameArrJSON").val());
	    var temp;
	    var objKeys=Object.keys(obj);
	    for (var year in objKeys) {
	        var date=objKeys[year];
	        temp = obj[objKeys[year]];
			for (var i = 0, l = temp.length; i < l; i++) {
	            obj[date][i] = {
	                name : pList[i],
	                value : temp[i]
	            }
	        }
	    }
	    return obj;
	}
	function buildOptions(dataMap){
		var result=[];
		var objKeys=Object.keys(dataMap.dataWillSubmit);
	    for (var year in objKeys) {
	        var date=objKeys[year];
			result.push({timeline:{data: objKeys},
						 title: {text: date+'案件日流转报表'},
				         series: [
				                {data: dataMap.dataWillSubmit[date]},
				                {data: dataMap.dataSubmit[date]},
				                {data: dataMap.dataAudit[date]},
				                {data: dataMap.dataCorrection[date]},
				                {data: dataMap.dataCased[date]},
				                {data: dataMap.dataAllotCase[date]},
				                {data: dataMap.dataPutProof[date]},
				                {data: dataMap.dataOppugnProof[date]},
				                {data: dataMap.dataWaitTrial[date]},
				                {data: dataMap.dataTrialing[date]},
				                {data: dataMap.dataWaitDecision[date]},
				                {data: dataMap.dataSentenced[date]},
				                {data: dataMap.dataBringUpObjection[date]},
				                {data: dataMap.dataJurisedictionObjection[date]},
				                {data: dataMap.dataDropped[date]},
				                {data: dataMap.dataUnpaidDropped[date]},
				                {data: dataMap.dataObjectionToJurisdiction[date]},
				                {data: dataMap.dataNotAccepted[date]},
				                {data: dataMap.dataReturn[date]}
				            ]
				        });
		};
		console.log(result);
		return result;
	}
	function buildData(obj,dataMap){
		var t=JSON.parse(obj);
		if (!dataMap && typeof(dataMap)!="undefined" && dataMap!=0){
			dataMap={};
		}
		//待提交
		dataMap.dataWillSubmit=dataFormatter(t.willSubmitMap);
		//已提交
		dataMap.dataSubmit=dataFormatter(t.submitMap);
		dataMap.dataAudit=dataFormatter(t.auditMap);
		dataMap.dataCorrection=dataFormatter(t.correctionMap);
		dataMap.dataCased=dataFormatter(t.casedMap);
		dataMap.dataAllotCase=dataFormatter(t.allotCaseMap);
		dataMap.dataPutProof=dataFormatter(t.putProofMap);
		dataMap.dataOppugnProof=dataFormatter(t.oppugnProofMap);
		dataMap.dataWaitTrial=dataFormatter(t.waitTrialMap);
		dataMap.dataTrialing=dataFormatter(t.trialingMap);
		dataMap.dataWaitDecision=dataFormatter(t.waitDecisionMap);
		dataMap.dataSentenced=dataFormatter(t.sentencedMap);
		dataMap.dataBringUpObjection=dataFormatter(t.bringUpObjectionMap);
		dataMap.dataJurisedictionObjection=dataFormatter(t.jurisedictionObjectionMap);
		dataMap.dataDropped=dataFormatter(t.droppedMap);
		dataMap.dataUnpaidDropped=dataFormatter(t.unpaidDroppedMap);
		dataMap.dataObjectionToJurisdiction=dataFormatter(t.objectionToJurisdictionMap);
		dataMap.dataNotAccepted=dataFormatter(t.notAcceptedMap);
		dataMap.dataReturn=dataFormatter(t.returnListMap);
		return dataMap;
	}
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    
    // 指定图表的配置项和数据
    var option = {
			baseOption: {
				timeline: {
					axisType: 'category',
					autoPlay: false,
					playInterval: 1000,
					label: {}
				},
				title: {},
				tooltip: {},
				legend: {
					"top":30,
                    data: ['待提交', '已提交', '立案审核', '立案补正', '已立案', '分案','举证','质证','等待庭审',
                 		'庭审','待判决','已判决','被告提起管辖异议','管辖异议成立','原告已撤诉','未缴费撤诉',
                 		'调解','不予受理','退回'],
                },
				calculable : true,
				grid: {
					left:150,
					top: 100,
           			bottom: 100
				},
				xAxis: [
					{
						type: 'value',
						name: '案件数量',
						interval: 10
					}
				],
				yAxis: [
					{
						'type':'category',
						 splitLine: {show: false},
						 'data':JSON.parse($("#courtNameArrJSON").val()),
					}
				],
				series: [{name:'待提交',type:'bar',stack:'a'},
						 {name:'已提交',type:'bar',stack:'a'},
						 {name:'立案审核',type:'bar',stack:'a'},
						 {name:'立案补正',type:'bar',stack:'a'},
						 {name:'已立案',type:'bar',stack:'a'},
						 {name:'分案',type:'bar',stack:'a'},
						 {name:'举证',type:'bar',stack:'a'},
						 {name:'质证',type:'bar',stack:'a'},
						 {name:'等待庭审',type:'bar',stack:'a'},
						 {name:'庭审',type:'bar',stack:'a'},
						 {name:'待判决',type:'bar',stack:'a'},
						 {name:'已判决',type:'bar',stack:'a'},
						 {name:'被告提起管辖异议',type:'bar',stack:'a'},
						 {name:'管辖异议成立',type:'bar',stack:'a'},
						 {name:'原告已撤诉',type:'bar',stack:'a'},
						 {name:'未缴费撤诉',type:'bar',stack:'a'},
						 {name:'调解',type:'bar',stack:'a'},
						 {name:'不予受理',type:'bar',stack:'a'},
						 {name:'退回',type:'bar',stack:'a'}
				]
			},
			options: buildOptions(buildData($("#reportTransferMapJSON").val(),dataMap))
		};
    // 使用刚指定的配置项和数据显示图表。
    console.log(option);
    myChart.setOption(option,!0);
    
});	
