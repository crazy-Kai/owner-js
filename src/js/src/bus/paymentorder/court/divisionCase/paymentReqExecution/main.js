define(function(require, exports, module) {
    "use strict"
    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');
    //依赖
    var $ = require('$'),
        Validator = require('common/validator'),
        Delegate = require('common/delegate'),
        Modal = require('model/modal/main'),
        Ajax = require('model/ajax/main');
    //验证组建
    var ValidatorExp = Validator.use('#form', '[data-widget="validator"]');
    var securityId = $('[name="securityCaseId"]').val();
    //发送请求
    Delegate.on("click", "[data-target='commit']", function() {
        ValidatorExp.execute(function(isErr, list) {
            if (!isErr) {
                new Ajax({
                    request: '/paymentorder/paymentExecutionRpc/requestExecution.json',
                    parseForm: '#form',
                    paramName: 'lassenPaymentExecutionDo'
                   
                }).on("ajaxSuccess", function() {
                    Modal.alert(1, "提交成功", function() {
                        window.location.href = "/suit/newMySuit.htm#paymentAllCase";
                    })
                }).submit();
            }
        })

    })
})
