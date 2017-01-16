"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var Validator = require('common/validator'),
        pageCheck = $('#page-check'),
        Ajax = require('model/ajax/main'),
        Modal = require('model/modal/main'),
        Upload = require('model/upload/main'),
        PerChecked = require('model/perChecked/main'),
        delegate = require('common/delegate'),
        ImgView = require('model/imgView/main'),
        Dialog = require('common/dialog'),
        handlerbars = require('common/handlerbars'),
        AddLawyer = require('model/addLawyer/main'),
        Calendar = require('common/calendar');

	//组件：验证
	var validatorExp = Validator.use('#page-param');

    //组件：上传
    Upload.use('.JS-need-upload');

    // 组件：添加代理人
    new AddLawyer();
    new ImgView();
    //组件确认
    if(pageCheck.length){
        new PerChecked({
            element: pageCheck
        }).after('psCheckedNext', function(flag){
            var me = this;
            //可以提交
            if(flag){
                //组件：提交
                new Ajax({
                    element: '#page-param',
                    paramParse: function(json){
                        for(var i in json){
                            if(typeof json[i] == 'object'){
                                var obj = json[i];
                                for(var k in obj){
                                    if(obj[k].indexOf('*') !== -1 ){
                                        delete obj[k];
                                    }
                                }
                            }else{
                                if( json[i].indexOf('*') !== -1 ){
                                    delete json[i];
                                }
                            }
                            json[i] = JSON.stringify(json[i]);
                        }
                        return json;
                    },
                    events: {
                        'click .JS-trigger-click-submit': function(){
                        var meAjax = this;
                            hideSomeInput();
                            validatorExp.execute(function(flag){
                                showSomeInput();
                                if(!flag){
                                     Modal.confirm('提示 ', '提交后无法修改，确认提交么？', function(){
                                        meAjax.submit();
                                    }, function(){
                                        meAjax.destroy();
                                    });
                                }
                            });
                            
                        }
                    }
                }).on('ajaxSuccess', function(){
                    location.reload(true)
                })
            }
        });
    }


    function hideSomeInput(){
        $('#page-param [type="text"]').each(function(){
           hideSecretInput($(this));
        });
    };
    
    function showSomeInput(){
        $('#page-param [type="text"]').removeClass('fn-hide');
    };

    function hideSecretInput(node){
        var val = node.val(),
            dVal = node.prop('defaultValue');
        // 如果内容存在，且和默认值相等就直接隐藏
        if( val && val === dVal ){
            node.addClass('fn-hide');
        };
    };


    $('#page-param').find('table').on('blur', 'input[type="text"]', function(){
        hideSecretInput($(this));
    });
    $('body').on('blur', 'input[type="text"]', function(){
        $(this).removeClass('fn-hide');
    });


    //添加代理人
    window.alipaySetLigintInfor = function(result){
        if(!result.hasError && result.content.isSuccess == true){
             setLigintInfor(result.content.retValue);
        }else{ 
            if(result.content && result.content.message){
                Modal.alert(0, result.content.message);
            }else if(result && result.errors && result.errors[0] && result.errors[0].msg){
                 Modal.alert(0, result.errors[0].msg);
            }else{
                Modal.alert(0, '系统繁忙，请联系管理员。');
            }
        }
        if(alipayDialog){
            alipayDialog.hide();
        }
    }

    var  alipayDialog = null;
    delegate.on('click', '[data-role="selectLigint"]', function(e){
        e.preventDefault();
        var type = $(e.target).data('type');
        if(type === 'alipay'){
            alipayDialog = Dialog.show('/suit/start/ligintAlipay.htm?type=agent&securityAccusedEntityId=' + $('[name="accusedVo.securityId"]').val(), {width: 380, height:380});
        }else{
            new Ajax({ 
                request: '/suit/lassenLitigantAgentRpc/getLigiantListByAgent.json?',
                param:{type:'agent',litigantEntityType:$('[data-role="ligintEntityType"]').val(), litigantEntityId:$('[name="accusedVo.securityId"]').val()}
            }).on('ajaxSuccess', function(rtv, msg, con){
                var dig = Dialog.showTemplate("#select-history-ligint-template", rtv, 
                    {width: 720,
                     autoDestroy: true,
                     autoShow: true,
                     events: {
                        'click #selectHistoryLigint': function(e){
                            var entity = $('[data-role="selectHistoryLigintRadio"]:checked');
                            if(entity.size() > 0){
                                var entityId = entity.val();
                                new Ajax({
                                    request: '/suit/lassenLitigantAgentRpc/receiveConfirmCheckUsedLitigant.json?securityId=' + entityId + '&securityAccusedEntityId=' + $('[name="accusedVo.securityId"]').val()
                                }).on('ajaxSuccess', function(rtv, msg, con){
                                    /*if(rtv.entityType === 'normal'){
                                        //处理身份证正反面附件，营业执照附件
                                        updateFileDoList(rtv.frontDoList, 'MIN_CARDFRANT');
                                        updateFileDoList(rtv.backDoList, 'MIN_CARDBACK');
                                    }else{
                                        updateFileDoList(rtv.fileBusinessList, 'MIN_BUSINESS');
                                    }*/
                                    setLigintInfor(rtv);
                                    dig.hide();
                                }).submit();
                            }else{
                                Modal.alert('提醒', '请选择已代理过的当事人。');
                            }
                        },
                        'click [data-role="selectHistoryLigintTr"]': function(e){ //<律师列表> 点击单行触发选中
                            var tr = $(e.target).closest('tr');
                            tr.find('[data-role="selectHistoryLigintRadio"]').prop('checked', true);
                        }
                    }
                });
            }).submit();
        }
    });

    function setLigintInfor(rtv){
        validatorExp.removeItems('#selectedLigintDetails');
        validatorExp.removeItems('[data-role="commonRelationFile"]');

        var template = handlerbars.compile($('#ligint-info-template').html())
        $('#selectedLigintDetails').html(template(rtv));

        Upload.use('#selectedLigintDetails .JS-need-upload');
        validatorExp.addItems('#selectedLigintDetails');

        if(!rtv.lassenLitigantAgentDto){
            rtv.lassenLitigantAgentDto = {};
        }
        rtv.lassenLitigantAgentDto.inputName = "agentVo.relationFile";

        //根据选择的当事人初始化与当事人的关系
        getRelationWithLigint(rtv.entityType, rtv.lassenLitigantAgentDto);
        
        if($('[data-identifytype="agentDetails"] i.JS-trigger-click-delete-lawyer').size() <= 0 ){
            $('[data-identifytype="agentDetails"] .JS-trigger-add-lawyer').addClass('fn-btn-default').removeClass('fn-btn-disabled');
        }
        Calendar.use();
    }

    //处理身份证正反面附件，营业执照附件
    function updateFileDoList(fileList, businessType){
        if(fileList && fileList.length>0){
            var index = 0;
            var securityIds='';
            $.each(fileList, function(i, item){
                if( item.businessType === businessType){
                    index = i;
                }
                securityIds = (securityIds.length > 0 ?  securityIds + ',' + item.securityId: item.securityId);
            });
            fileList[index].securityId = securityIds;
        }
    };


    //初始化与当事人关系列表
    function getRelationWithLigint(entityType, relationFileDo){
        var request;
        if(entityType == 'normal'){
            request = '/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_NORMAL';
        }else if(entityType == 'legal'){
            request = '/suit/lassenLitigantAgentRpc/getJSONByType.json?optionType=LIGINT_RELATION_LEGAL';
        }
        if(request){
            new Ajax({
                request: request
            }).on('ajaxSuccess', function(rtv, msg, con){
                var template = handlerbars.compile('{{#each this}}<option value="{{key}}">{{value}}</option>{{/each}}');
                $('select[name="agentVo.relationCode"]').html(template(JSON.parse(rtv)));
                if(relationFileDo){
                    //与当事人的关系
                    var relationCode = relationFileDo.relationCode;
                    if(relationCode){
                        $('[name="agentVo.relationCode"] option[value="'+relationCode+'"]').prop('selected', true);
                    }else{
                        $('[name="agentVo.relationCode"] option:first').prop('selected', true);
                    }

                    //关系证明文件
                    var relationHand = handlerbars.compile($("#a-common-relationfile-template"), true);
                    $('[data-role="commonRelationFile"]').html(relationHand(relationFileDo));

                    //关系证明文件添加校验， 文件上传
                    Upload.use('[data-role="commonRelationFile"] .JS-need-upload');
                    //validatorExp.addItems('[data-role="commonRelationFile"]');
                    $('[data-identifytype="agentDetails"] [name="agentVo.relationCode"]').trigger('change');
                }
            }).submit();
        }
    }

        //与当事人的关系是律师的时候去掉<关系证明文件>， 否则显示。
    delegate.on('change', '[data-identifytype="agentDetails"] [name="agentVo.relationCode"]', function(e){
        var type = $(e.target).val();
        if(type === 'normal_lawyer' || type === 'legal_lawyer'){
            $('[data-role="commonRelationFileTr"]').addClass("fn-hide JS-serialize-exclude");
            validatorExp.removeItems('[data-role="commonRelationFile"]');
        }else{
            $('[data-role="commonRelationFileTr"]').removeClass("fn-hide JS-serialize-exclude");
            validatorExp.addItems('[data-role="commonRelationFile"]');
        }
    });

});