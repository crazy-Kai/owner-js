"use strict";
/**
 * 业务：首页[domain/index]
 * 
 */
define(function(require, exports, module) {

    require('bus/global/main');

    // 依赖
    var $ = require('$'),
        cookie = require('common/cookie'),
        delegate = require('common/delegate'),
        Dialog = require('common/dialog'),
        MyWidget = require('common/myWidget'),
        domUtil = require('common/domUtil'),
        Modal = require('model/modal/main'),
        Validator = require('common/validator'),
        Calendar = require('common/calendar'),
        Ajax = require('model/ajax/main'),
        Upload = require('model/upload/main'),
        PerSearch = require('model/perSearch/main'),
        FirmAddress = require('../common/firmAddress'),
        Tpl = require('../common/tpl');

    // 变量
    var search,
        paramName = $('[name="name"]'),
        firmId = $('[name="firmId"]'),
        focusParamName = false,
        timeoutId;

    // 组件：地址
    new FirmAddress({
        defaultFirmId: cookie.get('firmId'),
        defaultFocus: cookie.get('areaCode'),
        onFirmChange: function(areaCode, firmId){
            if(!search){
                // 组件：查询
                search = new PerSearch({
                    element: '#search-list',
                    onAjaxSuccess: function(){
                        focusParamName && paramName.focus();
                    }
                });
            }else{
                focusParamName = false;
                search.searchListReload();
                cookie.set('areaCode', areaCode);
                cookie.set('firmId', firmId);
            };
        }
    });

    //验证
    var validatorExp = Validator.use('#excel');

    // 日期选择
    Calendar.use();

    // 匿名类
    new (MyWidget.extend({
        attrs: {
            element: 'body'
        },
        events: {
            // 新增
            'click [data-role="add"]': function(e){
                initTpl({title: $(e.target).prop('title')});
            },
            // 修改
            'click [data-role="editor"]': function(e){
                new Ajax({
                    request: '/courtmanage/lassenFirmLawyerRpc/getLawyer.json',
                    param: $(e.target).data('param')
                }).on('ajaxSuccess', function(content){
                    initTpl(content);
                }).submit();
            },
            // 查询
            'click [data-role="search"]': function(e){
                focusParamName = true;
                search.searchListReload();
            },
            // 输入增强
            'keypress [name="name"]': function(e){
                if(e.charCode === 13){
                    focusParamName = true;
                    search.searchListReload();
                }
            },
            // 删除
            'click [data-role="delete"]': function(e){
                Modal.confirm('提示', '您确定要删除吗？', function(){
                     new Ajax({
                        request: '/courtmanage/lassenFirmLawyerRpc/delFirmLawyer.json',
                        param: $(e.target).data('param')
                    }).on('ajaxSuccess', function(val, msg){
                        search.searchListAjax();
                        Modal.alert(1, msg);
                    }).submit();
                });
               
            }
        }
    }));

    // 函数：实例化模板
    function initTpl(data){
        return new Tpl({
            request: '/courtmanage/lassenFirmLawyerRpc/editFirmLawyer.json',
            template: '#courtmanage-template',
            paramName: 'lassenFirmLawyerVo',
            data: data,
            onAjaxSuccess: function(){
                search.searchListReload();
            },
            onAddressChange: function(id){
                var me = this;
                // 律所所在地
                new Ajax({
                    request: '/courtmanage/firmManageRpc/getFirmByAreaCode.json',
                    param: {areaCode: id}
                }).on('ajaxSuccess', function(content){
                    content.unshift({
                        firmName: '请选择',
                        securityId: ''
                    });
                    domUtil.selectSerialize(me.$('[name="securityFirmId"]')[0], $.map(content, function(val){
                        return {
                            key: val.firmName,
                            value: val.securityId
                        };
                    }));
                    me.checkSelect();
                    me.$('[name="securityFirmId"]').trigger('change');
                }).submit();
            },
            onComplete: function(){
                var me = this;
                // 被告：年月
                 me.calendar = new Calendar({trigger: me.$('[name="startWorkTime"]')});
             },
             onUnComplete: function(){
                var me = this;
                me.calendar.destroy();
             }
        });
    };
    function exceTpl(data){
        return new Tpl({
            request: '/courtmanage/lassenFirmLawyerRpc/saveWithFirm.json',
            template: '#excel',
            data: data,
            events:{
                'click [data-role="triggleSure"]': function(e){
                    var me = this,
                        securityId = this.$('[name="securityId"]').val(),
                        firmId = this.$('[name="firmId"]').val();
                    new Ajax({
                        request:'/courtmanage/lassenFirmLawyerRpc/saveWithFirm.json',
                        param: $.extend({}, {securityId:securityId}, {firmId:firmId}),
                        paramName : 'filterMap'
                    }).on("onSuccess", function(rtv, msg, con){
                        me.hide();
                        Modal.alert(1, msg, function(){
                            searchListExp[0].searchListAjax();
                        });
                    }).submit();
                }
            },
            onAjaxSuccess: function(){
                search.searchListReload();
            },
            onAddressChange: function(id){
                var me = this;
                // 律所所在地
                new Ajax({
                    request: '/courtmanage/firmManageRpc/getFirmByAreaCode.json',
                    param: {areaCode: id}
                }).on('ajaxSuccess', function(content){
                    content.unshift({
                        firmName: '请选择',
                        securityId: ''
                    });
                    domUtil.selectSerialize(me.$('[name="securityFirmId"]')[0], $.map(content, function(val){
                        return {
                            key: val.firmName,
                            value: val.securityId
                        };
                    }));
                    me.checkSelect();
                    me.$('[name="securityFirmId"]').trigger('change');
                }).submit();
            },
        });
    };
    //导入excel
    delegate.on('click','[data-role="excel"]', function(e){
        exceTpl().after('show', function(){
            var me = this;
             Upload.use( me.$('[data-widget="upload"]'), {
                'onSuccess': function(res){
                    var me = this;
                    me.get('parentNode').find('[name="securityId"]').val(res.comments);
                    me.element.html(res.fileName);
                }
             });
        }).before('hide', function(){
            Upload.remove(this.$('[data-widget="upload"]'));
        }).show();
    });

    //导入图片
    delegate.on('click','[data-role="photo"]', function(){
        var photoTemplate = Dialog.showTemplate('#photo', null, {
            width:450, autoShow:false,
        }).after('show', function(){
            var me =  this;
            Upload.use( me.$('[data-widget="upload"]'), {
                'onSuccess': function(res){
                    me.hide();
                    search.searchListReload();
                }
            });
        }).before('hide', function(){
             Upload.remove(this.$('[data-widget="upload"]'));
        }).show();
    });
});