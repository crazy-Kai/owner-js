/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');
	
	//依赖
	var loadingTimer,
		$ = require('$'),
		Dialog = require('common/dialog'),
		util = require('common/util'),
		Modal = require('model/modal/main'),
		handlerbars = require('common/handlerbars'),
		Validator = require('common/validator'),
		Poploading = require('model/poploading/main');


	function beZero (num) {
		return num < 10 ? '0' + num : num;
	}
	function format (date, separator) {
		separator = separator || '.';
		return date.getFullYear(date) + separator + beZero(date.getMonth() + 1) + separator + beZero(date.getDate());
	}

	$.ajaxSetup({ cache: false });

	function ajax (opt) {
		loadingTimer = setTimeout( function () {
			Poploading.show();
		}, 1000);

		$.ajax({
			url: opt.url,
			type: opt.type || 'GET',
			data: opt.data || {}
		}).done( function (res) {
			clearTimeout(loadingTimer);
			Poploading.hide();
			opt.cb(res);
		});
	}

	
	ajax({
		url: '/account/accountRpc/queryAccountInfo.json',
		cb: function (res) {
			var personalCenterVo,
				editing = false,
				template = {},
				legalPersonTypeMap = {
					enterprise: '企业',
					association: '协会',
					institution: '事业单位'
				},
				idcardTypeMap = {
					idcard: '身份证',
					passport: '护照',
					businesspermit: '营业执照'
				};


			if (res.hasError) {
				Modal.alert(0, '加载页面出错');
			} else {

				personalCenterVo = res.content.retValue;
				personalCenterVo.hasData = !!(personalCenterVo.lassenAccountNormalDo || personalCenterVo.lassenAccountLegalPersonDo);

				personalCenterVo.lassenAccountLegalPersonDo = personalCenterVo.lassenAccountLegalPersonDo || {};
				personalCenterVo.lassenAccountNormalDo = personalCenterVo.lassenAccountNormalDo || {};
				personalCenterVo.lassenAccountCertificationDo = personalCenterVo.lassenAccountCertificationDo || {};

				if(!personalCenterVo){
					return ;
				}

				var legalPerson = personalCenterVo.lassenAccountLegalPersonDo;
				var accountNormal = personalCenterVo.lassenAccountNormalDo;
				var AccountCertification = personalCenterVo.lassenAccountCertificationDo;

				

				if (personalCenterVo.status == 'certification') {//认证数据
					personalCenterVo.idcardNumber =  personalCenterVo.idcardNumber || '';
					personalCenterVo.openaccountId = personalCenterVo.openaccountId || '';
				}
				template.childInfo = handlerbars.compile($('#template-child-info').html());
				$('.child-info').html(template.childInfo(personalCenterVo));



				var validatorExp = new Validator({
			        element: '.JS-basic-info',
			        failSilently: true
			    });

				function addValidator () {
					validatorExp.addItem({
					    element: '[name=name]',
					    required: true,
					    rule: 'maxlength{"max":200}'
					})
					.addItem({
					    element: '[name=mobile]',
					    required: true,
					    rule: 'mobile'
					})
					.addItem({
					    element: '[name=tel]',
					    rule: 'tel'
					})
					.addItem({
					    element: '[name=idcardNumber]',
					    required: true,
					    rule: 'maxlength{"max":100}'
					})
					.addItem({
					    element: '[name=mailbox]',
					    required: true,
					    rule: 'email,maxlength{"max":100}'
					})
					.addItem({
					    element: '[name=postalcode]',
					    rule: 'postalcode'
					})
					.addItem({
					    element: '[name=legalPerson]',
					    required: true,
					    rule: 'maxlength{"max":200}'
					})
					.addItem({
					    element: '[name=nationality]',
					    rule: 'maxlength{"max":20}'
					}).addItem({
					    element: '[name=homeAddress]',
					    rule: 'maxlength{"max":300}'
					})
					.addItem({
					    element: '[name=currentAddress]',
					    rule: 'maxlength{"max":300}',
					    required: true,
					})
					.addItem({
					    element: '[name=mailingAddress]',
					    rule: 'maxlength{"max":300}',
					    required: true,
					})
					.addItem({
					    element: '[name=registeredAddress]',
					    required: true,
					    rule: 'maxlength{"max":300}'
					})
					.addItem({
					    element: '[name=aliim]',
					    rule: 'maxlength{"max":30}'
					}).addItem({
					    element: '[name=profession]',
					    rule: 'maxlength{"max":30}'
					}).addItem({
					    element: '[name=linkman]',
					    required: true,
					    rule: 'maxlength{"max":200}'
					});
				};

				function removeValidator () {
					validatorExp.removeItem('[name=name]')
					.removeItem('[name=mailbox]')
					.removeItem('[name=postalcode]')
					.removeItem('[name=legalPerson]')
					.removeItem('[name=nationality]')
					.removeItem('[name=currentAddress]')
					.removeItem('[name=homeAddress]')
					.removeItem('[name=profession]')
					.removeItem('[name=linkman]')
					.removeItem('[name=registeredAddress]')
					.removeItem('[name=mailingAddress]')
					.removeItem('[name=aliim]');
				};

				function initInfo () {//初始化基本信息
					removeValidator();

					if (personalCenterVo.type == 'normal') {
						if (accountNormal) {
							if (accountNormal.gender) {
								accountNormal.genderEx = accountNormal.gender == 'male' ? '男' : '女';
							}
							accountNormal.mobileEx = accountNormal.mobile || '';
							accountNormal.telEx = accountNormal.tel || '';
							// 删除生日 2015.09.25 因为初始化时间戳可能是负数，这个传到后台，后台的JSON解析会报错
							delete accountNormal.birthday
						}
						template.normalInfo = template.normalInfo || handlerbars.compile($('#template-normal-info').html());
						$('.JS-basic-info').html(template.normalInfo(personalCenterVo));
					} else if (personalCenterVo.type == 'legalPerson') {
						if(legalPerson){
							legalPerson.idcardNumberEx = legalPerson.idcardNumber || '';
							legalPerson.mobileEx = legalPerson.mobile || '';
							legalPerson.telEx = legalPerson.tel || '';
							legalPerson.typeEx = legalPersonTypeMap[legalPerson.type];
							legalPerson.idcardTypeEx = idcardTypeMap[legalPerson.idcardType];
						}
						template.legalInfo = template.legalInfo || handlerbars.compile($('#template-legal-info').html());
						$('.JS-basic-info').html(template.legalInfo(personalCenterVo));
					}

					editing = false;
					$('.JS-edit-info').text('编辑信息');
				};
				
				$('.JS-edit-info').click( function (e) {//编辑按钮
					e.preventDefault();
					if (editing) {
						initInfo();
					} else {

						if (!personalCenterVo.hasData) {
							//$('.account-layer iframe').attr('src', '/account/accountType.htm');
							//$('.account-layer, .mask').show();
							return;
						}

						$(this).text('取消编辑');
						if (personalCenterVo.type == 'normal') {
							template.normalInfoEdit = template.normalInfoEdit || handlerbars.compile($('#template-normal-info-edit').html());
							$('.JS-basic-info').html(template.normalInfoEdit(personalCenterVo));
						} else if (personalCenterVo.type == 'legalPerson') {
							template.legalInfoEdit = template.legalInfoEdit || handlerbars.compile($('#template-legal-info-edit').html());
							$('.JS-basic-info').html(template.legalInfoEdit(personalCenterVo));
						}
						editing = true;
						addValidator();
					}
				});

			
				$('.JS-basic-info').on('focus', 'input[name=mobile], input[name=tel], input[name=idcardNumber], [name=mailbox]', 
				function () {
					var val = $.trim($(this).val());
					if (val && val.indexOf('*') != -1) {
						$(this).val('');
					}
				});

				$('.JS-basic-info').on('click', '.JS-submit-edit', function (e) {//提交按钮
					e.preventDefault();
					var save;
					if (personalCenterVo.type == 'normal') {
						save = accountNormal;
					} else if (personalCenterVo.type == 'legalPerson') {
						save = legalPerson;
					}
					save = save || {};

					var mobile = $.trim($('.JS-basic-info input[name=mobile]').val());
					var tel = $.trim($('.JS-basic-info input[name=tel]').val());
					var idcardNumber = $.trim($('.JS-basic-info input[name=idcardNumber]').val()) || '';
					var mailbox = $.trim($('.JS-basic-info input[name=mailbox]').val());

					validatorExp.removeItem('[name=mobile]')
					.removeItem('[name=tel]')
					.removeItem('[name=mailbox]')
					.removeItem('[name=idcardNumber]')

					if (!mobile || save['mobile'] != mobile) {
						validatorExp.addItem({
						    element: '[name=mobile]',
						    required: true,
						    rule: 'mobile'
						});
					}
					if (accountNormal['tel'] != tel) {
						validatorExp.addItem({
						    element: '[name=tel]',
						    rule: 'tel'
						});
					}

					if (!mailbox || save['mailbox'] != mailbox) {
						validatorExp.addItem({
						    element: '[name=mailbox]',
						    required: true,
						    rule: 'email,maxlength{"max":100}'
						});
					}

					if (!idcardNumber || save['idcardNumber'] != idcardNumber) {
						validatorExp.addItem({
						    element: '[name=idcardNumber]',
						    required: true,
						    rule: 'maxlength{"max":100}'
						});
					}

					$('.JS-basic-info .fn-input-text').each(function (){
						$(this).val($.trim($(this).val()) || '');
					});

					validatorExp.execute( function(flag, element){
						if (flag) {
							e.preventDefault();
							
						} else {
							

							$('.JS-basic-info .fn-input-text, .JS-basic-info select').each(function (){
								save[$(this).attr('name')] = $.trim($(this).val()) || '';
							});

							if (save['mobile'].indexOf('*') != -1) {
								delete save['mobile'];
							}
							if (save['tel'].indexOf('*') != -1) {
								delete save['tel'];
							}
							if (save['mailbox'].indexOf('*') != -1) {
								delete save['mailbox'];
							}
							if (save['idcardNumber'] && save['idcardNumber'].indexOf('*') != -1) {
								delete save['idcardNumber'];
							}


							if (personalCenterVo.type == 'normal') {
								accountNormal['gender'] = $('.JS-basic-info input[type=radio]:checked').val() || '';
							}

							/*
							if (save[mobile] == '' && save['mailbox'] == '') {
								alert(0, '手机和邮箱至少填写一个');
								return
							}
							*/


							ajax({
								url: '/account/accountRpc/submitAccount.json',
								type: 'POST',
								data: {personCenterVo: JSON.stringify(personalCenterVo)},
								cb: function (res) {
									if (res.hasError) {
										Modal.alert(0, '编辑信息失败');
									} else {
										if (!res.content) {
											Modal.alert(0, '编辑信息失败');
											return;
										}
										if (res.content.isSuccess) {
											window.location.reload();
										} else {
											Modal.alert(0, res.content.message);
										}
										
									}
								}
							});
							
						}
					});
				});

				initInfo();


				//关联账号
				var accountBinding = personalCenterVo.accountBindingDoList || [];
				var sourceMap = {
					asip:  '知识产权',
					taobao: '淘宝',
					alipay: '支付宝'
				};
				for (var i = 0; i < accountBinding.length; i++) {
					accountBinding[i].sourceEx = sourceMap[accountBinding[i].source];
				}
				template.accountBinding = handlerbars.compile($('#template-bind-account').html());
				$('.JS-bind-account').html(template.accountBinding(personalCenterVo));
    			$('.JS-bind-account').on('click', '.JS-trigger-unbind', function(e){
    				var url = encodeURI($(e.target).data('url'));
					Modal.confirm('提示 ', '解绑后，如再起诉需重新绑定电商账号。', function(){
						ajax({
							type: 'POST',
							url: url,
							cb: function (res) {
								if (res.hasError) {
									Modal.alert(0, '解除关联失败');
								} else {
									if (res.content.isSuccess) {
										window.location.reload();
									} else {
										Modal.alert(0, res.content.message);
									}
								}
							}
						});
                    });
    				

    			});

				//认证信息
				var accountCertification = personalCenterVo.lassenAccountCertificationDo;
				function initCertification (accountCertification) {
					var certification = false;
					if(accountCertification){
						accountCertification.idcardTypeEx = idcardTypeMap[accountCertification.idcardType];
						accountCertification.idcardNumberEx = accountCertification.idcardNumber || '';
						accountCertification.expireDateEx = accountCertification.expireDateStart ? format(new Date(accountCertification.expireDateStart)) + '-' + format(new Date(accountCertification.expireDateEnd)) : '';
						$('.person-center-status .card-number').text(accountCertification.idcardNumberEx);
						certification = true;
					}
					template.accountCertification = handlerbars.compile($('#template-account-certification').html());
					$('.JS-validate-info').html(template.accountCertification({
						lassenAccountCertificationDo: accountCertification,
						certification: certification
					}));
				}
				initCertification(accountCertification);
				
				$('.JS-validate-info').on('click', '.JS-certificate', function (e) {//获取最新认证信息
					e.preventDefault();
					Dialog.show('/havCeresLogin.htm', {width: 380, height:380});
				});
			}
		}
	});

	$(document).on('click', '.bind-link', function (e) {
		e.preventDefault();
		Dialog.show($(this).attr('href'), {width: 380, height:380});
	});

/*
	window.bindSuccess = function () {
		window.location.reload(true);
	}

	window.bindError = function (msg) {
		$('.account-layer, .mask').hide();
		Modal.alert(0, msg);
	}
*/
});