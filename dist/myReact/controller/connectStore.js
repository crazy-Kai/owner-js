"use strict";define("js/bus/myReact/controller/connectStore",["common/react","common/reflux","js/bus/myReact/controller/connectActions"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=require("js/bus/myReact/controller/connectActions"),ConnectStore=Reflux.createStore({listenables:[ConnectActions],isShow:!1,onAdd:function(){var me=this;me.trigger({boxStyle:{display:me.isShow?"none":"block"}},function(){me.isShow=!me.isShow})},onGetTarget:function(e){}});return ConnectStore});
"use strict";define("js/bus/myReact/controller/connectActions",["common/react","common/reflux"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=Reflux.createActions(["add","getTarget"]);module.exports=ConnectActions});
"use strict";define("js/bus/myReact/controller/connectActions",["common/react","common/reflux"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=Reflux.createActions(["add","getTarget"]);module.exports=ConnectActions});
"use strict";define("js/bus/myReact/controller/connectActions",["common/react","common/reflux"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=Reflux.createActions(["add","getTarget"]);module.exports=ConnectActions});
"use strict";define("js/bus/myReact/controller/connectActions",["common/react","common/reflux"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=Reflux.createActions(["add","getTarget"]);module.exports=ConnectActions});
"use strict";define("js/bus/myReact/controller/connectActions",["common/react","common/reflux"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=Reflux.createActions(["add","getTarget"]);module.exports=ConnectActions});
"use strict";define("js/bus/myReact/controller/connectActions",["common/react","common/reflux"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=Reflux.createActions(["add","getTarget"]);module.exports=ConnectActions});
"use strict";define("js/bus/myReact/controller/connectActions",["common/react","common/reflux"],function(require,exports,module){var Reflux=(require("common/react"),require("common/reflux")),ConnectActions=Reflux.createActions(["add","getTarget"]);module.exports=ConnectActions});