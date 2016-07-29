"use strict";
define("js/common/voidWidget-debug", ["arale-base-debug", "jquery-debug", "-debug"], function(require, exports, module) {
    function uniqueCid() {
        return "widget-" + cidCounter++
    }

    function isString(val) {
        return "[object String]" === toString.call(val)
    }

    function isFunction(val) {
        return "[object Function]" === toString.call(val)
    }

    function isInDocument(element) {
        return contains(document.documentElement, element)
    }

    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1)
    }

    function getEvents(widget) {
        return isFunction(widget.events) && (widget.events = widget.events()), widget.events
    }

    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER),
            eventType = match[1] + DELEGATE_EVENT_NS + widget.cid,
            selector = match[2] || void 0;
        return selector && selector.indexOf("{{") > -1 && (selector = parseExpressionInEventKey(selector, widget)), {
            type: eventType,
            selector: selector
        }
    }

    function parseExpressionInEventKey(selector, widget) {
        return selector.replace(EXPRESSION_FLAG, function(m, name) {
            for (var part, parts = name.split("."), point = widget; part = parts.shift();) point = point === widget.attrs ? widget.get(part) : point[part];
            return isString(point) ? point : INVALID_SELECTOR
        })
    }

    function isEmptyAttrValue(o) {
        return null == o || void 0 === o
    }

    function trimRightUndefine(argus) {
        for (var i = argus.length - 1; i >= 0 && void 0 === argus[i]; i--) argus.pop();
        return argus
    }
    var Base = require("arale-base-debug"),
        $ = require("jquery-debug"),
        DAParser = require("-debug"),
        AutoRender = require("-debug"),
        DELEGATE_EVENT_NS = ".delegate-events-",
        ON_RENDER = "_onRender",
        DATA_WIDGET_CID = "data-widget-cid",
        cachedInstances = {},
        Widget = Base.extend({
            propsInAttrs: ["initElement", "element", "events"],
            element: null,
            events: null,
            attrs: {
                id: null,
                className: null,
                style: null,
                template: "<div></div>",
                model: null,
                parentNode: document.body
            },
            initialize: function(config) {
                this.cid = uniqueCid();
                var dataAttrsConfig = this._parseDataAttrsConfig(config);
                Widget.superclass.initialize.call(this, config ? $.extend(dataAttrsConfig, config) : dataAttrsConfig), this.parseElement(), this.initProps(), this.delegateEvents(), this.setup(), this._stamp(), this._isTemplate = !(config && config.element)
            },
            _parseDataAttrsConfig: function(config) {
                var element, dataAttrsConfig;
                return config && (element = $(config.initElement ? config.initElement : config.element)), element && element[0] && !AutoRender.isDataApiOff(element) && (dataAttrsConfig = DAParser.parseElement(element)), dataAttrsConfig
            },
            parseElement: function() {
                var element = this.element;
                if (element ? this.element = $(element) : this.get("template") && this.parseElementFromTemplate(), !this.element || !this.element[0]) throw new Error("element is invalid")
            },
            parseElementFromTemplate: function() {
                this.element = $(this.get("template"))
            },
            initProps: function() {},
            delegateEvents: function(element, events, handler) {
                var argus = trimRightUndefine(Array.prototype.slice.call(arguments));
                if (0 === argus.length ? (events = getEvents(this), element = this.element) : 1 === argus.length ? (events = element, element = this.element) : 2 === argus.length ? (handler = events, events = element, element = this.element) : (element || (element = this.element), this._delegateElements || (this._delegateElements = []), this._delegateElements.push($(element))), isString(events) && isFunction(handler)) {
                    var o = {};
                    o[events] = handler, events = o
                }
                for (var key in events)
                    if (events.hasOwnProperty(key)) {
                        var args = parseEventKey(key, this),
                            eventType = args.type,
                            selector = args.selector;
                        ! function(handler, widget) {
                            var callback = function(ev) {
                                isFunction(handler) ? handler.call(widget, ev) : widget[handler](ev)
                            };
                            selector ? $(element).on(eventType, selector, callback) : $(element).on(eventType, callback)
                        }(events[key], this)
                    }
                return this
            },
            undelegateEvents: function(element, eventKey) {
                var argus = trimRightUndefine(Array.prototype.slice.call(arguments));
                if (eventKey || (eventKey = element, element = null), 0 === argus.length) {
                    var type = DELEGATE_EVENT_NS + this.cid;
                    if (this.element && this.element.off(type), this._delegateElements)
                        for (var de in this._delegateElements) this._delegateElements.hasOwnProperty(de) && this._delegateElements[de].off(type)
                } else {
                    var args = parseEventKey(eventKey, this);
                    element ? $(element).off(args.type, args.selector) : this.element && this.element.off(args.type, args.selector)
                }
                return this
            },
            setup: function() {},
            render: function() {
                this.rendered || (this._renderAndBindAttrs(), this.rendered = !0);
                var parentNode = this.get("parentNode");
                if (parentNode && !isInDocument(this.element[0])) {
                    var outerBoxClass = this.constructor.outerBoxClass;
                    if (outerBoxClass) {
                        var outerBox = this._outerBox = $("<div></div>").addClass(outerBoxClass);
                        outerBox.append(this.element).appendTo(parentNode)
                    } else this.element.appendTo(parentNode)
                }
                return this
            },
            _renderAndBindAttrs: function() {
                var widget = this,
                    attrs = widget.attrs;
                for (var attr in attrs)
                    if (attrs.hasOwnProperty(attr)) {
                        var m = ON_RENDER + ucfirst(attr);
                        if (this[m]) {
                            var val = this.get(attr);
                            isEmptyAttrValue(val) || this[m](val, void 0, attr),
                                function(m) {
                                    widget.on("change:" + attr, function(val, prev, key) {
                                        widget[m](val, prev, key)
                                    })
                                }(m)
                        }
                    }
            },
            _onRenderId: function(val) {
                this.element.attr("id", val)
            },
            _onRenderClassName: function(val) {
                this.element.addClass(val)
            },
            _onRenderStyle: function(val) {
                this.element.css(val)
            },
            _stamp: function() {
                var cid = this.cid;
                (this.initElement || this.element).attr(DATA_WIDGET_CID, cid), cachedInstances[cid] = this
            },
            $: function(selector) {
                return this.element.find(selector)
            },
            destroy: function() {
                this.undelegateEvents(), delete cachedInstances[this.cid], this.element && this._isTemplate && (this.element.off(), this._outerBox ? this._outerBox.remove() : this.element.remove()), this.element = null, Widget.superclass.destroy.call(this)
            }
        });
    $(window).unload(function() {
        for (var cid in cachedInstances) cachedInstances[cid].destroy()
    }), Widget.query = function(selector) {
        var cid, element = $(selector).eq(0);
        return element && (cid = element.attr(DATA_WIDGET_CID)), cachedInstances[cid]
    }, Widget.autoRender = AutoRender.autoRender, Widget.autoRenderAll = AutoRender.autoRenderAll, Widget.StaticsWhiteList = ["autoRender"], module.exports = Widget;
    var toString = Object.prototype.toString,
        cidCounter = 0,
        contains = $.contains || function(a, b) {
            return !!(16 & a.compareDocumentPosition(b))
        },
        EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/,
        EXPRESSION_FLAG = /{{([^}]+)}}/g,
        INVALID_SELECTOR = "INVALID_SELECTOR"
});