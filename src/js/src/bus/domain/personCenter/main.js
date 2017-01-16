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
		limit = require('common/limit'),
		Dialog = require('common/dialog'),
		Ajax = require('model/ajax/main'),
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
			        failSilently: true,
			        skipHidden: true
			    });

				function addValidator () {
					console.log('add');
					$('.JS-basic-info table').on('blur', 'input[type="text"]', function(){
				        var self = $(this);
				        if(self.prop('defaultValue') === self.prop('value')){
				            self.addClass('fn-hide');
				        }
				    });
				    $('body').on('blur', 'input[type="text"]', function(){
				        var self = $(this);
				        self.removeClass('fn-hide');
				    });
					//自然人
					validatorExp.addItem({
					    element: '[name="lassenAccountNormalDo.name"]',
					    required: true,
					    rule: 'maxlength{"max":200}'
					})
					.addItem({
					    element: '[name="lassenAccountNormalDo.mobile"]',
					    required: true,
					    rule: 'mobile'
					})
					.addItem({
					    element: '[name="lassenAccountNormalDo.mailbox"]',
					    required: true,
					    rule: 'email,maxlength{"max":100}'
					})
					.addItem({
					    element: '[name="lassenAccountNormalDo.tel"]',
					    rule: 'tel'
					})
					
					.addItem({
					    element: '[name="lassenAccountNormalDo.postalcode"]',
					    rule: 'postalcode'
					})
					
					.addItem({
					    element: '[name="lassenAccountNormalDo.nationality"]',
					    rule: 'maxlength{"max":20}'
					})
					.addItem({
					    element: '[name="lassenAccountNormalDo.homeAddress"]',
					    rule: 'maxlength{"max":300}'
					})
					.addItem({
					    element: '[name="lassenAccountNormalDo.currentAddress"]',
					    rule: 'maxlength{"max":300}',
					    required: true,
					})
					.addItem({
					    element: '[name="lassenAccountNormalDo.mailingAddress"]',
					    rule: 'maxlength{"max":300}',
					    required: true,
					})
					
					// .addItem({
					//     element: '[name=aliim]',
					//     rule: 'maxlength{"max":30}'
					// })
                    .addItem({
					    element: '[name="lassenAccountNormalDo.profession"]',
					    rule: 'maxlength{"max":30}'
					})
	
					// 法人
					validatorExp.addItem({
						element:'[name="lassenAccountLegalPersonDo.name"]',
						required: true,
					    rule: 'maxlength{"max":200}'
					})
					.addItem({
				    element: '[name="lassenAccountLegalPersonDo.legalPerson"]',
				    required: true,
				    rule: 'maxlength{"max":200}'
					})
					.addItem({
					    element: '[name="lassenAccountLegalPersonDo.linkman"]',
					    required: true,
					    rule: 'maxlength{"max":200}'
					})
				   .addItem({
				    element: '[name="lassenAccountLegalPersonDo.profession"]',
				    rule: 'maxlength{"max":30}'
					})
				   .addItem({
					    element: '[name="lassenAccountLegalPersonDo.mobile"]',
					    required: true,
					    rule: 'mobile'
					})
				   .addItem({
					    element: '[name="lassenAccountLegalPersonDo.mailbox"]',
					    required: true,
					    rule: 'email,maxlength{"max":100}'
					})
				   .addItem({
					    element: '[name="lassenAccountLegalPersonDo.idcardNumber"]',
					    required: true,
					    rule: 'maxlength{"max":100}'
					})
				   	.addItem({
					    element: '[name="lassenAccountLegalPersonDo.registeredAddress"]',
					    required: true,
					    rule: 'maxlength{"max":300}'
					})
					.addItem({
				    element: '[name="lassenAccountLegalPersonDo.mailingAddress"]',
				    rule: 'maxlength{"max":300}',
				    required: true,
					})
					.addItem({
					    element: '[name="lassenAccountLegalPersonDo.postalcode"]',
					    rule: 'postalcode'
					})
					.addItem({
					    element: '[name="lassenAccountLegalPersonDo.tel"]',
					    rule: 'tel'
					})
				};

				function removeValidator () {
					$('.JS-basic-info table').off('blur');
				    $('body').off('blur');
				    console.log('remove');
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

				function hiddenInputInNeed(){
					$('.JS-basic-info').find('input[type="text"]').each(function(){
			            var self = $(this);
			            if( self.val().indexOf('*') !== -1 && self.prop('defaultValue') === self.prop('value') ){
			                self.addClass('fn-hide');
			            }
			        });
				};

				function showInputInNeed(){
					$('.JS-basic-info').find('input[type="text"]').removeClass('fn-hide');
				};

				$('.JS-basic-info').on('click', '.JS-submit-edit', function (e) {//提交按钮
					// 隐藏该隐藏的
					hiddenInputInNeed();

					validatorExp.execute( function(flag, element){
						// 显示该显示的
						showInputInNeed();
						if (!flag) {
							new Ajax({
								request: '/account/accountRpc/submitAccount.json',
								paramName: 'personCenterVo',
		                        parseForm: '.JS-basic-info',
		                        paramParse: function(json){
		                        	limit.each(json, function(val){
		                        		limit.each(val, function(v, k){
		                        			if( v.indexOf('*') !== -1 ){
		                        				delete val[k];
		                        			};
		                        		});
		                        	});
		                            return json;
		                        }
		                    }).on('ajaxSuccess', function(rtv, msg, con){
		                    	window.location.reload();
		                    }).submit();
						};
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