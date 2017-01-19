"use strict";
define("src/common/calendar-debug", ["common/jquery-debug", "calendar-debug"], function(require, exports) {
    var $ = require("common/jquery-debug"),
        nwCalendar = require("calendar-debug"),
        Calendar = nwCalendar.extend({
            attrs: {
                zIndex: 9999
            },
            initProps: function() {
                var me = this;
                return Calendar.superclass.initProps.call(me), me.set("trigger", $(me.get("trigger"))), me
            },
            setup: function() {
                var me = this;
                Calendar.superclass.setup.call(me), me.get("trigger").data("myWidget", me)
            },
            Statics: {
                use: function(query, config) {
                    var me = this,
                        list = [];
                    return $(query || ".JS-need-calendar").each(function() {
                        list.push(new me($.extend({
                            trigger: $(this)
                        }, config)))
                    }), list
                },
                getWidget: function(query) {
                    return $(query).data("myWidget")
                }
            }
        });
    return Calendar
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});