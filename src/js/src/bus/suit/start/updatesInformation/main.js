"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');

    //依赖
    var $ = require('$'),
        delegate = require('common/delegate'),
        util = require('common/util'),
        Dialog = require('common/dialog'),
        domUtil = require('common/domUtil'),
        Validator = require('common/validator'),
        Scroller = require('common/scroller'),
        Calendar = require('common/calendar'),
        Upload = require('model/upload/main'),
        Ajax = require('model/ajax/main'),
        Tip = require('common/tip'),
        ImgView = require('model/imgView/main'),
        Modal = require('model/modal/main'),
        handlerbars = require('common/handlerbars'),
        AddLawyer = require('model/addLawyer/main');


    // 组件：添加代理人
    new AddLawyer();
    
    //变量
    var pageForm = $('#page-form'),
        errorMsg = $('#errorMsg').val(),
        //诉讼须知
        noticeCheckPage = $('#noticeCheck-page'),
        noticeCheckChecked = $('#noticeCheck-checked'),
        noticeCheckNext = $('#noticeCheck-next'),
        //确认和补充原告信息
        updatesInformationPage = $('#updatesInformation-page'),
        updatesInformationChecked = $('#updatesInformation-checked'),
        updatesInformationPrev = $('#updatesInformation-prev'),
        updatesInformationNext = $('#updatesInformation-next'),
        //选择起诉类型
        chooseTypePage = $('#chooseType-page'),
        chooseTypePrev = $('#chooseType-prev'),
        chooseTypeNext = $('#chooseType-next'),
        //详情
        noticeCheckTemple = $('#noticeCheck-temple').html();

    
    //组件：验证
    var validatorExp = Validator.use('#updatesInformation-form','.JS-target-required');

    // validatorExp.addItem({
    //     element: $('[name="lassenSuitEntityDo.gender"]')
    // });

    if($('[data-role="identifyType"]').val() === 'ligint'){
        validatorExp.removeItems("[data-identifytype='agentDetails']")
    }else{
        validatorExp.removeItems("[data-identifytype='ligintDetails']")
    }

    // 组件：图片查看
    new ImgView();

    // 日期选择
    Calendar.use();

    //组件：上传
    Upload.use('.JS-need-upload');

    //组件：确认框
    errorMsg && Modal.confirm('提醒', errorMsg, function(){
        domUtil.redirect('/suit/newMySuit.htm#personInfo');
    }, function(){
        domUtil.redirect('/portal/main/domain/index.htm');
    });

    //组件：浮层
    Tip.use();

    //组件：滚动条
    var scroller;

    //函数：按钮的切换
    function toggleBtn(node, btn){
        //未勾选
        if(node.prop('checked')){
            btn.removeClass('fn-btn-disabled');
        }else{
            btn.addClass('fn-btn-disabled');
        }
    }

    //函数：隐藏全部页面
    function hiddenPage(){
        noticeCheckPage.addClass('fn-hide');
        updatesInformationPage.addClass('fn-hide');
        chooseTypePage.addClass('fn-hide');
    }

    //函数：显示页面
    function showPage(node){
        hiddenPage();
        node.removeClass('fn-hide');
        // 滚动条
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        document.title = node.data('title');
        //如果是确认和补充原告信息
        if(node[0] === updatesInformationPage[0]){
            isGo = true;
        }else{
            isGo = false;
        }
    }

    //函数：确认结点拥有类名
    function checkNodeCanUse(node){
        return !node.hasClass('fn-btn-disabled');
    }

    //函数:取消选择
    function checkedFalse(){
        $('.JS-trigger-hover').removeClass('trigger-chosed').addClass('JS-trigger-chose').removeClass('JS-trigger-chosed');
        $('#chooseType-page [type="radio"]').prop('checked', false);
    }

    //如果初始化表单里面有*号就暂时隐藏
    function tempHideInout(){
        updatesInformationPage.find('input[type="text"]').each(function(){
            var self = $(this);
            if( self.val().indexOf('*') !== -1 && self.prop('defaultValue') === self.prop('value') ){
                self.addClass('fn-hide');
            }
        });
    }

    //函数：重置表单
    function resetForm(){
        pageForm[0] && pageForm[0].reset();
    }
    //IE是执行在前，回写在后
    setTimeout(resetForm, 0);

    //事件
    delegate.on('mouseenter', '.JS-trigger-hover', function(){
        var node = $(this);
        node.addClass('tigger-show');
    });
    delegate.on('mouseleave', '.JS-trigger-hover', function(){
        var node = $(this);
        node.removeClass('tigger-show');
    });
    delegate.on('click', '.JS-trigger-chose', function(){
        var node = $(this),
            target = node.closest('.JS-trigger-hover');
        checkedFalse();
        target.addClass('trigger-chosed').addClass('JS-trigger-chosed');
        target.find('[type="radio"]').prop('checked', true);
    });
    delegate.on('click', '.JS-trigger-chosed', checkedFalse);

    //事件：查看详情
    delegate.on('click', '.JS-trigger-click-detail', function(){
        Modal.show(noticeCheckTemple, {width: 600});
    });

    //
    updatesInformationPage.find('table').on('blur', 'input[type="text"]', function(){
        var self = $(this);
        if(self.prop('defaultValue') === self.prop('value')){
            self.addClass('fn-hide');
        }
    });
    delegate.on('blur', 'input[type="text"]', function(){
         var self = $(this);
         self.removeClass('fn-hide');
    })

    //事件：诉讼须知checkbox
    noticeCheckChecked.on('click', function(){
        toggleBtn( $(this), noticeCheckNext );
    });

    //事件：诉讼须知下一步
    noticeCheckNext.on('click', function(){
        if(checkNodeCanUse($(this))){
            showPage(chooseTypePage);
            //组件：滚动条
            if(!scroller){
               scroller = Scroller.use('.JS-need-scroller'); 
            }
        }
    });

    //事件：选择起诉类型上一步
    chooseTypePrev.on('click', function(){
        showPage(noticeCheckPage);
    });

    //事件：选择起诉类型下一步
    var isGo = false;
    chooseTypeNext.on('click', function(){
        if(!chooseTypePage.find('[type="radio"]:checked').length){
            Modal.alert(0, '请选择起诉类型');
            return false;
        }else{
            showPage(updatesInformationPage);
        }
    });

    //事件：确认和补充原告信息checkbox
    updatesInformationChecked.on('click', function(){
        toggleBtn( $(this), updatesInformationNext );
    });

    //事件：确认和补充原告信息上一步
    updatesInformationPrev.on('click', function(){
        showPage(chooseTypePage);
    });

   //事件：确认和补充原告信息下一步
   updatesInformationNext.on('click', function(){
        if(checkNodeCanUse($(this))){
           //如果初始化有星号暂时隐藏
            tempHideInout();
            validatorExp.execute(function(err, errlist){
                updatesInformationPage.find('input[type="text"]').removeClass('fn-hide');
                if(err){
                    util.log(errlist);
                }else{
                    new Ajax({
                        element: '#page-form',
                        needText: true,
                        paramParse: function(json){
                            for(var i in json){
                                if(i === 'lassenSuitEntityDo'){
                                    for(var j in json[i]){
                                        if( json[i][j].indexOf('*') !== -1 ){
                                            delete json[i][j];
                                        };
                                    };
                                };
                                json[i] = JSON.stringify(json[i]);
                            }
                            return json;
                        }
                    }).on('ajaxSuccess', function(rtv, msg, con){
                        isGo = false;
                        domUtil.redirect(chooseTypePage.find('[type="radio"]:checked').attr("data-jump")+'?securityId='+ domUtil.getEscapeUrl(rtv.securityId));
                    }).on('ajaxError', function(){
                        isBindUse && bussinessBtn.prop('checked', false);
                        isBindUse = false;
                    }).submit();
                }
            });
           //开启
          
       }
    });

    //离开
    window.onbeforeunload = function(e){
        e = e || event;
        isGo && (e.returnValue="您确定要离开此页面么？");
    }
    var isBindUse,
        bussinessBtn = $('#chooseType-page input[name="lassenLegalCaseDo.caseType"]').eq(0);
    // 绑定电商账号
    delegate.on('click', '.JS-bind-bussinedss', function(){
        window.bindCallback = function(){
            bussinessBtn.prop('checked', true);
            $('#chooseType-next').trigger('click');
            isBindUse = true;
        };
        Dialog.show('/havlogin.htm?app=taobao', {width: 380, height:380});
    });

    //添加代理人
    delegate.on('change', '[data-role="identifyType"]', function(e){
        var type = $(e.target).val();
        if(type === 'ligint'){
            $('div[data-role="agent-note" ]').addClass("fn-hide");
            $('div[data-role="ligint-note" ]').removeClass("fn-hide");
            $('[data-identifytype="agentDetails"]').addClass('fn-hide JS-serialize-exclude');
            $('[data-identifytype="ligintDetails"]').removeClass('fn-hide JS-serialize-exclude');
            validatorExp.removeItems("[data-identifytype='agentDetails']")
            validatorExp.addItems("[data-identifytype='ligintDetails']")
        }else{
            $('div[data-role="agent-note" ]').removeClass("fn-hide");
            $('div[data-role="ligint-note" ]').addClass("fn-hide");
            $('[data-identifytype="ligintDetails"]').addClass('fn-hide JS-serialize-exclude');
            $('[data-identifytype="agentDetails"]').removeClass('fn-hide JS-serialize-exclude');
            validatorExp.removeItems("[data-identifytype='ligintDetails']")
            validatorExp.addItems("[data-identifytype='agentDetails']")
        }
    });
 
    //与当事人的关系是律师的时候去掉<关系证明文件>， 否则显示。
    delegate.on('change', '[data-identifytype="agentDetails"] [name="relationCode"]', function(e){
        var type = $(e.target).val();
        if(type === 'normal_lawyer' || type === 'legal_lawyer'){
            $('[data-role="commonRelationFileTr"]').addClass("fn-hide JS-serialize-exclude");
            validatorExp.removeItems('[data-role="commonRelationFile"]');
        }else{
            $('[data-role="commonRelationFileTr"]').removeClass("fn-hide JS-serialize-exclude");
        }
    });

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

   // $('[data-role="identifyType"]').trigger('click');
    var  alipayDialog = null;
    delegate.on('click', '[data-role="selectLigint"]', function(e){
        e.preventDefault();
        var type = $(e.target).data('type');
        if(type === 'alipay'){
            alipayDialog = Dialog.show('/suit/start/ligintAlipay.htm?', {width: 380, height:380});
        }else{
            new Ajax({
                request: '/suit/lassenLitigantAgentRpc/getLigiantListByAgent.json'
            }).on('ajaxSuccess', function(rtv, msg, con){
                var dig = Dialog.showTemplate("#select-history-ligint-template", rtv, 
                    {width: 720,
                     autoDestroy: true,
                     autoShow: true,
                     events: {
                        'click #selectHistoryLigint': function(e){
                            var entity = $('[data-role="selectHistoryLigintRadio"]:checked');
                            if(entity.size()>0){
                                var entityId = entity.val();
                                new Ajax({
                                    request: '/suit/lassenLitigantAgentRpc/copyEntityPictureAndReturnDo.json?securityId=' + entityId
                                }).on('ajaxSuccess', function(rtv, msg, con){
                                    //陈志文20160229，附件只有一个去掉特殊处理
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
        validatorExp.removeItems("#selectedLigintDetails");
        //与当事人的关系
        validatorExp.removeItems('[data-role="commonRelationFile"]');

        var template = handlerbars.compile($('#ligint-info-template').html())
        $('#selectedLigintDetails').html(template(rtv));

        if(!rtv.lassenLitigantAgentDto){
            rtv.lassenLitigantAgentDto = {};
        }
        rtv.lassenLitigantAgentDto.inputName = "relationFile";

        
        //根据选择的当事人初始化与当事人的关系
        getRelationWithLigint(rtv.entityType, rtv.lassenLitigantAgentDto);

        Upload.use('#selectedLigintDetails .JS-need-upload');
        validatorExp.addItems("#selectedLigintDetails");

        $('[data-identifytype="agentDetails"] .JS-trigger-add-lawyer').closest('tr').next('tr').remove();
        $('[data-identifytype="agentDetails"] .JS-trigger-add-lawyer').nextAll("#addLawyerNote").remove()
        //if($('[data-identifytype="agentDetails"] i.JS-trigger-click-delete-lawyer').size() <= 0 ){
        $('[data-identifytype="agentDetails"] .JS-trigger-add-lawyer').addClass('fn-btn-default').removeClass('fn-btn-disabled');
        //}
        Calendar.use();
        //关系证明文件显示或隐藏
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
                $('select[name="relationCode"]').html(template(JSON.parse(rtv)));

                if(relationFileDo){
                    //获取与当事人的关系
                    var relationCode = relationFileDo.relationCode;
                    if(relationCode){
                        $('[name="relationCode"] option[value="'+relationCode+'"]').prop('selected', true);
                    }else{
                        $('[name="relationCode"] option:first').prop('selected', true);
                    }
                    //关系证明文件
                    var relationHand = handlerbars.compile($("#a-common-relationfile-template"), true);
                    //关系证明文件
                    $('[data-role="commonRelationFile"]').html(relationHand(relationFileDo));
                            
                    //关系证明文件添加校验， 文件上传
                    Upload.use('[data-role="commonRelationFile"] .JS-need-upload');
                    //validatorExp.addItems('[data-role="commonRelationFile"]');

                    $('[data-identifytype="agentDetails"] [name="relationCode"]').trigger('change');
                }

            }).submit();
        }
    }
});