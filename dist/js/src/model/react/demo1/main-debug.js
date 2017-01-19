"use strict";
define("src/model/react/demo1/main-debug", ["common/jquery-debug", "common/myWidget-debug", "src/model/react/demo1/aaa-hbs-debug", "common/handlerbars-debug"], function(require, exports, module) {
    var MyWidget = (require("common/jquery-debug"), require("common/myWidget-debug")),
        HBS = require("src/model/react/demo1/aaa-hbs-debug"),
        Demo1 = MyWidget.extend({
            attrs: {
                a: "a1"
            }
        }),
        Demo2 = Demo1.extend({
            clssName: "Demo1",
            attrs: {
                a: "a2"
            },
            events: {
                "click span": function(e) {},
                "input #aa": function(e) {}
            },
            initProps: function() {
                var me = this;
                me.aaaa = "aaaa", me.set("bbbb", "bbbb")
            },
            setup: function() {
                var me = this;
                me.element.html(HBS({
                    a: "a1"
                }))
            }
        });
    return Demo2
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("src/model/react/demo1/aaa-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile("<span>\t{{a}}</span>");
    return compile.source = "<span>\t{{a}}</span>", compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});