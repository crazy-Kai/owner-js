"use strict";
define("js/bus/myReact/jsx/dataTable-debug", ["common/react-debug", "common/reflux-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug", "js/bus/myReact/jsx/dataRow-debug", "common/util-debug", "bus/myReact/controller/listenToStore-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        Reflux = require("common/reflux-debug"),
        DataRow = (require("js/bus/myReact/jsx/pushbutton-debug"), require("js/bus/myReact/jsx/dataRow-debug")),
        ListenToStore = (require("bus/myReact/controller/listenToActions-debug"), require("bus/myReact/controller/listenToStore-debug")),
        DataTable = React.createClass({
            displayName: "DataTable",
            mixins: [Reflux.listenTo(ListenToStore, "onChange")],
            getInitialState: function() {
                return {
                    data: []
                }
            },
            onChange: function(data, fn) {
                var sourceData = this.state.data;
                switch (data.type) {
                    case "init":
                        this.setState({
                            data: data.value
                        });
                        break;
                    case "add":
                        sourceData.push(data.value), this.setState({
                            data: sourceData
                        });
                        break;
                    case "modify":
                        var newData = sourceData.map(function(val) {
                            return val.id == data.value.id && (val = data.value), val
                        });
                        this.setState({
                            data: newData
                        });
                        break;
                    case "delete":
                        var index = sourceData.indexOf(data.value);
                        index != -1 && sourceData.splice(index, 1), this.setState({
                            data: sourceData
                        })
                }
            },
            switchOperating: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var list = [];
                return this.state.data.map(function(val, i) {
                    list.push(React.createElement(DataRow, {
                        key: i,
                        data: val,
                        callbackParent: this.switchOperating
                    }))
                }.bind(this)), React.createElement("table", {
                    className: "fn-tabale fn-table-data",
                    width: "100%"
                }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
                    width: "100"
                }, "标题"), React.createElement("th", {
                    width: "100"
                }, "作者"), React.createElement("th", {
                    width: "150"
                }, "发布时间"), React.createElement("th", {
                    width: "150"
                }, "操作"))), React.createElement("tbody", null, list))
            }
        });
    module.exports = DataTable
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        DataRow = React.createClass({
            displayName: "DataRow",
            operatingButton: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var formate = "yyyy-MM-dd HH:mm",
                    value = this.props.data;
                return React.createElement("tr", {
                    "data-id": value.id
                }, React.createElement("td", null, value.title), React.createElement("td", null, value.author), React.createElement("td", null, util.formateDate(formate, value.addTime)), React.createElement("td", null, React.createElement(Pushbutton, {
                    btnName: "修改",
                    className: "fn-btn",
                    data: value,
                    callbackParent: this.operatingButton
                }), " ", React.createElement(Pushbutton, {
                    btnName: "删除",
                    className: "fn-btn",
                    data: value
                })))
            }
        });
    module.exports = DataRow
});
"use strict";
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        DataRow = React.createClass({
            displayName: "DataRow",
            operatingButton: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var formate = "yyyy-MM-dd HH:mm",
                    value = this.props.data;
                return React.createElement("tr", {
                    "data-id": value.id
                }, React.createElement("td", null, value.title), React.createElement("td", null, value.author), React.createElement("td", null, util.formateDate(formate, value.addTime)), React.createElement("td", null, React.createElement(Pushbutton, {
                    btnName: "修改",
                    className: "fn-btn",
                    data: value,
                    callbackParent: this.operatingButton
                }), " ", React.createElement(Pushbutton, {
                    btnName: "删除",
                    className: "fn-btn",
                    data: value
                })))
            }
        });
    module.exports = DataRow
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        DataRow = React.createClass({
            displayName: "DataRow",
            operatingButton: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var formate = "yyyy-MM-dd HH:mm",
                    value = this.props.data;
                return React.createElement("tr", {
                    "data-id": value.id
                }, React.createElement("td", null, value.title), React.createElement("td", null, value.author), React.createElement("td", null, util.formateDate(formate, value.addTime)), React.createElement("td", null, React.createElement(Pushbutton, {
                    btnName: "修改",
                    className: "fn-btn",
                    data: value,
                    callbackParent: this.operatingButton
                }), " ", React.createElement(Pushbutton, {
                    btnName: "删除",
                    className: "fn-btn",
                    data: value
                })))
            }
        });
    module.exports = DataRow
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        DataRow = React.createClass({
            displayName: "DataRow",
            operatingButton: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var formate = "yyyy-MM-dd HH:mm",
                    value = this.props.data;
                return React.createElement("tr", {
                    "data-id": value.id
                }, React.createElement("td", null, value.title), React.createElement("td", null, value.author), React.createElement("td", null, util.formateDate(formate, value.addTime)), React.createElement("td", null, React.createElement(Pushbutton, {
                    btnName: "修改",
                    className: "fn-btn",
                    data: value,
                    callbackParent: this.operatingButton
                }), " ", React.createElement(Pushbutton, {
                    btnName: "删除",
                    className: "fn-btn",
                    data: value
                })))
            }
        });
    module.exports = DataRow
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        DataRow = React.createClass({
            displayName: "DataRow",
            operatingButton: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var formate = "yyyy-MM-dd HH:mm",
                    value = this.props.data;
                return React.createElement("tr", {
                    "data-id": value.id
                }, React.createElement("td", null, value.title), React.createElement("td", null, value.author), React.createElement("td", null, util.formateDate(formate, value.addTime)), React.createElement("td", null, React.createElement(Pushbutton, {
                    btnName: "修改",
                    className: "fn-btn",
                    data: value,
                    callbackParent: this.operatingButton
                }), " ", React.createElement(Pushbutton, {
                    btnName: "删除",
                    className: "fn-btn",
                    data: value
                })))
            }
        });
    module.exports = DataRow
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        DataRow = React.createClass({
            displayName: "DataRow",
            operatingButton: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var formate = "yyyy-MM-dd HH:mm",
                    value = this.props.data;
                return React.createElement("tr", {
                    "data-id": value.id
                }, React.createElement("td", null, value.title), React.createElement("td", null, value.author), React.createElement("td", null, util.formateDate(formate, value.addTime)), React.createElement("td", null, React.createElement(Pushbutton, {
                    btnName: "修改",
                    className: "fn-btn",
                    data: value,
                    callbackParent: this.operatingButton
                }), " ", React.createElement(Pushbutton, {
                    btnName: "删除",
                    className: "fn-btn",
                    data: value
                })))
            }
        });
    module.exports = DataRow
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        DataRow = React.createClass({
            displayName: "DataRow",
            operatingButton: function(data) {
                this.props.callbackParent(data)
            },
            render: function() {
                var formate = "yyyy-MM-dd HH:mm",
                    value = this.props.data;
                return React.createElement("tr", {
                    "data-id": value.id
                }, React.createElement("td", null, value.title), React.createElement("td", null, value.author), React.createElement("td", null, util.formateDate(formate, value.addTime)), React.createElement("td", null, React.createElement(Pushbutton, {
                    btnName: "修改",
                    className: "fn-btn",
                    data: value,
                    callbackParent: this.operatingButton
                }), " ", React.createElement(Pushbutton, {
                    btnName: "删除",
                    className: "fn-btn",
                    data: value
                })))
            }
        });
    module.exports = DataRow
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["common/react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        Pushbutton = React.createClass({
            displayName: "Pushbutton",
            getInitialState: function() {
                return {}
            },
            clickButton: function(e) {
                switch (e.preventDefault(), e.stopPropagation(), this.props.btnName) {
                    case "添加":
                        ConnectActions.add();
                        break;
                    case "修改":
                        this.props.callbackParent(this.props.data);
                        break;
                    case "删除":
                        ListenToActions["delete"](this.props.data);
                        break;
                    default:
                        this.props.callbackParent()
                }
            },
            render: function() {
                return React.createElement("button", {
                    className: this.props.className,
                    onClick: this.clickButton
                }, this.props.btnName)
            }
        });
    module.exports = Pushbutton
});