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
    var search,
        paramName = $('[name="paramName"]'),
        courtId = $('[name="courtId"]'),
        focusParamName = false,
        timeoutId;

    // 
    // domUtil.onChange(paramName, function(){
    //     clearTimeout(timeoutId);
    //     timeoutId = setTimeout(function(){
    //         focusParamName = true;
    //         search.searchListReload();
    //     }, 500);
    // });

    // 组件：地址
    new CoutAddress({
        defaultCourtId: cookie.get('courtId'),
        defaultFocus: cookie.get('areaCode'),
        onCourtChange: function(areaCode, courtId){
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
                    request: '/courtmanage/courtUserRpc/getCourtUserBySecId.json',
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
            'keypress [name="paramName"]': function(e){
                if(e.charCode === 13){
                    focusParamName = true;
                    search.searchListReload();
                }
            },
            // 删除
            'click [data-role="delete"]': function(e){
                Modal.confirm('提示', '您确定要删除吗？', function(){
                     new Ajax({
                        request: '/courtmanage/courtUserRpc/deleteCourtUser.json',
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
            request: '/courtmanage/courtUserRpc/saveCourtUser.json',
            template: '#courtmanage-template',
            paramName: 'courtUserVo',
            data: data,
            events: {
                'change [name="courtId"]': function(e){
                    var me = this;
                    Ajax.when(
                        {   request: '/courtmanage/courtDeptRpc/getDeptByCoutId.json',
                            param: {courtId: e.target.value}
                        }, 
                        {   request: '/courtmanage/courtManageRpc/getCourtById.json',
                            param: {courtId: e.target.value}
                        }
                    ).then(
                        function(depts, docking){
                            var content = depts.val;
                            //所属组织
                            content.unshift({
                                value: '请选择',
                                key: ''
                            });
                            domUtil.selectSerialize(me.$('[name="deptId"]')[0], $.map(content, function(val){
                                return {
                                    key: val.value,
                                    value: val.key
                                };
                            }));
                            me.checkSelect();
                            me.$('[data-value]').removeAttr('data-value');

                            //是否同步通达海,是显示
                            var isDocking = docking.val.isDocking;

                            if(isDocking == 'y'){
                                me.$('#courtSystemAccountTr').removeClass('fn-hide');
                            }else{
                                me.$('#courtSystemAccount').val("");
                                me.$('#courtSystemAccountTr').addClass('fn-hide');
                            }
                        },
                        function(rs1, rs2){
                            //console.log(rs1, rs2);
                            //Modal.alert(0, "系统繁忙，请联系管理员");
                        }
                    );
                }
            },
            onAjaxSuccess: function(){
                search.searchListReload();
            },
            onAddressChange: function(id){
                var me = this;
                // 所属组织
                new Ajax({
                    request: '/courtmanage/courtManageRpc/getCourtOptionByAreaCode.json',
                    param: {areaCode: id}
                }).on('ajaxSuccess', function(content){
                    content.unshift({
                        value: '请选择',
                        key: ''
                    });
                    domUtil.selectSerialize(me.$('[name="courtId"]')[0], $.map(content, function(val){
                        return {
                            key: val.value,
                            value: val.key
                        };
                    }));
                    me.checkSelect();
                    me.$('[name="courtId"]').trigger('change');
                }).submit();
                // 所属组织
                
            }
        });
    };

    


});