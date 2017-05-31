"use strict";
/**
 * 业务：报表
 * 2016,01,20 张一通
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$');
    var dataMap={};
	function dataFormatter(obj) {
	    var pList = JSON.parse($("#courtNameArrJSON").val());
	    var temp;
	    var sum = 0;
	    var objKeys=Object.keys(obj);
	    for (var year in objKeys) {
	        var date=objKeys[year];
	        temp = obj[objKeys[year]];
			for (var i = 0, l = temp.length; i < l; i++) {
	            obj[date][i] =temp[i]==='-'?0:temp[i];
	        }
	    }
	    return obj;
	}
	function buildOptions(dataMap){
		var result=[];
		var objKeys=Object.keys(dataMap.dataWillSubmit);
	    for (var year in objKeys) {
	        var date=objKeys[year];
			result.push(
		                {name:'已提交',type:'bar',stack:'a',data: dataMap.dataSubmit[date]},
		                {name:'立案审核',type:'bar',stack:'a',data: dataMap.dataAudit[date]},
		                {name:'立案补正',type:'bar',stack:'a',data: dataMap.dataCorrection[date]},
		                {name:'已立案',type:'bar',stack:'a',data: dataMap.dataCased[date]},
		                {name:'分案',type:'bar',stack:'a',data: dataMap.dataAllotCase[date]},
		                {name:'举证',type:'bar',stack:'a',data: dataMap.dataPutProof[date]},
		                {name:'质证',type:'bar',stack:'a',data: dataMap.dataOppugnProof[date]},
		                {name:'等待庭审',type:'bar',stack:'a',data: dataMap.dataWaitTrial[date]},
		                {name:'庭审',type:'bar',stack:'a',data: dataMap.dataTrialing[date]},
		                {name:'待判决',type:'bar',stack:'a',data: dataMap.dataWaitDecision[date]},
		                {name:'已判决',type:'bar',stack:'a',data: dataMap.dataSentenced[date]},
		                {name:'管辖异议成立',type:'bar',stack:'a',data: dataMap.dataJurisedictionObjection[date]},
		                {name:'原告已撤诉',type:'bar',stack:'a',data: dataMap.dataDropped[date]},
		                {name:'未缴费撤诉',type:'bar',stack:'a',data: dataMap.dataUnpaidDropped[date]},
		                {name:'调解',type:'bar',stack:'a',data: dataMap.dataObjectionToJurisdiction[date]},
		                {name:'不予受理',type:'bar',stack:'a',data: dataMap.dataNotAccepted[date]},
		                {name:'退回',type:'bar',stack:'a',data: dataMap.dataReturn[date]}
		                );
		};
		var initArr=new Array(dataMap.dataWillSubmit[objKeys[0]].length);
		for(var i=0;i< dataMap.dataWillSubmit[objKeys[0]].length;i++){
			initArr[i]=0;
		}
		result.push({name:'total',
	          type:'bar',
	          stack:'a',
	          data:initArr});
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
    var myChart = echarts.init(document.getElementById('main'),'shine'); 

    //计算echarts total值 并生成markPoint 显示   
	function eConsole(param) {
	  var selectedLegend=param.selected;
	  var selectedIndex=[];
	  var selectedArr=Object.keys(selectedLegend);
	  for(var key in selectedArr){
	   if(selectedLegend[selectedArr[key]]==true){
	    selectedIndex.push(key);
	   }
	  } 
	  var mySeries=myChart.getSeries();
	  var snum=[];
	   for(var key in selectedIndex){ 
	    for(var t in mySeries[selectedIndex[key]].data){
	      if(typeof(snum[t])=='undefined'){
	        snum[t]=0;
	      }
	      snum[t]+=parseInt(mySeries[selectedIndex[key]].data[t]);     
	     }
	    }
	    var myData=[];
	    for(var i in snum){
	      myData.push({value: snum[i], xAxis: snum[i], yAxis: parseInt(i)});
	    }
	  mySeries[mySeries.length-1]={ 
	          name:'总量',
	          type:'bar',
	          stack:'a',
	          markPoint : {
	                symbolRotate:270,
	                data : myData
	            }
	        };
	  myChart.setSeries(mySeries,false);
	}
	myChart.on(echarts.config.EVENT.LEGEND_SELECTED, eConsole);
    // 指定图表的配置项和数据
    var option = {
				legend: {
					"y":30,
                    data: ['已提交', '立案审核', '立案补正', '已立案', '分案','举证','质证','等待庭审',
                 		'庭审','待判决','已判决','管辖异议成立','原告已撤诉','未缴费撤诉',
                 		'调解','不予受理','退回'],
                 	selected: {
                	'已提交':false
                    }
                },
                tooltip : {
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {show: true, type: ['line', 'bar']},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
				calculable : true,
				grid: {
					x:150,
					y: 100,
           			y2: 100
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
						'axisLabel':{'interval':0},
						 splitLine: {show: false},
						 'data':JSON.parse($("#courtNameArrJSON").val()),
					}
				],
				title: {text:'案件状态一览表'},
				series:buildOptions(buildData($("#reportStatusMapJSON").val(),dataMap))			
		};
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);    
function initMarkPoint(){
      var selectedLegend=myChart.getOption().legend.selected;
	  var selectedIndex=Object.keys(myChart.getOption().legend.data);
	  var selectedArr=Object.keys(selectedLegend);
	  for(var key in selectedArr){
	   if(selectedLegend[selectedArr[key]]==false){
	    selectedIndex.splice(myChart.getOption().legend.data.indexOf(selectedArr[key]),1)
	   }
	  } 
      var mySeries=myChart.getSeries();
	  var snum=[];
	   for(var key in selectedIndex){ 
	    for(var t in mySeries[selectedIndex[key]].data){
	      if(typeof(snum[t])=='undefined'){
	        snum[t]=0;
	      }
	      snum[t]+=parseInt(mySeries[selectedIndex[key]].data[t]);     
	     }
	    }
	    var myData=[];
	    for(var i in snum){
	      myData.push({value: snum[i], xAxis: snum[i], yAxis: parseInt(i)});
	    }
	      mySeries[mySeries.length-1]={ 
	      name:'总量',
	      type:'bar',
	      stack:'a',
	      data:[0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0],
	      markPoint : {
	            symbolRotate:270,
	            data : myData
	        }
	    };
	    myChart.setSeries(mySeries,false);
}
initMarkPoint();
      
});	



                    
