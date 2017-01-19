"use strict";
define("src/model/robot/main-debug", ["common/jquery-debug", "common/myWidget-debug"], function(require, exports, module) {
    var MyWidget = (require("common/jquery-debug"), require("common/myWidget-debug")),
        Robot = MyWidget.extend({
            clssName: "Robot",
            attrs: {},
            events: {
                'click [data-role="close"]': function() {
                    this.element.remove(), this.destroy()
                }
            },
            initProps: function() {},
            setup: function() {}
        });
    return Robot
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});