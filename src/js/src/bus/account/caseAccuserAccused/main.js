"use strict";
/**
 * 业务：调解服务[conciliation/mediatorList]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var $ = require('$'),
		PerSearch = require('model/perSearch/main'),
		Validator = require('common/validator'),
		Ajax = require('model/ajax/main'),
		Modal = require('model/modal/main'),
		Handlebars = require('handlebars');

	// 变量
	var Tpl = Handlebars.compile( $('#caseAccuserAccused-template').html() );
		
	//组件：查询
	var searchListExp = PerSearch.use('.searchList', {
		mapResponse: function(response){
			if(response.isSuccess){
				return {data: [].concat(response.retValue.accusedsList, response.retValue.accusersList), success: true}; 
			}else{
				Modal.alert(0, response.message);
				return {data: []};
			};
		},
		events: {
			// 编辑
			'click [data-role="edit"]': function(e){
				new Ajax({
					request: '/account/mediatorResendRpc/getMobileMailboxByEntityId.json',
					param: $(e.target).data('param')
				}).on('ajaxSuccess', showModal).submit();
			},
			// 发送关联码
			'click [data-role="code"]': function(e){
				new Ajax({
					request: '/account/mediatorResendRpc/sendAssociateCode.json',
					paramName: 'lassenSuitEntityVo',
					param: $(e.target).data('param'),
					autoSuccessAlert: true
				}).submit();
			}
		}
	})[0];

	// 显示弹出层
	function showModal(cont, msg, response, param){
		Modal.show( Tpl( $.extend(cont, param) ) , {
			width:500,
			events: {
				'click [data-role="submit"]': function(){
					if( !Validator.oneExecute(this.element, '[data-widget="validator"]') ){
						submitData.call(this);
					};
				}
			}
		});
	};

	// 函数
	function submitData(){
		var me = this;
		new Ajax({
			request: '/account/mediatorResendRpc/save.json',
			paramName: 'lassenSuitEntityVo',
			parseForm: me.element
		}).on('ajaxSuccess', function(val, msg, response){
			me.hide();
			searchListExp.searchListReload();
			Modal.alert(1, msg);
		}).submit();
	};


});