"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {
    require('bus/global/main');
	//依赖
	var $ = require('$'),
      delegate = require('common/delegate'),
      Calendar = require('common/calendar'),
      SearchList = require('model/searchList/main'),
      Ajax = require('model/ajax/main'),
      Modal = require('model/modal/main'),
      Validator = require('common/validator'),
      util = require('common/util'),
      Handlebars = require('common/handlerbars');

    //添加时间控件
    function getDateMonthRange(date1, range){
        return date1 + 1000*60*60*24*30*range;
    } 

    function getDateToString(date1){
        var year = date1.getFullYear(),
            month = date1.getMonth()+1,
            day = date1.getDate();
        var result =  year.toString() +"-";
            result = result + (month<10? ('0' + month.toString()) : month.toString()) + '-';
            result = result + (day<10? ('0' +day.toString()) :day.toString());
        return result;
    }
    
    //为日期范围添加时间
    function attachSelectDateEvent(c1, c2, type){
        c1.on('selectDate', function(date) {
            // c2.range([date, null]);
            c2.range(function(aDate){
                if(!date || (date && (aDate>=date))){
                    return true;
                }else{
                    return false;
                }
            });
        });
        c2.on('selectDate', function(date){
            //  c1.range([null, date]);
            c1.range( function(aDate){
                if(!date || (date && (aDate<=date))){
                  return true;
                }else{
                  return false;
                }
            });
        });
    }
    var c1,c2;
    if($('#submit-date-fr').length){
        var data = new Date();
        var pass = util.formatData('yyyy-MM-dd', new Date(data.getFullYear(), data.getMonth() - 3, data.getDate()));
        var today = util.formatData('yyyy-MM-dd', data);
        c1 = new Calendar({trigger: '#submit-date-fr', range: [null, today]})
        c2 = new Calendar({trigger: '#submit-date-to', range: [pass, null]})
        attachSelectDateEvent(c1, c2, 1);
        // $('#submit-date-fr').val(new Date);
        $('#submit-date-fr').val(pass);
        $('#submit-date-to').val(today);
    };
    var calendars = {'#submit-date-fr' : c1, '#submit-date-to' : c2}

    //案件状态
    var statusMap = require('common/statusMap');
    var validatorExp = Validator.use('#mycase-form', '.JS-target-date');

    //组件：查询
    var searchListExp = SearchList.use('.searchList', {
        size: 20,
        map: function (data) {
            var i = 0;
            for (; i < data.length; i++) {
                if (data[i].status) {
                    data[i].statusEx = statusMap[data[i].status];
                     data[i].amount =  util.formatMoney(data[i].amount, 2);
                }
            }
            return data;
        }
    });

   function doSearch(){
      searchListExp[0].searchListReload();
   }

   //添加事件
   delegate.on('click', '#search', function(){
      doSearch();
   });
});