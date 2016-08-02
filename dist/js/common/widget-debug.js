"use strict";
define("js/common/widget-debug", ["common/jquery-debug", "common/base-debug", "common/limit-dom-debug"], function(require, exports) {
    function setAttr(me, key, element) {
        if ("element" !== key && "template" !== key) {
            var dataVal = element.data(key);
            dataVal && me.set(key, dataVal)
        }
    }

    function parseAttr(me, element) {
        var dataset;
        return (dataset = element[0].dataset) ? Base.limit.each(dataset, function(val, key) {
            setAttr(me, key, element)
        }) : parseAttrByAttributes(element[0].attributes, function(val, key) {
            setAttr(me, key, element)
        }), me
    }

    function parseAttrByAttributes(attributes, callback) {
        Base.limit.each(attributes, function(val, index) {
            var key = val.nodeName;
            REX_DATA.test(key) && (key = RegExp.$1.slice(1).replace(REX_FIRST, function(a, b) {
                return b.toUpperCase()
            }), callback(val.nodeValue, key))
        })
    }

    function formatEventsArr(events) {
        var arr = [];
        return Base.limit.each(events, function(val, key) {
            arr.push(key)
        }), arr
    }

    function destroyWidget(me) {
        var widgetCid = me.widgetCid,
            element = me.element,
            widgetCids = element.attr("widget-cid").split(",");
        delete cacheWidget["widgetCid" + widgetCid], widgetCids.splice(me.limit.indexOf(widgetCids, widgetCid), 1), element.attr("widget-cid", widgetCids.join(",")), "" === element.attr("widget-cid") && element.removeAttr("widget-cid")
    }
    var $ = require("common/jquery-debug"),
        Base = require("common/base-debug"),
        limitDom = require("common/limit-dom-debug"),
        widgetEventsNS = ".widgetEvents",
        WIN = window,
        DOC = document,
        BODY = DOC.body,
        REX_DATA = /^data((?:-.+)+)$/,
        REX_FIRST = /-([a-z])/g,
        cacheWidget = WIN.cacheWidget = {};
    cacheWidget.cid = 0;
    var winOpener = WIN.opener;
    winOpener && Base.limit.extend(cacheWidget, winOpener.cacheWidget);
    var winParent = WIN.parent;
    winParent !== WIN && Base.limit.extend(cacheWidget, winParent.cacheWidget);
    var Widget = Base.extend({
        attrs: {
            trigger: null,
            element: null,
            events: null,
            id: null,
            className: null,
            style: null,
            template: "<div></div>",
            parentNode: BODY
        },
        className: "Widget",
        init: function(config) {
            var me = this;
            return Widget.superClass.init.call(me, config), me.parseElement() ? (me.parseElementAttr(), me.parseTrigger(), me.parseTriggerAttr(), me.widgetCid = "" + ++cacheWidget.cid, cacheWidget["widgetCid" + me.widgetCid] = me, me.initProps(), me.renderAttr(), me.setup(), me.initEvents(), me.delegateEvents(), me) : me
        },
        destroy: function() {
            var me = this;
            return me.undelegateEvents(), me.widgetIsTemplate && me.element.remove(), destroyWidget(me), Widget.superClass.destroy.call(me), me
        },
        parseElement: function() {
            var me = this,
                element = me.get("element");
            return null === element ? (element = $(me.get("template")), me.widgetIsTemplate = !0) : element = $(element), 0 === element.length ? me.limit.log("element构建失败。") : (me.element = element, me)
        },
        parseElementAttr: function() {
            return parseAttr(this, this.element)
        },
        parseTrigger: function() {
            var me = this,
                triggerNode = $(me.get("trigger"));
            return triggerNode.length && (me.triggerNode = triggerNode), me
        },
        parseTriggerAttr: function() {
            var me = this,
                triggerNode = me.triggerNode;
            return triggerNode && me.widgetIsTemplate ? parseAttr(this, triggerNode) : me
        },
        initProps: Base.limit.K,
        setup: Base.limit.K,
        renderAttr: function() {
            var me = this,
                element = me.element,
                id = me.get("id"),
                className = me.get("className"),
                widgetCid = element.attr("widget-cid"),
                style = me.get("style");
            return id && element.prop("id", id), className && element.addClass(className), style && element.css(style), element.attr("widget-cid", widgetCid ? widgetCid + "," + me.widgetCid : me.widgetCid), me
        },
        render: function() {
            var me = this,
                element = me.element,
                elementDom = element[0],
                parentNode = $(me.get("parentNode"));
            return me.set("parentNode", parentNode), elementDom && !$.contains(BODY, elementDom) && parentNode.append(element), me
        },
        initEvents: function() {
            var me = this,
                attrsEvents = me.get("events"),
                recursiveEvents = me.recursiveAttrs("events"),
                events = recursiveEvents.origin,
                eventsArr = recursiveEvents.arr;
            return me.limit.each(attrsEvents, function(val, key) {
                !events[key] && eventsArr.push(key)
            }), me.set("events", me.limit.extend(recursiveEvents.origin, attrsEvents)), me.set("eventsArr", eventsArr), me
        },
        delegateEvents: function(element, events) {
            var eventsArr, me = this,
                length = arguments.length;
            return 0 === length ? (element = me.element, events = me.get("events"), eventsArr = me.get("eventsArr")) : 1 === length ? (events = element, element = me.element, eventsArr = formatEventsArr(events)) : 2 === length && (eventsArr = formatEventsArr(events)), !me.delegateElements && (me.delegateElements = []), !me.limit.contains(me.delegateElements, element) && me.delegateElements.push(element), me.limit.each(eventsArr, function(key, index) {
                var keys = key.split(" "),
                    val = events[key],
                    val = "function" == typeof val ? val : me[val] || me.K;
                element.on(keys[0] + widgetEventsNS + "widgetCid" + me.widgetCid, keys[1], function(e) {
                    val.call(me, this, e)
                })
            }), me
        },
        undelegateEvents: function(element) {
            var delegateElements, me = this,
                length = arguments.length;
            return 0 === length ? delegateElements = me.delegateElements : 1 === length && (delegateElements = [].concat(element)), me.limit.each(delegateElements, function(val) {
                val.off(widgetEventsNS + "widgetCid" + me.widgetCid)
            }), me
        },
        $: function(selector) {
            return this.element.find(selector)
        },
        jQuery: $,
        Implements: {
            limitDom: limitDom
        },
        Statics: {
            query: function(query) {
                var me = this,
                    arr = [],
                    widgetCids = $(query).attr("widget-cid");
                return widgetCids ? (me.limit.each(widgetCids.split(","), function(val) {
                    var wid = cacheWidget["widgetCid" + val];
                    wid && arr.push(wid)
                }), me.limit.getArray(arr)) : null
            },
            limitDom: limitDom
        }
    });
    return Widget
});