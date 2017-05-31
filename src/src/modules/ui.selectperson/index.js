/* 
* @Author: caoke
* @Date:   2014-12-22 00:30:31
* @Last Modified by:   caoke
* @Last Modified time: 2015-04-14 11:14:14
*/
define(function(require, exports, module) {
    require('selectperson.css');
    var $ = require('$');
    var crystal = require('crystal');
    var Selectperson = require('selectperson');
    var i18n = require('./i18n/{locale}');

    var SelectPerson = crystal.moduleFactory({
        attrs: {
            count: 1,
            initvalue: '',
            url: '//work.alibaba-inc.com/work/xservice/sns/suggestion/suggestionAt.jsonp',
            showteam: false,
            width: null,
            type: 'jsonp',
            field: 'value'
        },
        setup: function() {
            var me = this;
            me.render();
            var sp = me._sp = new Selectperson();

            var width = me.get('width') || me.element.outerWidth() - 12;
            var cfg = {
                sence: 'option1',
                dataType: me.get('type'),
                url: me.get('url'),
                callBack: function(data) {
                    var val = $.map(data, function(n) {
                        return n.emplId;
                    }).join(',');
                    var model = me.get('model');
                    if (model) {
                        model[me.get('field')] = val;
                    }
                    me.element.val(val).data('value', data).trigger('validate').trigger('change');
                }, // 回调函数
                selectNumber: me.get('count'), // 可选人数
                // defaultData: me.get('initvalue') || [], // 默认选中的人
                container: me.element,
                isShowTeam: me.get('showteam'),
                css: {
                    width: width
                },
                placeholder: {
                    width: 0,
                    name: null
                },
                teamTplLable:{
                    direct: i18n.direct,
                    allnum: i18n.allnum,
                    unite: i18n.unite
                },
                nodataText: i18n.nodata
            };

            sp.init(cfg);
            setTimeout(function() {
                sp.setData(me.get('initvalue') || [], true); // 默认选中的人
            }, 0);
        },
        clean: function() {
            var me = this;
            me._sp.clearData();
        }
    });

    module.exports = SelectPerson;
});