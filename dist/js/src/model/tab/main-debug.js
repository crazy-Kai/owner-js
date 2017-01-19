"use strict";
define("src/model/tab/main-debug", ["common/myWidget-debug"], function(require, exports, module) {
    var MyWidget = require("common/myWidget-debug"),
        $ = MyWidget.jQuery,
        Tab = MyWidget.extend({
            clssName: "Tab",
            attrs: {
                menu: ".JS-target-menu",
                list: ".JS-target-list",
                mainIndex: 0,
                active: "ch-active"
            },
            initProps: function() {
                var me = this;
                me.tabMenu = me.$(me.get("menu")), me.tabList = me.$(me.get("list")), me.maxIndex = me.tabMenu.length - 1
            },
            setup: function() {
                var me = this;
                me.delegateEvents(me.element, "click " + me.get("menu"), function(e) {
                    e.preventDefault();
                    var me = this,
                        target = $(e.target);
                    me.tabShow(e, me.tabMenu.index(target))
                }), me.tabShow(null, me.get("mainIndex"))
            },
            tabShow: function(e, index) {
                var me = this,
                    active = me.get("active");
                return me.set("mainIndex", index), me.tabMenu.removeClass(active).eq(index).addClass(active), me.tabList.addClass("fn-hide").eq(index).removeClass("fn-hide"), me.trigger("chose", e, index, me.tabMenu.eq(index), me.tabList.eq(index)), me
            },
            tabHide: function() {
                var me = this;
                return me.tabList.addClass("fn-hide"), me
            }
        });
    return Tab
});