"use strict";
/**
 * 验证类[全站的验证入口]
 * 2015,05,21 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        util = require('common/util'), //工具类
        ValidatorOld = require('validator');

    //类
    var Validator = ValidatorOld.extend({
        //清楚error样式
        clearError: function() {
            var me = this;
            $(me.items).each(function(val) {
                this.element.closest('.kuma-form-item').removeClass('kuma-form-item-error');
            });
            return me;
        },
        execute: function(cb) {
            var me = this;
            if (!me.items) {
                return cb(null);
            };
            return Validator.superclass.execute.call(me, cb);
        },
        destroy: function() {
            var me = this;
            me.clearError();
            return Validator.superclass.destroy.call(me);
        },
        removeItems: function(form, query) {
            var me = this,
                ele = $(form);
            ele.each(function(index1, domEle1) {
                var section = $(domEle1);
                section.find(query || '.JS-target-required').each(function(index2, domEle2) {
                    me.removeItem($(domEle2));
                });
            });
        },
        addItems: function(form, query) {
            var me = this,
                ele = $(form);
            ele.each(function(index1, domEle1) {
                var section = $(domEle1);
                section.find(query || '.JS-target-required').each(function(index2, domEle2) {

                    var node = $(domEle2),
                        nodeType = node.prop('type'),
                        skipHidden = node.data('skipHidden');
                    // 如果是radio或者是checkbox
                    if (nodeType === 'radio' || nodeType === 'checkbox') {
                        node = section.find('[name="' + node.prop('name') + '"]');
                    };
                    //默认是跳过隐藏的 只有设置 为false 的时候才是不跳过的
                    skipHidden = skipHidden === false ? false : true;
                    me.addItem($.extend({
                        element: node,
                        triggerType: node.data('triggerType'),
                        skipHidden: skipHidden,
                        checkNull: false, //是否验证'空'
                        onItemValidate: function(ele) {
                            if (nodeType === 'text') {
                                ele.val($.trim(ele.val()));
                            };
                        }
                    }));
                });
            });
        },
        //静态
        Statics: {
            use: function(element, query, elementConfig, queryConfig) {
                element = $(element);
                if (!element.length) {
                    return;
                }
                var me = this,
                    validatorExp = new me($.extend({
                        element: element,
                    }, elementConfig));
                element.find(query || '.JS-target-required').each(function() {
                    var node = $(this),
                        checkNull = node.data('checkNull'),
                        nodeType = node.prop('type'),
                        skipHidden = node.data('skipHidden'),
                        trim = node.data('trim');
                    // 如果是radio或者是checkbox
                    if (nodeType === 'radio' || nodeType === 'checkbox') {
                        node = element.find('[name="' + node.prop('name') + '"]');
                    };
                    //默认是跳过隐藏的 只有设置 为false 的时候才是不跳过的
                    skipHidden = skipHidden === false ? false : true;
                    checkNull = checkNull === true ? true : false;
                    trim = trim === true ? true : false;
                    validatorExp.addItem($.extend({
                        element: node,
                        triggerType: node.data('triggerType'),
                        skipHidden: skipHidden,
                        checkNull: checkNull, //是否验证'空'
                        onItemValidate: function(ele) {
                            if (nodeType === 'text' || (trim && nodeType === 'textarea')) {
                                ele.val($.trim(ele.val()));
                            };
                        }
                    }, queryConfig));
                });
                return validatorExp;
            },
            oneExecute: function(element, query) {
                var me = this,
                    flag,
                    oneValidator = me.oneValidator;
                //销毁
                oneValidator && oneValidator.destroy && oneValidator.destroy();
                //初始化
                oneValidator = me.use(element, query);
                //验证
                oneValidator.execute(function(isErr, errList) {
                    flag = isErr;
                    if (isErr) {
                        util.log(errList);
                    }
                });
                //重设
                me.oneValidator = oneValidator;
                return flag;
            }
        }
    });

    //函数：确定是否是身份证
    function isIdCard(cardid) {
        //身份证正则表达式(18位) 
        var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
        var stard = "10X98765432"; //最后一位身份证的号码
        var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
        var sum = 0;
        if (!isIdCard2.test(cardid)) {
            return false;
        }
        var year = cardid.substr(6, 4);
        var month = cardid.substr(10, 2);
        var day = cardid.substr(12, 2);
        var birthday = cardid.substr(6, 8);
        if (birthday != dateToString(new Date(year + '/' + month + '/' + day))) { //校验日期是否合法
            return false;
        }
        for (var i = 0; i < cardid.length - 1; i++) {
            sum += cardid[i] * first[i];
        }
        var result = sum % 11;
        var last = stard[result]; //计算出来的最后一位身份证号码

        if (cardid[cardid.length - 1].toUpperCase() == last) {
            return true;
        } else {
            return false;
        }
    }
    //转义日期
    function dateToString(date) {
        if (date instanceof Date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            var day = date.getDate();
            day = day < 10 ? '0' + day : day;
            return '' + year + month + day;
        }
        return '';
    }

    //自定义方法
    Validator.addRule('cardid', function(options) {
        return isIdCard(options.element.val());
    }, '请填写正确的身份证号');

    //邮编
    Validator.addRule('postalcode', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^\d{6}$/.test(val);
    }, '请填写正确的邮政编码');

    //正整数
    Validator.addRule('wholeNumber', function(options) {
        var val = $.trim(options.element.val());
        return !val || (/^\d+$/.test(val) && +val);
    }, '请填写正整数');

    //自然数
    Validator.addRule('naturalNumber', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^\d+$/.test(val);
    }, '请填写自然数');

    //座机
    Validator.addRule('tel', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^\d{3,4}-\d{7,8}$/.test(val);
    }, '请填写正确的电话号码(比如：0571-88888888)');

    //联系电话 手机或者座机
    Validator.addRule('mobileOrTel', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^\d{3,4}-\d{7,8}$/.test(val) || /^\d{11}$/.test(val);
    }, '请填写正确的电话号码(比如：0571-88888888)');

    //金钱
    Validator.addRule('money', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^\d+(.\d{1,2})?$/.test(val);
    }, '请填写正确的金额');

    //字母数字下划线
    Validator.addRule('letter', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^\w+$/.test(val);
    }, '请填写字母数字下划线');


    //营业执照
    Validator.addRule('credentials', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^(\w|\(|\)){6,15}$/.test(val);
    }, '请填写字母数字下划线括号');

    //字母数字下划线
    Validator.addRule('aliyunEmail', function(options) {
        var val = $.trim(options.element.val());
        return !val || /@aliyun\.com$/.test(val);
    }, '请填写正确的阿里云邮箱');

    //生份证后4位
    Validator.addRule('lastcardid', function(options) {
        var val = $.trim(options.element.val());
        return !val || /^(\d{4}|\d{3}X)$/i.test(val);
    }),
    
    //多个手机号码
    Validator.addRule('multiMobile', function(options) {
        var val = $.trim(options.element.val());
        return /^(?:1\d{10}[,，])*1\d{10}$/.test(val);
    },"请填写正确的手机号(若多个手机号，请用 “，” 隔开)")
    return Validator;
});
