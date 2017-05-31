define(function(require, exports, module) {
    
    require('bus/global/main');
	//依赖
    var $ = require('$'),
        delegate = require('common/delegate'),
        Dialog = require('common/dialog'),
        handlerbars = require('common/handlerbars'),
        Ajax = require('model/ajax/main'),
        tinymceUse = require('common/tinymce');//编辑器

    //组件：简单查询
    var ajaxExp = new Ajax({
        element: '#search-list',
        autoDestroy: false,
        autoSuccessAlert: false
    }).on('ajaxSuccess', function(rtv, msg, res){
        var me = this,
        content = me.$('.content'),
        template = handlerbars.compile( me.$('.template'), true );
        //模板写入
        content.html( template(rtv) );


        if(rtv.status=="cased" && rtv.isPaid !="y"){
            $("#notPay").show();
        }else{
            $("#notPay").hide();
        }

        $("input[name='name']").val(rtv.name);

    }).submit();

    //查询撤诉书文本
    function queryAndOpen(element){
        var param = $(element.target).data("sendParam");
        new Ajax({
            request: "/court/lassenSuitWithdrawalRpc/queryWithdrawalDocument.json", 
            paramName:"withdrawalDocMap",
            param: param
        }).on('ajaxSuccess', function(rtv, msg, con){
            openFullTextDialog(rtv, param);
        }).submit();
    }

    //打开撤诉书编辑对话框
    function openFullTextDialog(fullTextContent, param){
        var temp = handlerbars.compile('#template-full-text', true),
            html = temp(fullTextContent);
        new Dialog({content:html, width:800, 
                    events:{
                        'click .JS-trigger-click-save' : function(e){
                            var me = this;
                            me.$("#content").val( tinymce.get("content").getContent());

                            new Ajax({
                                    request: "/court/lassenSuitWithdrawalRpc/saveWithdrawalDocument.json", 
                                    paramName:"withdrawalDocMap",
                                    param: $.extend(param, {content : me.$("#content").val()}),
                                    autoSuccessAlert: true
                            }).on('ajaxSuccess', function(rtv, msg, con){
                                    tinymce.remove('#content');
                                    me.hide();
                            }).submit();
                            
                        },
                        'click .JS-trigger-click-send' : function(e){
                            var me = this;
                            me.$("#content").val( tinymce.get("content").getContent());
                            new Ajax({
                                    request: "/court/lassenSuitWithdrawalRpc/resendWithdrawalNofity.json", 
                                    paramName:"withdrawalDocMap",
                                    param: $.extend(param, {content : me.$("#content").val()}),
                                    autoSuccessAlert: true
                            }).on('ajaxSuccess', function(rtv, msg, con){
                                    tinymce.remove('#content');
                                    me.hide();
                            }).submit();
                        }
                    }
            }).after('show', function(){
                var me = this;
                tinymceUse({
                    selector: '#content',
                    init_instance_callback: function(eb){
                       me._setPosition();
                    }
                });
            }).after('hide',function(){
                this.destroy();
            }).show();
    }

    //事件：再次发送
    delegate.on('click', '.JS-trigger-click-sendagain', function(element){
        queryAndOpen(element);
    });


    //事件：查看详情
    delegate.on('click', '.JS-trigger-click-detail', function(element){
                new Ajax({
                    request: "/court/lassenSuitWithdrawalRpc/querySuitWithdrawal.json",
                    param : $(element.target).data("param")
                }).on('ajaxSuccess', function(rtv, msg, con){
                    Dialog.showTemplate('#template-detail', rtv, {width:420});
                }).submit();
    });




    //事件：撤诉处理
    delegate.on('click', '.JS-trigger-click-treat-auto', function(element){

        new Ajax({
            request: "/court/lassenSuitWithdrawalRpc/querySuitWithdrawal.json?",
            param : $(element.target).data("param")
        }).on('ajaxSuccess', function(rtv, msg, con){
           var templateAuto= Dialog.showTemplate('#template-treat-auto', rtv, 
                {width:500,
                 events:{
                        'click .JS-trigger-click-save': function(e){
                            /*
                            var params = {}
                            $("#suitWithdrawal-form-unpaid").find("textarea, input, select").each(function () {
                                params[$(this).attr('name')] = $.trim($(this).val());
                            })
*/
                            new Ajax({
                                request: "/court/lassenSuitWithdrawalRpc/saveSuitWithdrawal.json", 
                                parseForm:"#suitWithdrawal-form-auto",
                                paramName:"suitWithdrawalMap",
                                autoSuccessAlert: true
                            }).on('ajaxSuccess', function(rtv, msg, con){
                                ajaxExp.submit();
                                if($('select[name="deal"]').val() === 'agreed'){
                                    queryAndOpen(element);
                                }
                                templateAuto.hide();
                            }).submit();
                            
                        }
                    }
                });
        }).submit();

    });

    //事件：撤诉处理
    delegate.on('click', '.JS-trigger-click-treat-unpaid', function(element){

        var parameter = {};
            parameter.name = $("input[name='name']").val();
            parameter.applyTime = new Date().getTime();
            $("input[name='applyTime']").val(parameter.applyTime);
            var templateUnpaid=  Dialog.showTemplate('#template-treat-unpaid', parameter, 
                {width:500,
                 events:{
                        'click .JS-trigger-click-save': function(e){
                            /*
                            var params = {}
                            $("#suitWithdrawal-form-unpaid").find("textarea, input, select").each(function () {
                                params[$(this).attr('name')] = $.trim($(this).val());
                            })
                            */
                            new Ajax({
                                request: "/court/lassenSuitWithdrawalRpc/saveSuitWithdrawal.json", 
                                parseForm:"#suitWithdrawal-form-unpaid",
                                paramName:"suitWithdrawalMap"
                            }).on('ajaxSuccess', function(rtv, msg, con){
                               ajaxExp.submit();
                               templateUnpaid.hide();
                               queryAndOpen(element);
                            }).submit();
                        
                        }
                    }
                });
        });


});
