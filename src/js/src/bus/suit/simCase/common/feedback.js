"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    require('./main');

    //依赖
    var $ = require('$'),
        MyWidget = require('common/myWidget'),
        Ajax = require('model/ajax/main'),
        Model = require('model/modal/main'),
        PlaceHolder = require('model/placeHolder/main'),
        delegate = require('common/delegate'),
        Validator = require('common/validator');

    var feedbackHbs = require('./feedback-hbs');

    //类
    var Feedback = MyWidget.extend({
        //组件：类名
        clssName: 'Feedback',
        //组件：属性
        attrs: {
            trigger: '#feedBack',
            template: feedbackHbs()
        },
        //组件：事件
        events: {
            'click [data-trigger="submit"]': function() {
                var me = this;
                me.validatorExp.execute(function(isErr) {
                    if (!isErr) {
                        new Ajax({
                            request: "/suit/simCaseRpc/saveFeedback.json",
                            parseForm: me.element
                        }).on("ajaxSuccess", function() {
                            me.hide();
                            me.modelExp = Model.confirm("提示", "反馈内容发送成功.", null, null, {
                                noCancle: true,
                                noSure: true
                            });
                            window.setTimeout(function() {
                                me.modelExp.hide();
                            }, 3000)
                        }).submit();
                    }
                });
            },
            'click [data-trigger="cancal"]': function() {
                var me = this;
                me.hide();
            }

        },
        //组件：初始化数据
        initProps: function() {
            var me = this;
        },
        //组件：页面操作入口
        setup: function() {
            var me = this;
            me.delegateEvents(me.triggerNode, 'click', function() {
                me.show();
            });
            me.render();


            //函数：最大长度
            function maxlength() {
                var self = $(this),
                    length = self.attr('maxlength');
                setTimeout(function() {
                    var val = self.val();
                    if (val.length > length) {
                        self.val(val.slice(0, length));
                    }
                    //IE9下触发一下input校准
                    self.trigger('realTime');
                }, 0);
            }
            //事件：IE8，IE9下输入框对maxlength的兼容性处理
            var documentMode = document.documentMode;

            if (documentMode && (documentMode === 8 || documentMode === 9)) {
                //组件：占位符
                me.$('[placeholder]').each(function() {
                    new PlaceHolder({ element: this});
                });
            };
            me.validatorExp = Validator.use(me.element, '[data-widget="validator"]')


        },
        show: function() {
            var me = this;
            me.element.removeClass('fn-hide');
        },
        hide: function() {
            var me = this;
            //me.$('form') 表示从this.element下去找到$('form')这个元素
            var form = me.$('form')
                //jquery是没有reset()这个方法，所以要先将其转成原生DOM的选择器
            form[0].reset();
            me.element.addClass('fn-hide');
            me.validatorExp.clearError();
        }

    });

    return Feedback;

});
