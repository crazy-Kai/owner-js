"use strict";
define("src/model/react/demo/controller-debug", ["common/jquery-debug", "common/react/control-debug"], function(require, exports, module) {
    var Control = (require("common/jquery-debug"), require("common/react/control-debug"));
    return Control({
        store: {
            a: "a1"
        },
        getInitialState: function() {
            return this.store
        },
        onAdd: function() {
            var me = this,
                store = me.store;
            me.ajax({
                request: "/portal/mediatorRpc/queryMediator.json",
                param: {
                    filterMap: JSON.stringify({
                        cityId: "",
                        mediatorType: "",
                        page: {
                            begin: 0,
                            length: 8
                        }
                    })
                }
            }).then(function() {
                store.b = "b2", me.updateComponent()
            }, function() {})
        }
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});