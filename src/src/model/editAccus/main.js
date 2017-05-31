"use strict";
/**
 * 组件选择法律依据
 * 2015,06,12 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		MyWidget = require('common/myWidget'),
		Validator = require('common/validator'),
		Dialog = require('dialog'),
		Modal = require('model/modal/main'),
		Calendar = require('common/calendar'),
		Ajax = require('model/ajax/main'),
		SelectForCompanyAddress = require('model/selectForCompanyAddress/main');

	//变量
	var $ = MyWidget.jQuery,
		handlerbars = MyWidget.handlerbars;

	//类
	var EditAccus = MyWidget.extend({
		//类名
		clssName: 'EditAccus',
		//属性
		attrs: {
			"saveSuitEntityDo": " /suit/suitEntityRpc/saveSuitEntityDo.json", //被告：增加
			"deleteSuitEntity": "/suit/suitEntityRpc/deleteSuitEntity.json", //被告：删除
			"getSuitEntityDo": "/suit/suitEntityRpc/getSuitEntityDo.json", //被告：查询
			"maxAccused": 4 //最大被告数量
		},
		//事件
		events: {
			//被告：增加
			'click .JS-trigger-click-add': function(e){
				var me = this,
					target = $(e.target).closest('.JS-trigger-click-add');
				if(target.hasClass('fn-btn-disabled')){
					return me;
				}
				me.soCheckHumenOrCompany('normal');
				me.soPersonChange('normal');
				me.soAddAccusedShow('新增被告');
				me.isFirstAccuse = null;
				me.soCheckIsFirst();
				delete me.soEditorDom;
			}, 
			'click .JS-trigger-click-delete': 'soDeleteAccused', //被告：删除
			'click .JS-trigger-click-editor': 'soEditorAccused' //被告：编辑
		},
		//初始化数据
		initProps: function(){
			var me = this;
			//被告：第一个被告
			me.soFirstAccused = me.$('.JS-target-first-accused');
			//被告：编辑模板
			me.soTempleAccused = handlerbars.compile( me.$('.JS-temple-accused-edit').html() );
			//被告：数据模板
			me.soAccusedTemple = handlerbars.compile( me.$('.JS-temple-accused-data').html() );
			//被告：弹出层
			me.soAddAccusedDialog = new Dialog({
				width: 450,
				content: me.soTempleAccused(),
				events: {
					//点击提交
					'click .JS-trigger-click-submit': function(){
						// 2016.1.4 增加处理如果
						me.soHideSomeInput();
						//验证
						me.validator.execute(function(flag, err){
							me.soShowSomeInput();
							if(flag){
								return me.log(err)
							}
							var formDo = me.serialize(me.soOrderForm),
								DO = me.paseParam( 'lassenSuitEntityDo', formDo );
							//判断手机和邮箱是否都存在
							if( !formDo.lassenSuitEntityDo.mobile && !formDo.lassenSuitEntityDo.email  ){
								return Modal.alert('提醒', '手机和邮箱必须填一个');
							}
							me.soSaveSuitEntityDo();
						});
					},
					//选择自然人法人
					'click .JS-trigger-change-person': function(e){
						me.soPersonChange( $(e.target).val() );
					},
					// 移除焦点
					'blur [type="text"]': function(e){
						$(e.target).removeClass('fn-hide');
					}
				}
			}).render();
			//被告：被告全部表单
			me.soOrderForm = me.soAddAccusedDialog.$('.JS-target-form');
			//被告：自然人表单
			me.soHumen = me.soAddAccusedDialog.$('.JS-target-humen');
			//被告：公司表单
			me.soCompany = me.soAddAccusedDialog.$('.JS-target-company');
			//被告：增加验证
			me.validator = Validator.use(me.soOrderForm);
			//被告：计数
			me.soAccusedGuid = me.$('.JS-target-accused').length;
			// 被告：年月
			me.calendar = new Calendar({trigger: me.soAddAccusedDialog.$('[name="lassenSuitEntityDo.birthday"]')});
			// 增加脱敏事件
			me.soAddAccusedDialog.$('table').on('blur', '[type="text"]', function(){
				hideSecretInput( $(this) )
			});
		},
		//入口
		setup: function(){
			var me = this;
			//新增被告的事件绑定
			me.soAddAccusedDialog.after('hide', function(){
				me.soResetSuatus();
				me.resetForm(me.soOrderForm);
			}).before('show', function(){
				this.$('.JS-target-title').html(me.soAddAccusedTitle);
				
			});
			// 这个判断数量
			me.soTriggerAccuseAddToggle();
			// 初始化公司自动选择组件
			new SelectForCompanyAddress({trigger: me.soAddAccusedDialog.$('[name="lassenSuitEntityDo.companyName"]')});
		},
		// 被告：保存数据
		soSaveSuitEntityDo: function(){
			var me = this;
			me.soOrderForm.find('[name="lassenSuitEntityDo.entityType"]').prop('disabled', false);
			new Ajax({
				request: me.get('saveSuitEntityDo'),
				autoSubmit: true,
				paramName: 'filterMap',
				parseForm: me.soOrderForm,
				paramParse: function(json){
	                for(var i in json){
	                    for(var j in json[i]){
	                        if( json[i][j].indexOf('*') !== -1 ){
	                            delete json[i][j];
	                        };
	                    }
	                }
	                return json;
	            },
				onAjaxSuccess: function(rtv, msg, con){
					//如果存在这个DOM，这是编辑
					if(me.soEditorDom){
						// 如果是第一个订单
						if( me.isFirstAccuse ){
							// 如果不存在me.orderDo出现情况是
							if(!me.orderDo){
								me.orderDo = me.serialize( me.$('.JS-taget-orderdo') );
							}
							rtv.firstAccused = true;
							me.soEditorDom.replaceWith( me.soAccusedTemple(  $.extend(rtv, me.orderDo) ) );
							me.soToggleAddByCauseAction();
						}else{
							me.soEditorDom.replaceWith( me.soAccusedTemple(  rtv ) );
						}
						delete me.soEditorDom;
						//编辑成功
						me.trigger('successEditAccus');
					}
					//新增
					else{
						me.element.append( me.soAccusedTemple(  rtv ) );
						me.soAccusedGuid++;
						me.soTriggerAccuseAddToggle();
						//新增成功
						me.trigger('successAddAccus');
					}
					me.soAddAccusedHide();
				}
			});
			return me;
		},
		//被告：新增是否可用
		soTriggerAccuseAddToggle: function(){
			var me = this,
				maxAccused = me.get('maxAccused');
			if(me.soAccusedGuid >= maxAccused){
				//因为增加按钮是后期生成的
				me.$('.JS-trigger-click-add').addClass('fn-btn-disabled');
			}else{
				me.$('.JS-trigger-click-add').removeClass('fn-btn-disabled');
			}
		},
		//被告：选择自然人或者公司
		soCheckHumenOrCompany: function(flag){
			var me = this;
			if(flag === 'normal'){
				flag = 0;
			}else{
				flag = 1;
			}
			me.soOrderForm.find('.JS-trigger-change-person').eq(flag).prop('checked', true);
			return me;
		},
		//被告：显示
		soAddAccusedShow: function(title){
			var me = this;
			me.soAddAccusedTitle = title;
			me.soAddAccusedDialog.show();
			// 清楚表单
			me.soOrderForm.find('[type="text"]').val('');
			return me;
		},
		//被告：隐藏
		soAddAccusedHide: function(){
			var me = this;
			me.soAddAccusedDialog.hide();
			return me;
		},
		//被告：删除
		soDeleteAccused: function(e){
			var me = this;
			if(e){
				//提示
				Modal.confirm('提示', '确定要删除吗？', function(){
					var node = me.closest( e.target, '.JS-target-accused' );
					me.http( me.get('deleteSuitEntity'), me.serialize( node ), function(err, rtv, msg, con){
						if(err){
							Modal.alert(0, err);
						}else{
							//删除
							node.remove();
							me.soAccusedGuid--;
							me.soTriggerAccuseAddToggle();
							//删除成功
							me.trigger('successDeleteAccus');
						}
					} );
				})
			}
			return me;
		},
		//被告：编辑
		soEditorAccused: function(e){
			var me = this;
			if(e){
				var node = me.closest( e.target, '.JS-target-accused,.JS-target-first-accused' );
				// 存储是否是第一个被告
				me.isFirstAccuse = node.hasClass('JS-target-first-accused');
				me.http( me.get('getSuitEntityDo'), me.serialize( node ), function(err, rtv, msg, con){
					if(err){
						Modal.alert(0, err);
					}else{
						//确认
						me.soResetSuatus();
						me.soCheckHumenOrCompany(rtv.entityType);
						me.soAddAccusedShow('编辑被告');
						// 对出身年年月的日期进行格式化
						// console.log(rtv.birthday);
						rtv.birthday = me.formatData('yyyy-MM-dd', rtv.birthday);
						//数据回写
						me.unSerialize( me.soOrderForm, resetDo(rtv) );
						//清楚被弄赃的表单
						if(rtv.entityType === 'normal'){
							me.soCompany.find('[type="text"]').val('');
						}else{
							me.soHumen.find('[type="text"]').val('');
						};
						me.soPersonChange(rtv.entityType);
						// 如果是第一个被告的话被告主体和姓名是无法更改的
						me.soCheckIsFirst();
						//临时存储编辑的DOM
						me.soEditorDom = node;
					}
				} );
			}
			return me;
		},
		// 确认被告是否是第一个被告
		soCheckIsFirst: function(){
			var me = this;
			if(me.isFirstAccuse){
				me.soOrderForm.find('[name="lassenSuitEntityDo.name"]').prop('readonly', true);
				me.soOrderForm.find('[name="lassenSuitEntityDo.companyName"]').prop('readonly', true);
				me.soOrderForm.find('[name="lassenSuitEntityDo.entityType"]').prop('disabled', true);
			}else{
				me.soOrderForm.find('[name="lassenSuitEntityDo.name"]').prop('readonly', false);
				me.soOrderForm.find('[name="lassenSuitEntityDo.companyName"]').prop('readonly', false);
				me.soOrderForm.find('[name="lassenSuitEntityDo.entityType"]').prop('disabled', false);
			}
			return me;
		},
		//被告：人员的切换
		soPersonChange: function(status){
			var me = this;
			me.soResetSuatus();
			if(status === 'normal'){
				me.disabledFalse(me.soHumen);
				me.soHumen.removeClass('fn-hide');
			}else{
				me.disabledFalse(me.soCompany);
				me.soCompany.removeClass('fn-hide');
			}
			return me;
		},
		//被告：恢复初始化状态
		soResetSuatus: function(){
			var me = this;
			//去除验证错误样式
			me.validator.clearError();
			//设置表单 disabled 为 true required 为 false
			me.disabledTrue(me.soHumen);
			me.soHumen.addClass('fn-hide');
			me.disabledTrue(me.soCompany);
			me.soCompany.addClass('fn-hide');
			return me;
		},
		// 被告：脱敏表单的隐藏
		soHideSomeInput: function(){
			var me = this,
				form = me.soOrderForm;
			form.find('[type="text"]').each(function(){
				hideSecretInput( $(this) );
			});

		},
		// 被告：脱敏表单的显示
		soShowSomeInput: function(){
			var me = this,
				form = me.soOrderForm;
			form.find('[type="text"]').removeClass('fn-hide');
		}
	});


	function hideSecretInput(node){
		var val = node.val(),
			dVal = node.prop('defaultValue');
		// 如果内容存在，且是加密过的和默认值相等就直接隐藏
		if( val && val.indexOf('*') !== -1 && val === dVal ){
			node.addClass('fn-hide');
		};
	};

	
	//函数：数据的解析
	var resetDoObj = {
		'name': '姓名',
		'gender': '性别',
		'curAddress': '住址',
		'mobile': '手机',
		'email': '邮箱',
		'idCard': '身份证号',
		'nation': '民族',
		'birthday': '出身年月',
		'phone': '电话',
		'companyName': '公司名',
		'legalRepresent': '法人代表',
		'contact': '联系人',
		'companyAddress': '公司地址',
		'job': '职位',
		'mailAddress': '通讯地址',
		'securityId': 'securityId'
	}

	//函数：数据回写的过滤  {'name':'aaa'} => {'lassenSuitEntityDo.name': 'aaa'}
	function resetDo(json){
		MyWidget.breakEachObj(json, function(val, key){
			// mook数据
			if( resetDoObj[key] ){
				json['lassenSuitEntityDo.'+key] = val;
				delete json[key];
			}
		});
		return json;
	}


	return EditAccus

});