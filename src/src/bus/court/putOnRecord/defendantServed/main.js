define(function(require, exports, module) {
    
    require('bus/global/main');
	//依赖
    var $ = require('$'),
        delegate = require('common/delegate'),
        handlerbars = require('common/handlerbars'),
        delegate = require('common/delegate'),
        Validator = require('common/validator'),
        Ajax = require('model/ajax/main'),
        ImgView = require('model/imgView/main'),
        Dialog = require('common/dialog');
    
    //变量
    var service = $('#service');

    // 组件：图片查看
    new ImgView();

    //组件：简单查询
    var ajaxExp = new Ajax({
        element: '#search-list',
        autoDestroy: false,
        autoSuccessAlert: false,
        parseForm: '#page-param'
    }).on('ajaxSuccess', function(rtv, msg, res){
        var me = this,
            content = me.$('.content'),
            template = handlerbars.compile( me.$('.template'), true );
        //模板写入
        content.html( template(rtv) );
        //如果都是法官处理，隐藏[被告无法送达处理]按钮
        me.hide(service);
        //如果状态是不是已判决、管辖异议成立、原告已撤诉、调解、退回、被告无法送达、撤销申请，未缴费撤诉，则页面可编辑。
        var endStatus = ['conciliate', 'sentenced', 'jurisediction_objection', 'not_accepted', 'return', 'dropped', 'not_be_served', 'cancel_apply', 'unpaid_dropped']
        if(rtv && $.inArray(rtv.status, endStatus)<0){
            me.breakEachArr(rtv.lassenReceiveConfirmVoList, function(val){
                if(!val.receiveTime){
                    me.show(service);
                    return true;
                }
            });
        }
    }).submit();

    //组件：被告无法送达处理模板
    var templateService = Dialog.showTemplate('#template-service', {flag: true}, {
        width:500,
        autoShow:false,
        autoDestroy: false,
        events: {
            'click .JS-trigger-click-submit': function(e){
                new Ajax({
                    element: this.element,
                    request: '/court/lassenReceiveConfirmRpc/saveReceiveWithunable.json',
                    paramName: 'lassenReceiveWithunableDo',
                    parseForm: '#page-param'
                }).on('ajaxSuccess', function(){
                    //继续查询
                    ajaxExp.submit();
                    //隐藏弹出框
                    templateService.hide();
                }).submit();
            }
        }
    });
    //弹出框渲染
    templateService.render();
    templateService.before('show', function(entityMapList){
        console.log(arguments, this.$('.JS-target-entitylist'));
        this.$('.JS-target-entitylist').html(entityMapList);
    });


    //事件:送达确认信息
    delegate.on('click', '.JS-trigger-click-sended', function(){
        var self = $(this);
        new Ajax({
            request: '/court/lassenReceiveConfirmRpc/queryReceive.json',
            param: self.data('param')
        }).on('ajaxSuccess', function(rtv, msg, res){
            Dialog.showTemplate('#template-sended', rtv, {width:450});
        }).submit();
    });

    //事件：法官处理
    delegate.on('click', '.JS-trigger-click-treatment', function(){

        var self = $(this);
        new Ajax({
            request: '/court/lassenReceiveConfirmRpc/queryReceiveConfirm.json',
            param: self.data('param')
        }).on('ajaxSuccess', function(rtv, msg, res){
            Dialog.showTemplate('#template-treatment', rtv, {
                width:500,
                events: {
                    'click .JS-trigger-click-submit': function(e){
                        var me = this;
                        //验证
                        if( !Validator.oneExecute(this.element) ){
                            //触发请求
                            new Ajax({
                                element: me.element,
                                request: '/court/lassenReceiveConfirmRpc/saveReceiveConfirm.json',
                                paramName: 'lassenReceiveConfirmDo',
                                onAjaxSuccess: function(){
                                    //继续查询
                                    ajaxExp.submit();
                                    //关闭
                                    me.hide();
                                }
                            }).submit();
                        }
                    } 
                }
                
            });
        }).submit();


    });

     //事件：法官处理记录
    delegate.on('click', '.JS-trigger-click-record', function(){
        var self = $(this);
        new Ajax({
            request: '/court/lassenReceiveConfirmRpc/queryReceive.json',
            param: self.data('param')
        }).on('ajaxSuccess', function(rtv, msg, res){
            if(rtv.receiveInfo && rtv.receiveInfo.isReceive === 'y'){
                Dialog.showTemplate('#template-record', rtv, {width:500});
            }else{
                Dialog.showTemplate('#template-service', rtv, {width:450});
            }
        }).submit();
    });

    //事件：被告无法处理
    delegate.on('click', '.JS-trigger-click-service', function(){
        new Ajax({
            request: '/court/lassenReceiveConfirmRpc/queryReceiveWithunable.json',
            parseForm: '#page-param'
        }).on('ajaxSuccess', function(rtv, msg, res){
            templateService.show(rtv.entityMapList.join(','));
        }).submit();

    })

});
