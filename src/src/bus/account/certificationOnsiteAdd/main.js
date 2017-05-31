"use strict";
/**
 * 业务：我的诉讼[account/certificationOnsiteAddon]
 * 2016,2,29
 */
define(function(require, exports, module) {
    var $ = require('$'),
        Validator = require('common/validator'),
        Calendar = require('common/calendar'),
        util = require('common/util'),
        Upload = require('model/upload/main'),
        Ajax = require('model/ajax/main');

    //表单验证
    var validatorExp = Validator.use('#certificationOnsiteAdd-form');
    //日历控件
    var dateStart = new Calendar({
        trigger: '#submit-date-fr'
    });
    var dateEnd = new Calendar({
        trigger: '#submit-date-to'
    });
    //组件：上传
    Upload.use('.JS-need-upload');

    //变量
    var $submitBtn = $('#submit-btn'), //确认按钮
        $backBtn = $('#back-btn'); //返回按钮
    //点击确认
    $submitBtn.on('click', function() {
        validatorExp.execute(function(err, errList, element) {
            var pass = true;
            if (err) {
                var type = $(':radio:checked').val();
                if (type === 'normal') {
                    errList.forEach(function(item, index) {
                        if (item[0] && (item[2].attr('id') !== 'fileLicenseIds')) {
                            console.log(item);
                            pass = false;
                        }
                    })
                } else if (type === 'legal') {
                    errList.forEach(function(item, index) {
                        if (item[0] && item[2].attr('id') !== 'fileFrontIds' && item[2].attr('id') !== 'fileBackIds') {
                            console.log(item);
                            pass = false;
                        }

                    })
                }
                if (pass) {
                    var ajaxData = new Ajax({
                        request: '/account/certificationOnsiteRpc/saveCertificationInfo.json',
                        parseForm: '#certificationOnsiteAdd-form',
                        paramName: 'paramMap'
                    }).on('ajaxSuccess', function(rtv, msg, con) {
                        alert(msg);
                    }).submit();
                }
            }



        });
    });
    //点击法人事件
    $('.cert-legal').on('click', function() {
        $('.item-normal').addClass('fn-hide').children().addClass('fn-hide');
        $('.item-legal').removeClass('fn-hide').children().removeClass('fn-hide');

    });
    //点击自然人事件
    $('.cert-normal').on('click', function() {
        $('.item-legal').addClass('fn-hide').children().addClass('fn-hide');
        $('.item-normal').removeClass('fn-hide').children().removeClass('fn-hide');
    });
});
