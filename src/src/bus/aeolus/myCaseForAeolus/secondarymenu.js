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

	var statusMap = require('common/statusMap'),
		paymentStatusMap = require('common/paymentStatusMap');

    var advancedQuery = Mywidget.extend({
    	//类名
    	clssName : 'advancedQuery',
    	attrs : {
    		element : '.case-search-query',
    		suitTypeHtml : $('[name="type"]').html()
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
						me.jQuery("tbody[data-role='advanced-query-conditions']").find('select[data-role="class"]').trigger('change');
					}else{
						icon.removeClass('fn-advanced-query-up').addClass('fn-advanced-query-down');
						me.jQuery("tbody[data-role='advanced-query-conditions']").addClass('fn-hide');
						me.jQuery("tbody[data-role='advanced-query-conditions'] > [data-role='dosearch']").empty();
						me.jQuery("tbody[data-role='advanced-query-conditions']").find('input:text').val("").prop("disabled", false);
						me.jQuery("tbody[data-role='advanced-query-conditions']").find('select').find('option:first').prop('selected',true);
						me.jQuery("tbody[data-role='advanced-query-conditions']").find('select[data-role="class"]').trigger('change');
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
					if(disputecode == 'payment_order'){
						domUtil.selectSerialize( causeAction[0], [{key: '申请支付令', value: '申请支付令'}]);
					}else{
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
					}
				}else{
					domUtil.selectSerialize( causeAction[0], [{key: '请选择类型再选案由', value: ''}]);
				};
			},
			'change [data-role="class"]':function(e){
				var me = this,
					caseType = $(e.target).val(),
					type = $('select[name="type"]'),
					status = $('select[name="status"]'),
					input = $('input[name="key"]'),
					judgeStatus = $("#judgeStatus").val() ? JSON.parse($("#judgeStatus").val()) : {};
				//支付令
				if( caseType == 'statusPaymentList'){
					$(input).prop("placeholder","案件编号、案号、申请人、被申请人");
					domUtil.selectSerialize( type[0], [{key: '支付令', value: 'payment_order'}]);
					if(status.size()){
						me.getStatusOptions(status[0], judgeStatus.statusPaymentList, paymentStatusMap);
					}
					$('#filterCondition label').removeClass('fn-btn-default').addClass('fn-btn-link');
					$('#filterCondition [type="radio"]').prop('checked', false);

					$('#filterCondition label:first').removeClass('fn-btn-link').addClass('fn-btn-default');
					$('#filterCondition [type="radio"]:first').prop('checked', true);

					me.hide($('#filterCondition'));
				//诉讼
				}else{
					$(input).prop("placeholder","案件编号、案号、原告、被告")
					$('[name="type"]').html(me.get('suitTypeHtml'));
					if(status.size()){
						me.getStatusOptions(status[0], judgeStatus.statusSuitList, statusMap);
					}		
					me.show($('#filterCondition'));
				}
				$('[name="type"]').trigger('change');
			}
    	},

    	getStatusOptions: function(statusNode, statusList, statusMap){
    		domUtil.selectSerialize(statusNode, [{key: '全部', value: ''}].concat( limit.map(statusList, function(val){
				return {
					key: statusMap[val],
					value: val
				};
			})));	
    	}
    })
	return advancedQuery;
});


