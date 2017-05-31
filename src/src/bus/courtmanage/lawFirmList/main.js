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
        MyWidget = require('common/myWidget'),
        domUtil = require('common/domUtil'),
        Modal = require('model/modal/main'),
        Ajax = require('model/ajax/main'),
        PerSearch = require('model/perSearch/main'),
        FirmAddress = require('../common/firmAddress'),
        Tpl = require('../common/tpl');

    // 变量
    var search,
        paramName = $('[name="firmName"]'),
        focusParamName = false,
        timeoutId;

    // 组件：地址
    var firmAddressExp = new FirmAddress({
        defaultFirmId: cookie.get('firmId'),
        defaultFocus: cookie.get('areaCode'),
        onFirmChange: function(areaCode, firmId){
            if(!search){
                // 组件：查询
                search = new PerSearch({
                    element: '#search-list'
                });
            }else{
                search.searchListReload();
                cookie.set('areaCode', areaCode);
                cookie.set('firmId', firmId);
            };
        }
    });

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
                    request: '/courtmanage/firmManageRpc/getFirmBysecId.json',
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
            'keypress [name="firmName"]': function(e){
                if(e.charCode === 13){
                    focusParamName = true;
                    search.searchListReload();
                }
            },
            // 删除
            'click [data-role="delete"]': function(e){
                Modal.confirm('提示', '您确定要删除吗？', function(){
                    new Ajax({
                        request: '/courtmanage/firmManageRpc/deleteFirmData.json',
                        param: $(e.target).data('param')
                    }).on('ajaxSuccess', function(val, msg){
                        firmAddressExp.incChange();
                        Modal.alert(1, msg);
                    }).submit();
                });
               
            }
        }
    }));

    // 函数：实例化模板
    function initTpl(data){
        new Ajax({
            request: '/courtmanage/firmManageRpc/getFirmByAreaCode.json'
        }).on('ajaxSuccess', function(val, msg){
            $.extend(data, {courtList: val});
            new Tpl({
                request: '/courtmanage/firmManageRpc/saveFirmData.json',
                template: '#courtmanage-template',
                paramName: 'lassenFirmVo',
                data: data,
                onAjaxSuccess: function(){
                    // 刷新数据
                   firmAddressExp.set('defaultFirmId', cookie.get('firmId')).incChange();
                }
            });
        }).submit();
    };
});