"use strict";
/**
 * 依据模板
 * 2016,01,11 陈志文
 */
define(function(require, exports, module){
	//依赖
	var Mywidget = require('common/myWidget'),
		Ajax = require('model/ajax/main'),
		Handlerbars = require('common/handlerbars'),
		limit = require('common/limit'),
		domUtil = require('common/domUtil'),
		searchButtons = ['<input type="reset" class="fn-btn fn-btn-default fn-btn-sm fn-W60 fn-hide" value="清空" />',
                        '<input type="button" class="fn-btn fn-btn-primary fn-btn-sm fn-W60" value="查询" id="search" />',
                        '<a class="global-link fn-PL10 fn-LH24" id="reset">清空</a>'].join('');

    var advancedQuery = Mywidget.extend({
    	//类名
    	clssName : 'advancedQuery',
    	attrs : {
    		element : '.case-search-query'
    	},

    	events : {
			'click [data-role="advanced-query"]': function(e){
				e.preventDefault();
				var me = this,
					tgt = me.jQuery(e.target),
					icon = tgt.find('i') ;
					icon = icon.size()>0 ? icon : tgt;
				var	down = icon.hasClass('fn-advanced-query-down');
				if(icon.size()>0){
					if(down){
						icon.removeClass('fn-advanced-query-down').addClass('fn-advanced-query-up');
						me.jQuery("tbody[data-role='advanced-query-conditions'] > [data-role='dosearch']").append(searchButtons);
						me.jQuery("span[data-role='dosearch']").empty();
						me.jQuery("tbody[data-role='advanced-query-conditions']").removeClass('fn-hide');
					}else{
						icon.removeClass('fn-advanced-query-up').addClass('fn-advanced-query-down');
						me.jQuery("tbody[data-role='advanced-query-conditions']").addClass('fn-hide');
						me.jQuery("tbody[data-role='advanced-query-conditions'] > [data-role='dosearch']").empty();
						me.jQuery("tbody[data-role='advanced-query-conditions']").find('input:text').val("").prop("disabled", false);
						me.jQuery("tbody[data-role='advanced-query-conditions']").find('select').find('option:first').prop('selected',true);
						me.jQuery("span[data-role='dosearch']").append(searchButtons);
					}
				}
			},
			'change [name="type"]':function(e){
				var me = this,
					disputecode = $(e.target).val(),
					causeAction = me.$('select[name="causeAction"]');
				if( !causeAction.length ){
					return me;
				};
				if( disputecode ){
					new Ajax({
						request:'/hephaistos/disputeParamRpc/getDisputeParamList.json',
						paramName:'filterMap',
						param:{disputecode:disputecode}
					}).on('ajaxSuccess', function(rtv, msg, con){
						/*var template = Handlerbars.compile('{{#each this}}<option value="{{partype}}">{{description}}</option>{{/each}}');
						$('select[name="description"]').html(template(rtv.data));*/
						domUtil.selectSerialize( causeAction[0], [{key: '不限案由', value: ''}].concat( limit.map(rtv.data, function(val){
							return {
								key: val.parvalue,
								value: val.parvalue
							};
						})) );
					}).submit();
				}else{
					domUtil.selectSerialize( causeAction[0], [{key: '请选择类型再选案由', value: ''}]);
				};
			}
    	}
    })
	return advancedQuery;
});


