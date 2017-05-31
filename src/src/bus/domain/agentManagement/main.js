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
		AddLawyer = require('model/addLawyer/main'),
		delegate = require('common/delegate'),
		ImgView = require('model/imgView/main'),
        Validator = require('common/validator'),
		Ajax = require('model/ajax/main');
		new AddLawyer().on('addLawyerSuccess', function(){
            //console.log('addLawyerSuccess');
        });
		new ImgView();
        var validatorExp;

        //编辑代理人权限
		delegate.on('click', '[data-role="editRight"]', function(e){
			var securityId = $(e.target).data('param');
			new Ajax({
                request: '/suit/lassenLitigantAgentRpc/getEntityBySecurityId.json?securityId=' + securityId
            }).on('ajaxSuccess', function(rtv, msg, con){
                var dig = Dialog.showTemplate("#edit-agent-right", rtv, 
                    {width: 720,
                     autoDestroy: true,
                     autoShow: false,
                     events: {
                        'click #save': function(e){
                            if(validatorExp){
                                validatorExp.execute(function(err, errlist){
                                    if(err){
                                        util.log(errlist);
                                    }else{
                                        new Ajax({
                                            request: '/suit/lassenLitigantAgentRpc/updateEntity.json' ,
                                            paramName: "filemap",
                                            parseForm: $("#form-agent"),
                                            autoSuccessAlert:true,
                                            autoErrorAlert:true,
                                        }).on('ajaxSuccess', function(rtv, msg, con){
                                            setTimeout(window.location.reload(), 3000);
                                            dig.hide();
                                        }).submit();
                                        }
                                });
                            }
                        }
                    }
                }).after('show', function(){
                    if(rtv.relationCode!=='normal_lawyer' && rtv.relationCode!=='legal_lawyer'){
                        $('[data-role="commonRelationFileTr"]').removeClass('fn-hide');
                    }
                    
                    if(rtv.auth){
                        var auths = rtv.auth.split(',');
                        $('[name="auth"]').each(function(index, item){
                            var authValue = $(item).val();
                            if($.inArray(authValue, auths)>-1){
                                $(item).prop('checked', true);
                            }
                        });
                    }
                    validatorExp = Validator.use('#form-agent');
                }).show();
            }).submit();
		});

        //触发 <解除代理人> 委托事件
		delegate.on('click', '[data-role="releaseRight"]', function(e){
			var agentEntityId = $(e.target).data('param');
			var rtv = {};
			rtv.agentEntityId = agentEntityId;
            new Ajax({
                request:"/suit/lassenLitigantAgentRpc/relieveEntrustContent.json",
                param: {agentEntityId:agentEntityId}
            }).on('ajaxSuccess', function(data1, content, data3){
                //console.log(data1, data2, data3)
                rtv.content = content; 
                var dig = Dialog.showTemplate("#release-agent", rtv, 
                    {width: 720,
                     autoDestroy: true,
                     autoShow: true,
                     autoSuccessAlert:true,
                     autoErrorAlert:true,
                     events: {
                        'click #noticecheck': function(e){
                            if($(e.target).prop('checked')){
                                $('#conformRelease').removeClass('fn-btn-disabled');
                            }else{
                                $('#conformRelease').addClass('fn-btn-disabled')
                            }
                        },
                        'click #conformRelease': function(e){
                            if($(e.target).hasClass('fn-btn-disabled')){
                                return;
                            }
                            var agentEntityId = $('input[name="agentEntityId"]').val();
                            var content = $('[name="content"]').val();
                            new Ajax({
                                request: '/suit/lassenLitigantAgentRpc/relieveEntrust.json' ,
                                param: {agentEntityId:agentEntityId, content:content}
                            }).on('ajaxSuccess', function(rtv, msg, con){
                                setTimeout(window.location.reload(), 3000);
                                dig.hide();
                            }).submit();
                        },
                        'click #cancelRelease': function(e){
                            dig.hide();
                        }
                    }
                });
            }).submit();
		});
        
        //显示 <解除委托书>
        delegate.on('click', '[data-role="releaseRightFile"]', function(e){
            var agentEntityId = $(e.target).data('param');
            var rtv = {};
            rtv.agentEntityId = agentEntityId;
            new Ajax({
                request:"/suit/lassenLitigantAgentRpc/relieveEntrustFile.json",
                param: {agentEntityId:agentEntityId}
            }).on('ajaxSuccess', function(data1, content, data3){
                //console.log(data1, data2, data3)
                rtv.content = content; 
                var dig = Dialog.showTemplate("#release-agent-file", rtv, 
                    {width: 1180,
                     autoDestroy: true,
                     autoShow: true,
                });
            }).submit();
        });
});