define(function(require, exports, module) {
    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');
    //依赖
    var $ = require('$'),
        Validator = require('common/validator'),
        Upload = require('model/upload/main'),
        Delegate = require('common/delegate'),
        Modal = require('model/modal/main'),
        Ajax = require('model/ajax/main');

    //验证组建
    var ValidatorExp = Validator.use('#form', '[data-widget="validator"]');
    // 上传文件
    new Upload({ trigger: '[data-widget="upload"]' });
    //如果初始化表单里面有*号就暂时隐藏
    function tempHideInout() {
        $('#form').find('input[type="text"]').each(function() {
            var self = $(this);
            if (self.val().indexOf('*') !== -1) {
                self.addClass('fn-hide');
            }
        });
    }
    //判断手机和邮箱是否为空
    function testValue() {
        if (!$('[name="phone"]').val() && !$('[name="email"]').val()) {
            $('[data-test="test"]').removeClass('fn-hide')
        } else {
            $('[data-test="test"]').addClass('fn-hide');
        }
    }
    // 当键盘按下时影藏错误提示
    $('[name="phone"],[name="email"]').keydown(function() {
            $('[data-test="test"]').addClass('fn-hide');
        })
        // // 发送请求
    Delegate.on("click", "[data-target='commit']", function() {
        //关闭
        tempHideInout();
        testValue();
        ValidatorExp.execute(function(isErr, list) {
            if (!isErr) {
                if ($.trim($('[name="phone"]').val()) || $.trim($('[name="email"]').val())) {
                    new Ajax({
                        request: '/paymentorder/paymentObjectionRpc/fileObjection.json',
                        parseForm: '#form',
                        paramName: 'lassenPaymentObjectionVo',
                        paramParse: function(json) {
                            for (var i in json) {
                                    if (json[i].indexOf('*') !== -1) {
                                        delete json[i];
                                    }
                            }
                            return json;
                        }
                    }).on("ajaxSuccess", function() {
                        Modal.alert(1, "提交成功", function() {
                            window.location.href = "/suit/newMySuit.htm";
                        })
                    }).submit();
                }
            }
        });
        //开启
        $('#form').find('input[type="text"]').removeClass('fn-hide');

    })

})
