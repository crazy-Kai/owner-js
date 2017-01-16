"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
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
        CoutAddress = require('../common/coutAddress'),
        Validator = require('common/validator'),
        Tpl = require('../common/tpl');

    // 变量
    var search;

    // 组件：地址
    var coutAddressExp = new CoutAddress({
        defaultCourtId: cookie.get('courtId'),
        defaultFocus: cookie.get('areaCode'),
        onCourtChange: function(areaCode, courtId){
            if(!search){
                // 组件：查询
                search = new PerSearch({
                    element: '#search-list'
                });
            }else{
                search.searchListReload();
                cookie.set('areaCode', areaCode);
                cookie.set('courtId', courtId);
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
                    request: '/courtmanage/courtManageRpc/getCourtBySecId.json',
                    param: $(e.target).data('param')
                }).on('ajaxSuccess', function(content){
                    initTpl(content);
                }).submit();
            },
            // 删除
            'click [data-role="delete"]': function(e){
                Modal.confirm('提示', '您确定要删除吗？', function(){
                    new Ajax({
                        request: '/courtmanage/courtManageRpc/deleteCourtData.json',
                        param: $(e.target).data('param')
                    }).on('ajaxSuccess', function(val, msg){
                        coutAddressExp.incChange();
                        Modal.alert(1, msg);
                    }).submit();
                });
               
            }
        }
    }));

    // 函数：实例化模板
    function initTpl(data){
        new Ajax({
            request: '/courtmanage/courtManageRpc/getCourtByAreaCode.json'
        }).on('ajaxSuccess', function(val, msg){
            $.extend(data, {courtList: val});
            new Tpl({
                request: '/courtmanage/courtManageRpc/saveCourtData.json',
                template: '#courtmanage-template',
                paramName: 'courtVo',
                data: data,
                onAjaxSuccess: function(){
                    // 刷新数据
                   coutAddressExp.set('defaultCourtId', cookie.get('courtId')).incChange();
                },
                events: {
                    'click [data-role="submit"]': function(e){
                        var me = this;
                        me.validatorExe.execute(function(err){
                            if(!err){
                                if(data.title && me.$('[name="isDocking"]:checked').val() == 'y'){
                                    Modal.confirm('提醒', '确定该法院同步通达海？', function(){
                                        me.dataPost();
                                    })
                                }else{
                                    me.dataPost();
                                }
                            }
                        });
                    }
                }
            });
        }).submit();
    };

    


});