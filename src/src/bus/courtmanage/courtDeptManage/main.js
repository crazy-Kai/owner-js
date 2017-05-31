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
        Tpl = require('../common/tpl');

    // 变量
    var search;

    // 组件：地址
    new CoutAddress({
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
                    request: '/courtmanage/courtDeptRpc/gerCourtDeptDoBySecId.json',
                    param: $(e.target).data('param')
                }).on('ajaxSuccess', function(content){
                    initTpl(content);
                }).submit();
            },
            // 删除
            'click [data-role="delete"]': function(e){
                Modal.confirm('提示', '您确定要删除吗？', function(){
                     new Ajax({
                        request: '/courtmanage/courtDeptRpc/deleteCourtDept.json',
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
            request: '/courtmanage/courtDeptRpc/saveCourtDept.json',
            template: '#courtmanage-template',
            paramName: 'courtDeptVo',
            data: data,
            onAjaxSuccess: function(){
                search.searchListReload();
            },
            onAddressChange: function(id){
                var me = this;
                new Ajax({
                    request: '/courtmanage/courtManageRpc/getCourtByAreaCode.json',
                    param: {areaCode: id}
                }).on('ajaxSuccess', function(content){
                    content.unshift({
                        courtName: '请选择',
                        securityId: ''
                    });
                    domUtil.selectSerialize(me.$('[name="securityCourtId"]')[0], $.map(content, function(val){
                        return {
                            key: val.courtName,
                            value: val.securityId
                        };
                    }));
                    me.checkSelect();
                     me.$('[data-value]').removeAttr('data-value');
                }).submit();
            }
        });
    };

    


});