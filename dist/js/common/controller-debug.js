"use strict";
define("js/common/controller-debug", ["common/reflux-debug", "common/limit2-debug.0", "modules/ajax/main-debug"], function(require, exports) {
    var Reflux = require("common/reflux-debug"),
        limit = require("common/limit2-debug.0"),
        Ajax = require("modules/ajax/main-debug"),
        REX = /on([A-Z]\w*)/,
        Promise = limit.promise();
    return function(config) {
        var Actions = Reflux.createActions(limit.map(limit.filter(limit.keys(config), function(val) {
            return REX.test(val)
        }), function(val) {
            return val.replace(REX, "$1").toLowerCase()
        }));
        config.listenables = [Actions], config.updateComponent = function() {
            var me = this,
                store = me.getInitialState();
            return new Promise(function(resolve) {
                me.trigger(store, resolve)
            })
        }, config.ajax = function(config) {
            return new Promise(function(resolve, reject) {
                new Ajax(config).on("ajaxSuccess", resolve).on("ajaxError", reject).submit()
            })
        };
        var Store = Reflux.createStore(config);
        return {
            Store: Store,
            Actions: Actions
        }
    }
});