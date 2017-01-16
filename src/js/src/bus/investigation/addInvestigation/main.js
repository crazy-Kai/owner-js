"use strict";
/**
 * 业务:通知书[domain/index]
 */
define(function(require, exports, module) {

    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');

    // 依赖
    var $ = require('$'),
        Upload = require('model/upload/main'),
        delegate = require('common/delegate'),
        Ajax = require('model/ajax/main'),
        Validator = require('common/validator'),
        Dialog = require('common/dialog'),
        Model = require('model/modal/main'),
        EditPersonInInvers = require('model/editPersonInInvers/main');

    // 实例化

    // 增加原告
    new EditPersonInInvers({ trigger: '#addInvestigationAccuser' }).on('saveSuccess', success).on('deleteSuccess', success);
    // 增加被告
    new EditPersonInInvers({ trigger: '#addInvestigationAccused' }).on('saveSuccess', success).on('deleteSuccess', success);
    // 上传文件
    new Upload({ trigger: '[data-widget="upload"]' });
    // 验证
    var validatorExp = Validator.use('#page-form', '[data-widget="validator"]');
    // 保存事件
    delegate.on('click', '[data-trigger="save"]', function() {
        validatorExp.execute(function(isErr) {
            if (!isErr) {
                new Ajax({
                    request: '/mercury/investigationRpc/addInvestigation.json',
                    parseForm: '#page-form',
                    paramName: 'filterMap'
                }).on('ajaxSuccess', function() {
                    var modelExp = Model.confirm("提醒","  提交成功，后台处理需要10分钟左右，请您10分钟后刷新列表查看协查结果。", null ,null,{
                        noCancle: true
                    }).after('hide', function(){
                        window.location.href = "/suit/newMySuit.htm#investigation";
                    });
                    setTimeout(function(){
                        modelExp.hide();
                    }, 20000);
                   
                }).submit();
            };
        });
    });
 
    // 处理后的判断
    var investigationTarget = $('#investigationTarget');

    function success() {
        var me = this,
            arr = [];
        $('[name="entityNames"]').each(function() {
            arr.push($(this).val());
        });
        investigationTarget.html(arr.join(','));
        buriedSuccess.call(me);
    };

    // 埋点回调
    function buriedSuccess() {
        var me = this,
            arr = [],
            entityRole = me.get('param').entityRole,
            buriedNodd = $('#buriedAccused');
        $('[name="entityNames"]').each(function() {
            arr.push($(this).val());
        });
        buriedNodd.val(arr.join(','));
        buriedNodd.trigger('blur');
    };

});
