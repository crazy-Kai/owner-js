"use strict";
define("src/bus/suit/simCase/simCaseIndex/main-debug", ["src/bus/suit/simCase/common/main-debug", "common/jquery-debug", "model/placeHolder/main-debug", "common/delegate-debug", "common/validator-debug"], function(require, exports, module) {
    require("src/bus/suit/simCase/common/main-debug");
    var Validator = (require("common/jquery-debug"), require("common/validator-debug"));
    Validator.use("#simCaseForm", '[data-widget="validator"]', {
        events: {
            "click #reset": function() {
                var me = this;
                this.element[0].reset(), me.$('[type="text"],textarea,select').val("")
            }
        }
    })
});
"use strict";
define("src/bus/suit/simCase/common/main-debug", ["common/jquery-debug", "model/placeHolder/main-debug", "common/delegate-debug"], function(require, exports, module) {
    function maxlength() {
        var self = $(this),
            length = self.attr("maxlength");
        setTimeout(function() {
            var val = self.val();
            val.length > length && self.val(val.slice(0, length)), self.trigger("realTime")
        }, 0)
    }
    var $ = require("common/jquery-debug"),
        PlaceHolder = require("model/placeHolder/main-debug"),
        delegate = require("common/delegate-debug"),
        documentMode = document.documentMode;
    !documentMode || 8 !== documentMode && 9 !== documentMode || (delegate.on("keydown", "[maxlength]", maxlength), delegate.on("paste", "[maxlength]", maxlength), $("[placeholder]").each(function() {
        new PlaceHolder({
            element: this
        })
    }))
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});