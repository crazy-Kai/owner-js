"use strict";
define("js/bus/myReact/jsx/reactContainer-debug", ["react-debug", "reactDOM-debug", "reflux-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug", "js/bus/myReact/jsx/contentBox-debug", "common/util-debug", "js/bus/myReact/jsx/dataTable-debug", "js/bus/myReact/jsx/dataRow-debug", "bus/myReact/controller/listenToStore-debug", "bus/myReact/controller/connectStore-debug"], function(require, exports, module) {
    var React = require("react-debug"),
        Reflux = (require("reactDOM-debug"), require("reflux-debug")),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        ContentBox = require("js/bus/myReact/jsx/contentBox-debug"),
        DataTable = require("js/bus/myReact/jsx/dataTable-debug"),
        ConnectActions = require("bus/myReact/controller/connectActions-debug"),
        ConnectStore = require("bus/myReact/controller/connectStore-debug"),
        Container = React.createClass({
            displayName: "Container",
            mixins: [Reflux.connect(ConnectStore)],
            getInitialState: function() {
                return {
                    boxBtnType: "add",
                    boxStyle: {
                        display: "none"
                    }
                }
            },
            switchBox: function(show) {
                var me = this;
                me.setState({
                    boxStyle: {
                        display: show
                    }
                }), ConnectStore.isShow = "none" !== show
            },
            onModify: function(data) {
                var me = this;
                me.refs.contentBox.setState({
                    id: data.id,
                    title: data.title,
                    author: data.author
                }), me.setState({
                    boxStyle: {
                        display: "block"
                    }
                }), ConnectStore.isShow = !0
            },
            render: function() {
                var textList = [],
                    me = this;
                return [1, 2, 3, 4].forEach(function(val, key) {
                    textList.push(React.createElement("button", {
                        key: key,
                        onClick: ConnectActions.getTarget
                    }, "target", val))
                }), React.createElement("div", {
                    className: " fn-W500 fn-margin-center"
                }, React.createElement("div", {
                    className: " fn-LH30 fn-TAC"
                }, "测试用Actions里的方法来获取e.target", textList, "+++++++++++++"), React.createElement("div", {
                    className: "fn-TAC fn-MT20 "
                }, React.createElement("h1", {
                    className: "fn-TAC fn-FS16 fn-FWB fn-disInBl"
                }, "　React 结合Reflux  增删增删改查Demo"), React.createElement(Pushbutton, {
                    ref: "addBtn",
                    btnName: "添加",
                    className: "fn-btn"
                })), React.createElement("div", {
                    className: "fn-MT20 fn-MB20 ",
                    style: me.state.boxStyle
                }, React.createElement(ContentBox, {
                    ref: "contentBox",
                    callbackParent: me.switchBox
                })), React.createElement("div", {
                    className: "fn-MT20"
                }, React.createElement(DataTable, {
                    ref: "dataTable",
                    callbackParent: me.onModify
                })))
            }
        });
    module.exports = Container
});
"use strict";
define("js/bus/myReact/jsx/pushbutton-debug", ["react-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("react-debug"),
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
define("js/bus/myReact/jsx/contentBox-debug", ["react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug", "common/util-debug"], function(require, exports, module) {
    var React = require("react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        util = require("common/util-debug"),
        ListenToActions = require("bus/myReact/controller/listenToActions-debug"),
        ContentBox = React.createClass({
            displayName: "ContentBox",
            getInitialState: function() {
                return {
                    id: null,
                    title: "",
                    author: ""
                }
            },
            clicKaffirmButton: function() {
                var newData, showBox;
                this.refs.title.value ? (showBox = "none", newData = {
                    id: this.state.id,
                    title: this.refs.title.value,
                    author: this.refs.author.value,
                    description: "none",
                    addTime: util.formateDate("yyyy-MM-dd HH:mm")
                }, ListenToActions.dataChange(newData)) : (showBox = "block", window.alert("标题不能为空")), this.reset(), this.props.callbackParent(showBox)
            },
            reset: function() {
                this.setState({
                    title: "",
                    author: ""
                })
            },
            clickCancel: function() {
                this.reset(), this.props.callbackParent("none")
            },
            changeHandler: function(e) {
                var obj = {};
                obj[$(e.target).attr("name")] = e.target.value, this.setState(obj)
            },
            render: function() {
                var me = this;
                return React.createElement("table", {
                    className: "fn-table fn-table-border"
                }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
                    width: "250"
                }, React.createElement("div", {
                    className: "fn-MB5"
                }, React.createElement("span", {
                    className: "fn-MR5"
                }, "标题"), React.createElement("span", null, React.createElement("input", {
                    className: "fn-input-text fn-input-text-sm fn-W180",
                    ref: "title",
                    name: "title",
                    type: "text",
                    value: me.state.title,
                    onChange: me.changeHandler
                }))), React.createElement("div", null, React.createElement("span", {
                    className: "fn-MR5"
                }, "作者"), React.createElement("span", null, React.createElement("input", {
                    className: "fn-input-text fn-input-text-sm fn-W180 ",
                    ref: "author",
                    name: "author",
                    type: "text",
                    value: me.state.author,
                    onChange: me.changeHandler
                })))), React.createElement("td", {
                    width: "250"
                }, React.createElement("div", {
                    className: "fn-TAC"
                }, React.createElement(Pushbutton, {
                    className: "fn-btn fn-MR5",
                    btnName: "确认",
                    callbackParent: me.clicKaffirmButton
                }), React.createElement(Pushbutton, {
                    className: "fn-btn",
                    btnName: "取消",
                    callbackParent: me.clickCancel
                }))))))
            }
        });
    return ContentBox
});
"use strict";
define("js/bus/myReact/jsx/dataTable-debug", ["react-debug", "reflux-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug", "js/bus/myReact/jsx/dataRow-debug", "common/util-debug", "bus/myReact/controller/listenToStore-debug"], function(require, exports, module) {
    var React = require("react-debug"),
        Reflux = require("reflux-debug"),
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
define("js/bus/myReact/jsx/dataRow-debug", ["common/util-debug", "react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var util = require("common/util-debug"),
        React = require("react-debug"),
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