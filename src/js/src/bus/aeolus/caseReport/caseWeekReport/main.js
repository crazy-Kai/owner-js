"use strict";
/**
 * 业务：报表
 * 2016,01,20 张一通
 */
define(function(require, exports, module) {
	//依赖
	var $ = require('$'),
  	 Calendar = require('common/calendar'),
     delegate = require('common/delegate'),
  	 SearchList = require('model/searchList/main'),
     Tip = require('common/tip'),
  	 Ajax = require('model/ajax/main');

	 var c1 = new Calendar({trigger: '#submit-date-fr'})
   var c2 = new Calendar({trigger: '#submit-date-to'})
   var dataMap={};
	 $.ajaxSetup({ cache: false });

   
	//搜 索 按钮事件
  var searchListExp= SearchList.use(".searchList",{});
  searchListExp[0].on('ajaxSuccess', function(rtv, msg, con){
        //添加提示
        Tip.use($(".item-tip"));
      });

  function doSearch(){
      searchListExp[0].searchListReload();
   }
   //添加事件
   delegate.on('click', '#search', function(){
      doSearch();
   });
/*	$("#search").on('click', function(){
		//location.href=$(".searchList").data("ajaxurl")+"?startTime="+$("#submit-date-fr").val()+"&&endTime="+$("#submit-date-to").val();
		new Ajax({
			request:$(".searchList").data("ajaxurl"),
			param:"startTime="+$("#submit-date-fr").val()+"&&endTime="+$("#submit-date-to").val()
		}).on("ajaxSuccess", function(rtv, msg, con){
			console.log(rtv);
		}).submit();
    
	});
*/
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
});	
