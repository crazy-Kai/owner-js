"use strict";
/**
 * 组件选择法律依据
 * 2016,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		cookie = require('common/cookie'),
		MyWidget = require('common/myWidget'),
		Validator = require('common/validator'),
		Dialog = require('dialog'),
		Handlebars = require('handlebars'),
		areaData = require('model/address/data'),
		Modal = require('model/modal/main'),
		Upload = require('model/upload/main'),
		SearchList = require('model/searchList/main'),
		Address = require('model/address/select'),
		Ajax = require('model/ajax/main');

	// 添加特殊方法
	Handlebars.registerHelper('getCityByareaCode', function(areaCode){
		// 格式化areaCode
		if(areaCode){
			var areaCode = areaCode.slice(0, 4) + '00';
			return areaData[areaCode][0];
		}else{
			return "";
		}
	});

	//变量
	var $ = MyWidget.jQuery,
		handlerbars = MyWidget.handlerbars;

	//类
	var AddLawyer = MyWidget.extend({
		//类名
		clssName: 'AddLawyer',
		//属性
		attrs: {
			element: 'body',
			"getAllFirmAreaCode": "/portal/LawyerServiceRpc/getAllFirmAreaCode.json",
			"getLawyersGoodTypeDo": "/courtmanage/lassenFirmLawyerRpc/getAllGoodType.json", //律师擅长类型
			"getFirmLawyersDo": "/courtmanage/lassenFirmLawyerRpc/getFirmLawyers.json", //平台入驻律师

			"initAgentAuthDo": "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=AGENT_AUTH", //代理人委托权限
			"initLegalRelationDo": "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_LEGAL", //代理人-法人与当事人的关系
			"initNormalRelationDo": "/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_NORMAL", //代理人-自然人与当事人的关系
			// "initCurrentUserDo": "/suit/lassenLitigantAgentRpc/putRequestParamTogetAgent.json",
			"initAgentListDo": "/suit/lassenLitigantAgentRpc/agentList.json", //获取当事人信息

			"saveLawyerAgent": " /suit/lassenLitigantAgentRpc/saveLawyerAgent.json", //保存律师代理人
			"saveUsedAgent": " /suit/lassenLitigantAgentRpc/saveUsedAgent.json", //保存常用代理人
			"saveNewAgent": " /suit/lassenLitigantAgentRpc/saveNewAgent.json", //保存新增代理人
			"deleteLawyerDo": "/suit/lassenLitigantAgentRpc/delete.json" //删除代理人
		},
		//事件
		events: {
			//被告：增加
			'click .JS-trigger-add-lawyer': function(e){
				//被告：弹出层
				//不可用，禁止事件
				if($(e.target).hasClass('fn-btn-disabled')){
					return true;
				}
				var me = this, 
					data = {};
				me.set('addLawyerTrigger', $(e.target));

        		//常用代理人 与当事人的关系：自然人， 当事人-自然人， normal_lawyer; 法人，当事人-法人：legal_lawyer
        		var relationUrl = "",
        			identity = $('[data-role="identifyType"]').val();
        		
        		if( identity === 'agent'){//代理人
        			if($('input[data-role="ligintEntityType"]').val() === 'normal'){
        				relationUrl = me.get('initNormalRelationDo');
        			}else{
        				relationUrl = me.get('initLegalRelationDo');
        			}
        		}else{
        			if($('input[data-role="entityType"]').val() === 'normal'){
        				relationUrl = me.get('initNormalRelationDo');
        			}else{
        				relationUrl = me.get('initLegalRelationDo');
        			}
        		}

				//var relationUrl =  (me.$('input[data-role="entityType"]').val() == 'legal'? me.get('initLegalRelationDo') : me.get('initNormalRelationDo'));
                //获取关系、权限。常用代理人 初始化信息
                Ajax.when(
                	{request: me.get('initAgentAuthDo')}, 
                	{request: relationUrl},
                	// {request: me.get('initCurrentUserDo') + '?securityId=' + (me.$('input[name="lassenSuitEntityDo.securityId"]').size()>0? me.$('input[name="lassenSuitEntityDo.securityId"]').val() : '')},
                	{request: me.get('getLawyersGoodTypeDo')},
                	{request: me.get('initAgentListDo')},
                	{request: me.get('getAllFirmAreaCode')}
                	).then(
                	function(rs1, rs2, rs3, rs4, rs5){
                		data.relation =  (rs1.val ? JSON.parse(rs1.val) : {}); //与当事人的关系
                		data.agentAuth = (rs2.val ? JSON.parse(rs2.val) : {}); //委托权限
                		data.goodType = (rs3.val ? rs3.val : {}); //委托权限
                		data.agentList = (rs4.val? rs4.val : []);
                		var areaCodeArray = (rs5.val? rs5.val : []);
                		var areaCode = new Array;
                		
                		//查询常用代理人
                		$.each(areaCodeArray, function(i, item){
                			areaCode.push({key:item.areaCode, value:areaData[item.areaCode][0]})
                		});

                		data.areaCode = areaCode;

                		//显示弹出层
							var dag = new Dialog({
								width: 720,
								content:me.addAgentlawyer(data),
								events: {
									//点击提交
									'click [data-trigger]': function(e){ //切换tab
										e.preventDefault();
										me.$('div[data-role="lawyer-div"]').hide();
										var triggerDiv = me.$(e.target).data('trigger');
										me.$('#'+triggerDiv).show();
										me.$('a[data-trigger]').removeClass('ch-active');
										me.$(e.target).addClass('ch-active');
									},
									'click #platform-lawyer-next': function(e){ //<平台入驻律师>下一步
										if(me.$('[data-role="selectLawyerRadio"]').filter(":checked").size()>=1){
											me.$('div[data-role="lawyer-div"]').hide();
											me.$('#platform-lawyer-next-div').show();
											me.$('a[data-trigger]:first').data('trigger', 'platform-lawyer-next-div');
										}else{
											Modal.alert('提醒', '请选择代理律师。');
										}
									},
									'click #platform-lawyer-prev': function(e){ //<平台入驻律师>上一步
										me.$('div[data-role="lawyer-div"]').hide();
										me.$('#platform-lawyer').show();
										me.$('a[data-trigger]:first').data('trigger', 'platform-lawyer');
									},
									'click #platform-lawyer-save': function(e){ //<平台入驻律师> 保存
										me.doSave(dag, 'saveLawyerAgent', 'form-platform-lawyer');
									},
									'click #common-lawyer-save': function(e){ //<常用代理人> 保存
										me.doSave(dag, 'saveUsedAgent', 'form-common-lawyer');
									},
									'click #other-lawyer-save': function(e){ //<添加其他代理人> 保存
										me.doSave(dag, 'saveNewAgent', 'form-other-lawyer');
									},
									'click [data-role="selectLawyerTr"]': function(e){ //<律师列表> 点击单行触发选中
										var tr = $(e.target).closest('tr');
										var phone = tr.find('[name="mobile"]').val();
										var radio = tr.find('[data-role="selectLawyerRadio"]')
										radio.prop('checked', true);
										me.$('#lawyer-phonenumber').html(phone);
										me.$('#lawyer-phonenumber').append('<input type="hidden" name="agentUserId" value="'+ radio.data('accountid') +'">')
									},
									'change [data-role="selectAgent"]': function(e){ //<常用代理人> 
										var tgt = me.$(e.target);
										var option = tgt.find('option:selected');
										var index = option.index('[data-role="selectAgent"] option');
										me.validators['saveUsedAgent'].removeItems('#common-lawyer [data-role="commonRelationFile"]');
										me.changeCommonlawyer(data.agentList[index]);
										me.uploads = ( (me.uploads ? me.uploads : []).concat(Upload.use('#common-lawyer [data-role="commonRelationFile"] .JS-need-upload')) );
										$('select[data-relation="commonLawyerRelationCode"]').trigger('change');
										//me.validators['saveUsedAgent'].addItems('#common-lawyer [data-role="commonRelationFile"]');
									},
									'click i[data-role="triggerQuery"]': function(e){ //<常用代理人> 
										me.searchListExp[0].searchListReload();
									},
									'change select[data-role="triggerQuery"]': function(e){ //<常用代理人> 
										me.searchListExp[0].searchListReload();
									},
									'change select[data-relation="commonLawyerRelationCode"]': function(e){ //<常用代理人> 
										var type = $(e.target).val();
								        if(type === 'normal_lawyer' || type === 'legal_lawyer'){
								            me.$('#common-lawyer [data-role="commonRelationFileTr"]').addClass("fn-hide JS-serialize-exclude");
								            me.validators['saveUsedAgent'].removeItems('#common-lawyer [data-role="commonRelationFile"]');
								        }else{
								            me.$('#common-lawyer [data-role="commonRelationFileTr"]').removeClass("fn-hide JS-serialize-exclude");
								            var havaTheValidator = false;
								            var elements = $.map(me.validators['saveUsedAgent'].items, function(item){
												return item.element;
								            });
								            $.each(elements, function(index, item){
								            	if(item.prop('name') === 'relationFile'){
								            		havaTheValidator = true;
								            	}
								            });
								            !havaTheValidator &&  me.validators['saveUsedAgent'].addItems('#common-lawyer [data-role="commonRelationFile"]');
								        }
									},
									'change select[data-relation="otherLawyerRelationCode"]': function(e){ //<常用代理人> 
										var type = $(e.target).val();
								        if(type === 'normal_lawyer' || type === 'legal_lawyer'){
								            me.$('#other-lawyer [data-role="commonRelationFileTr"]').addClass("fn-hide JS-serialize-exclude");
								            me.validators['saveNewAgent'].removeItems('#other-lawyer [data-role="commonRelationFileTr"]');
								        }else{
								            me.$('#other-lawyer [data-role="commonRelationFileTr"]').removeClass("fn-hide JS-serialize-exclude");

											var havaTheValidator = false;
								            var elements = $.map(me.validators['saveNewAgent'].items, function(item){
												return item.element;
								            });
								            $.each(elements, function(index, item){
								            	if(item.prop('name') === 'relationFile'){
								            		havaTheValidator = true;
								            	}
								            });
								            !havaTheValidator &&  me.validators['saveNewAgent'].addItems('#other-lawyer [data-role="commonRelationFileTr"]');
								        }
									}
								}
							}).after('show', function(){
								if(data.agentList.length>0){
									me.changeCommonlawyer(data.agentList[0]);
								}

								me.$('[name="auth"][value="common_agent"]').prop('checked', true);
								//组件：查询
								me.searchListExp = SearchList.use('#search-list', {template:me.$("#agent-lawyer-table-template").html(), pageParentNode: $('.page')});
								
				        		me.uploads = Upload.use('.agent-lawyer .JS-need-upload');
				        		//为三个tab添加校验
				        		me.validators = [];
				        		me.validators['saveLawyerAgent'] = Validator.use('#form-platform-lawyer');
				        		me.validators['saveUsedAgent'] = Validator.use('#form-common-lawyer');
				        		me.validators['saveNewAgent']  = Validator.use('#form-other-lawyer');
				        		//常用代理人 与当事人的关系：自然人， 当事人-自然人， normal_lawyer; 法人，当事人-法人：legal_lawyer
				        		var identity = $('[data-role="identifyType"]').val();
				        		if( identity === 'agent'){//代理人
				        			if($('input[data-role="ligintEntityType"]').val() === 'normal'){
				        				$('#form-platform-lawyer [name="relationCode"]').val('normal_lawyer')
				        			}else{
				        				$('#form-platform-lawyer [name="relationCode"]').val('legal_lawyer')
				        			}
				        		}else{
				        			if($('input[data-role="entityType"]').val() === 'normal'){
				        				$('#form-platform-lawyer [name="relationCode"]').val('normal_lawyer')
				        			}else{
				        				$('#form-platform-lawyer [name="relationCode"]').val('legal_lawyer')
				        			}
				        		}
				        		me.$('.agent-lawyer [name="securityCaseId"]').val(me.$('.fn-margin-center [name="securityCaseId"]').val())
				        		$('select[data-relation="commonLawyerRelationCode"]').trigger('change');
				        		$('select[data-relation="otherLawyerRelationCode"]').trigger('change');
				    		}).after('hide', function(){
				    			$.each(me.uploads, function(index, item){
				    				//console.log(index, item.get('trigger').data('inputName'));
				    				item.destroy();
				    			});
								dag.destroy();
				    		}).render();
				    		dag.show();		 

                	}, 
                	function(rs1, rs2, rs3, rs4, rs5){
                		Modal.alert(0, "系统繁忙，请联系管理员");
                	});
			},
			//删除代理人
			'click .JS-trigger-click-delete-lawyer': function(e){
				var me = this, 
					tgt = $(e.target);
				Modal.confirm('提醒', '您确定要删除嘛？', function(){
                    new Ajax({
	                    request: me.get('deleteLawyerDo') + '?securityId=' + tgt.data('param')
	                }).on('ajaxSuccess', function(rtv, msg, con){tgt.closest('tr').remove();
	                	var agent = me.$('[name="agentRelationId"]');
	                	if(agent.val() != 'agent' || (agent.val() == 'agent' && me.$('.JS-trigger-click-delete-lawyer').size() == 0)){
	                		agent.val("");
	                	}
                		//me.$('[name="agentRelationId"]').val('');
                		if(me.$('.JS-trigger-click-delete-lawyer').size() == 0){
                			var target = me.$(".JS-trigger-add-lawyer");
                			target.removeClass('fn-btn-disabled').addClass('fn-btn-default');
                			if(target.nextAll("#addLawyerNote").size()){
                				target.nextAll("#addLawyerNote").remove();
                			}
                		}
	                }).submit(); 
                });
			}
		},
		//初始化数据
		initProps: function(){
			var me = this;
			me.addAgentlawyer = handlerbars.compile(me.$("#add-agent-lawyer-template"), true);
			me.agentlawyerInfo = handlerbars.compile(me.$("#my-lawyer-template"), true); //返回的代理人信息
			me.commonLawyerRalationFile = handlerbars.compile(me.$("#a-common-relationfile-template"), true); //返回的代理人信息
			me.staticLawyerRalationFile = handlerbars.compile(me.$("#a-static-relationfile-template"), true); //返回的代理人信息
			me.searchListExp = null;
		},
		//入口
		setup: function(){
		},

		//常用代理人变换
		changeCommonlawyer: function(agentInfo){
			var me = this;
			agentInfo.inputName = "relationFile";
			me.$('#common-lawyer [name="agentUserId"]').val(agentInfo.agentUserId);
			me.$('[data-role="selectrelationCode"] option[value="'+agentInfo.relationCode+'"]').prop('selected', true);
			me.$('#common-lawyer [data-role="commonRelationFile"]').html(me.staticLawyerRalationFile(agentInfo))
		},
		//回写代理人信息
		afterGetLawyer : function(dag, rtv, msg, con){ //返回的代理人信息
			var me = this;
			var target = me.get('addLawyerTrigger');
			var tr = target.closest('tr');
			if(tr.size()>0){
				tr.after(me.agentlawyerInfo(rtv));
				target.addClass('fn-btn-disabled').removeClass('fn-btn-default');
				dag.hide();
				var next = target.next('input');
				next.val(rtv.securityId);
				next.after("<span id='addLawyerNote' class='fn-color-047DC6 fn-BoAlSo fn-LH20 fn-PaAl8 fn-VAMiddle'>如果还需要添加代理人，请操作我的诉讼案件列表，代理人管理进行添加。</span>")
			}else{ 
				me.trigger('addLawyerSuccess');
				Modal.alert(1, msg)
				dag.hide();
				setTimeout(window.location.reload(), 3000);
			}
			
		},
		//验证表单，提交表单
		doSave :function(dag, validatorName, formName){ //返回的代理人信息
			var me = this;
			me.validators[validatorName].execute(function(err, errlist){
				if(!err){
					new Ajax({
	                    request: me.get(validatorName), 
	                    paramName: "fileMap",
	                    parseForm: $("#"+formName)
	                }).on('ajaxSuccess', function(rtv, msg, con){
	                    me.afterGetLawyer(dag, rtv, msg, con);
	                }).submit();
				}
			});
		}
		
	});

	return AddLawyer;

});