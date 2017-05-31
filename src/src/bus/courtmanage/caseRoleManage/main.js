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
        Dialog = require('common/dialog');

    // 变量
    var search,
        paramName = $('[name="paramName"]'),
        courtId = $('[name="courtId"]'),
        focusParamName = false,
        timeoutId;

    // 组件：地址
    new CoutAddress({
        defaultCourtId: cookie.get('courtId'),
        defaultFocus: cookie.get('areaCode'),
        isEncrypt: false,
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
            // 查询
            'click [data-role="get"]': getRoleMange,
            // 查询
            'click [data-role="search"]': function(e){
                focusParamName = true;
                search.searchListReload();
            }
        }
    }));

    // 查询入口
    function getRoleMange(e){
        reloadEvent = e;
        var node = $(e.target);
        new Ajax({
            request: '/courtmanage/caseRoleRpc/getCaseRoleList.json',
            param: node.data('param')
        }).on('ajaxSuccess', function(content){
            reloadDialog = Dialog.showTemplate('#caseRoleManage-template-search', content, {
                width:500,
                events: {
                    // 编辑
                    'click [data-role="edit"]': editRoleMange
                }
            });
        }).submit();
    };

    // 重新渲染
    var reloadEvent,
        reloadDialog;
    function reloadRoleMange(){
        if(reloadEvent && reloadDialog){
            reloadDialog.hide();
            getRoleMange(reloadEvent);
        };
    };

    // 编辑入口
    function editRoleMange(e){
        var node = $(e.target);
        new Ajax({
            request: '/courtmanage/caseRoleRpc/getCaseJudgeEntity.json',
            param: node.data('param')
        }).on('ajaxSuccess', function(content){
            Dialog.showTemplate('#caseRoleManage-template-edit', content, {
                width: 400,
                events: {
                    // 保存
                    'click [data-role="submit"]': saveRoleMange
                }
            });
        }).submit();
    };

    // 保存入口
    function saveRoleMange(){
        var me = this;
        new Ajax({
            request: '/courtmanage/caseRoleRpc/modifyCaseEntity.json',
            parseForm: me.element,
            paramName: 'caseEntityVo',
            autoSuccessAlert: true
        }).on('ajaxSuccess', function(content){
           me.hide();
           reloadRoleMange();
        }).submit();
    };
    


});