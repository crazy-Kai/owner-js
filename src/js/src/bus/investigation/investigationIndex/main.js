/*
  time: 2016/2/23
  author: wukai
  business: 协查首页
  
*/
"use strict";

define(function( require, exports, module){

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		delegate = require('common/delegate'),
		dialog = require('common/dialog'),
		Calendar = require('common/calendar'),
    SearchList = require('model/searchList/main'),
    Ajax = require('model/ajax/main'),
    advancedQuery = require('model/advancedQuery/main'),
    Validator = require('common/validator');
   

   /*为日历时间添加范围*/
    function attachSelectDateEvent(c1, c2){
      // selecyDate是日历插件自带的方法，表示当用户在选择日期时所要做的事情
      c1.on('selectDate',function(data){
          // range方法 日历自带的控制时间范围的方法
          c2.range([data,null])//数组中的第一个参数表示开始时间，第2参数表示结束时间
      });
      c2.on('selectDate',function(data){
  
        c1.range([null,data])
      })
    }

   /*实例化日历插件*/
    if($('#submit-date-fr').length){
        var c1 = new Calendar({trigger: '#submit-date-fr'});
        var c2 = new Calendar({trigger: '#submit-date-to'});
        attachSelectDateEvent(c1, c2);
    };

    if($('#register-date-fr').length){
        var c3 = new Calendar({trigger: '#register-date-fr'});
        var c4 = new Calendar({trigger: '#register-date-to'});
        attachSelectDateEvent(c3, c4)
    };


   var calendars = {'#submit-date-fr' : c1, '#submit-date-to' : c2, '#register-date-fr' : c3, '#register-date-to' : c4};


   //组件：查询
   var searchListExp = SearchList.use('.searchList', {});

  //点击高级查询渲染列表
   new advancedQuery()

   function doSearch(){
      searchListExp[0].searchListReload();
   }
   var validatorExp = Validator.use('.kuma-form', '[data-widget="validator"]');

 //添加事件
   delegate.on('click', '#search', function(){
         doSearch();
   });
          //清空设置
   delegate.on('click', '#reset', function(){
     $(":reset").trigger('click');
   });

 //排序方式切换
   $("input[name='order']").on('click', function(){
      $("[type='radio']").parent().addClass('fn-btn-link').removeClass("fn-btn-default");
      $("[type='radio']:checked").parent().removeClass('fn-btn-link').addClass("fn-btn-default");
      doSearch();
   });


})