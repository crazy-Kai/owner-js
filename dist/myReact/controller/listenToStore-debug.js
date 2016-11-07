"use strict";
define("js/bus/myReact/controller/listenToStore-debug", ["common/react-debug", "common/reflux-debug", "common/util-debug", "js/bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        util = require("common/util-debug"),
        ListenToActions = require("js/bus/myReact/controller/listenToActions-debug"),
        ListenToStore = Reflux.createStore({
            listenables: [ListenToActions],
            init: function() {
                this.onGetInitData()
            },
            onGetInitData: function() {
                var me = this;
                util.getInitData("../data.json").then(function(data) {
                    me.trigger({
                        type: "init",
                        value: data
                    })
                })["catch"](function(err) {})
            },
            onDataChange: function(newData) {
                var me = this;
                newData.id ? me.onModify(newData) : me.onAdd(newData)
            },
            onAdd: function(newData) {
                var me = this;
                newData.id = util.mathRandom(500), me.trigger({
                    type: "add",
                    value: newData
                })
            },
            onModify: function(newData) {
                var me = this;
                me.trigger({
                    type: "modify",
                    value: newData
                })
            },
            onDelete: function(delData) {
                var me = this;
                me.trigger({
                    type: "delete",
                    value: delData
                })
            }
        });
    module.exports = ListenToStore
});
"use strict";
define("js/bus/myReact/controller/listenToActions-debug", ["common/react-debug", "common/reflux-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        ListenToActions = Reflux.createActions(["dataChange", "getInitData", "delete"]);
    module.exports = ListenToActions
});
"use strict";
define("js/bus/myReact/controller/listenToActions-debug", ["common/react-debug", "common/reflux-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        ListenToActions = Reflux.createActions(["dataChange", "getInitData", "delete"]);
    module.exports = ListenToActions
});
"use strict";
define("js/bus/myReact/controller/listenToActions-debug", ["common/react-debug", "common/reflux-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        ListenToActions = Reflux.createActions(["dataChange", "getInitData", "delete"]);
    module.exports = ListenToActions
});
"use strict";
define("js/bus/myReact/controller/listenToActions-debug", ["common/react-debug", "common/reflux-debug"], function(require, exports, module) {
    var Reflux = (require("common/react-debug"), require("common/reflux-debug")),
        ListenToActions = Reflux.createActions(["dataChange", "getInitData", "delete"]);
    module.exports = ListenToActions
});