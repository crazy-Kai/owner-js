"use strict";
define("src/model/searchList/main-debug", ["model/perSearch/main-debug", "model/modal/main-debug"], function(require, exports, module) {
    var PerSearch = require("model/perSearch/main-debug"),
        Modal = require("model/modal/main-debug"),
        SearchList = PerSearch.extend({
            clssName: "SearchList",
            events: {
                "click .JS-click-reload": "searchListReload",
                "click .JS-trigger-click-delete": function(e) {
                    var me = this,
                        target = me.jQuery(e.target);
                    Modal.confirm("提示", "确认要删除么？", function() {
                        me.http(me.get("requestDelete"), target.data("param"), "post", function(err, rtv, msg, response) {
                            err ? Modal.alert("错误", err) : me.trigger("deleteSuccess", rtv, msg, response, target)
                        })
                    })
                },
                "click .JS-trigger-click-editor": function(e) {
                    var me = this,
                        target = me.jQuery(e.target);
                    me.http(me.get("requestEditor"), target.data("param"), "post", function(err, rtv, msg, response) {
                        err ? Modal.alert("错误", err) : me.trigger("editorSuccess", rtv, msg, response, target)
                    })
                }
            }
        });
    return SearchList
});