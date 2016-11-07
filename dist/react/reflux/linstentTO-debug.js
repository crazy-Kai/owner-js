"use strict";
define("js/bus/react/reflux/linstentTO-debug", ["common/react-debug", "common/react-dom-debug", "js/bus/react/reflux/listenActions-debug", "common/reflux-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        ReactDOM = require("common/react-dom-debug"),
        Controller = require("js/bus/react/reflux/listenActions-debug"),
        Reflux = require("common/reflux-debug"),
        TableBuild = React.createClass({
            displayName: "TableBuild",
            mixins: [Reflux.listenTo(Controller.Store, "onChanges")],
            getInitialState: function() {
                return {
                    data: []
                }
            },
            onChanges: function(datas) {
                var me = this;
                me.setState({
                    data: datas
                })
            },
            handlefunction: function(e) {
                Controller.Actions.editName(e, ReactDOM.findDOMNode(this.refs.myInput))
            },
            createName: function(e) {
                Controller.Actions.addName(e, ReactDOM.findDOMNode(this.refs.myInput))
            },
            render: function() {
                var self = this;
                return React.createElement("div", {
                    className: "fn-FS16"
                }, React.createElement("div", {
                    width: "100%"
                }, React.createElement("h1", {
                    className: "fn-TAC fn-LH30 fn-FS16 fn-FWB"
                }, "React 基础 练习 ")), React.createElement("table", {
                    className: "fn-table fn-table-text fn-table-border",
                    width: "100%"
                }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
                    width: "300"
                }, "序号"), React.createElement("th", {
                    width: "300"
                }, "名字"), React.createElement("th", null, "操作"))), React.createElement("tbody", null, this.state.data.map(function(v, i) {
                    return React.createElement("tr", {
                        key: i
                    }, React.createElement("td", {
                        width: "300"
                    }, ++i), React.createElement("td", {
                        width: "300"
                    }, v.name), React.createElement("td", null, React.createElement("button", {
                        className: "fn-btn fn-btn-primary fn-MR10",
                        "data-index": i,
                        onClick: self.handlefunction
                    }, "编辑"), React.createElement("button", {
                        className: "fn-btn fn-btn-primary",
                        "data-index": i,
                        onClick: Controller.Actions.deleteName
                    }, "删除")))
                }))), React.createElement("div", {
                    className: "fn-MT20 fn-W300 fn-LH30 fn-MT20 "
                }, React.createElement("input", {
                    ref: "myInput",
                    type: "text",
                    className: "fn-input-text",
                    placeholder: "请输入姓名",
                    maxLength: "20"
                }), React.createElement("button", {
                    className: "fn-btn fn-btn-default fn-LH28",
                    onClick: self.createName
                }, "增加")))
            }
        });
    ReactDOM.render(React.createElement(TableBuild, null), document.getElementById("test"))
});
define("js/bus/react/reflux/listenActions-debug", ["common/reflux-debug"], function(require, exports, module) {
    var Reflux = require("common/reflux-debug"),
        TableActions = Reflux.createActions(["getInit", "deleteName", "addName", "editName"]),
        TableStore = Reflux.createStore({
            listenables: [TableActions],
            store: {
                data: [{
                    name: "wuxiaowen"
                }, {
                    name: "wukai"
                }, {
                    name: "一丙"
                }, {
                    name: "保健"
                }],
                key: ""
            },
            init: function() {
                this.onGetInit()
            },
            onGetInit: function() {
                var me = this;
                window.setTimeout(function() {
                    me.trigger(me.store)
                }, 0)
            },
            onDeleteName: function(event) {
                var self = this,
                    target = $(event.target),
                    index = target.data("index");
                self.store.data.splice(index - 1, 1), self.trigger(self.store)
            },
            onEditName: function(event, myInput) {
                var self = this,
                    index = $(event.target).data("index"),
                    key = index - 1,
                    value = self.store.data[key].name,
                    input = myInput;
                input.value = value, self.store.key = key, input.nextSibling.textContent = "保存", input.focus(), self.trigger(self.store)
            },
            onAddName: function(event, myInput) {
                var self = this,
                    input = myInput,
                    keys = self.store.key,
                    targetName = $(event.target).text();
                "保存" === targetName ? (self.store.data[keys].name = input.value, input.value = "", $(event.target).text("增加")) : "增加" === targetName && (self.store.data.push({
                    name: input.value
                }), input = "", self.trigger(self.store))
            }
        });
    module.exports = {
        Actions: TableActions,
        Store: TableStore,
        Reflux: Reflux
    }
});
define("js/bus/react/reflux/listenActions-debug", ["common/reflux-debug"], function(require, exports, module) {
    var Reflux = require("common/reflux-debug"),
        TableActions = Reflux.createActions(["getInit", "deleteName", "addName", "editName"]),
        TableStore = Reflux.createStore({
            listenables: [TableActions],
            store: {
                data: [{
                    name: "wuxiaowen"
                }, {
                    name: "wukai"
                }, {
                    name: "一丙"
                }, {
                    name: "保健"
                }],
                key: ""
            },
            init: function() {
                this.onGetInit()
            },
            onGetInit: function() {
                var me = this;
                window.setTimeout(function() {
                    me.trigger(me.store)
                }, 0)
            },
            onDeleteName: function(event) {
                var self = this,
                    target = $(event.target),
                    index = target.data("index");
                self.store.data.splice(index - 1, 1), self.trigger(self.store)
            },
            onEditName: function(event, myInput) {
                var self = this,
                    index = $(event.target).data("index"),
                    key = index - 1,
                    value = self.store.data[key].name,
                    input = myInput;
                input.value = value, self.store.key = key, input.nextSibling.textContent = "保存", input.focus(), self.trigger(self.store)
            },
            onAddName: function(event, myInput) {
                var self = this,
                    input = myInput,
                    keys = self.store.key,
                    targetName = $(event.target).text();
                "保存" === targetName ? (self.store.data[keys].name = input.value, input.value = "", $(event.target).text("增加")) : "增加" === targetName && (self.store.data.push({
                    name: input.value
                }), input = "", self.trigger(self.store))
            }
        });
    module.exports = {
        Actions: TableActions,
        Store: TableStore,
        Reflux: Reflux
    }
});
define("js/bus/react/reflux/listenActions-debug", ["common/reflux-debug"], function(require, exports, module) {
    var Reflux = require("common/reflux-debug"),
        TableActions = Reflux.createActions(["getInit", "deleteName", "addName", "editName"]),
        TableStore = Reflux.createStore({
            listenables: [TableActions],
            store: {
                data: [{
                    name: "wuxiaowen"
                }, {
                    name: "wukai"
                }, {
                    name: "一丙"
                }, {
                    name: "保健"
                }],
                key: ""
            },
            init: function() {
                this.onGetInit()
            },
            onGetInit: function() {
                var me = this;
                window.setTimeout(function() {
                    me.trigger(me.store)
                }, 0)
            },
            onDeleteName: function(event) {
                var self = this,
                    target = $(event.target),
                    index = target.data("index");
                self.store.data.splice(index - 1, 1), self.trigger(self.store)
            },
            onEditName: function(event, myInput) {
                var self = this,
                    index = $(event.target).data("index"),
                    key = index - 1,
                    value = self.store.data[key].name,
                    input = myInput;
                input.value = value, self.store.key = key, input.nextSibling.textContent = "保存", input.focus(), self.trigger(self.store)
            },
            onAddName: function(event, myInput) {
                var self = this,
                    input = myInput,
                    keys = self.store.key,
                    targetName = $(event.target).text();
                "保存" === targetName ? (self.store.data[keys].name = input.value, input.value = "", $(event.target).text("增加")) : "增加" === targetName && (self.store.data.push({
                    name: input.value
                }), input = "", self.trigger(self.store))
            }
        });
    module.exports = {
        Actions: TableActions,
        Store: TableStore,
        Reflux: Reflux
    }
});
define("js/bus/react/reflux/listenActions-debug", ["common/reflux-debug"], function(require, exports, module) {
    var Reflux = require("common/reflux-debug"),
        TableActions = Reflux.createActions(["getInit", "deleteName", "addName", "editName"]),
        TableStore = Reflux.createStore({
            listenables: [TableActions],
            store: {
                data: [{
                    name: "wuxiaowen"
                }, {
                    name: "wukai"
                }, {
                    name: "一丙"
                }, {
                    name: "保健"
                }],
                key: ""
            },
            init: function() {
                this.onGetInit()
            },
            onGetInit: function() {
                var me = this;
                window.setTimeout(function() {
                    me.trigger(me.store)
                }, 0)
            },
            onDeleteName: function(event) {
                var self = this,
                    target = $(event.target),
                    index = target.data("index");
                self.store.data.splice(index - 1, 1), self.trigger(self.store)
            },
            onEditName: function(event, myInput) {
                var self = this,
                    index = $(event.target).data("index"),
                    key = index - 1,
                    value = self.store.data[key].name,
                    input = myInput;
                input.value = value, self.store.key = key, input.nextSibling.textContent = "保存", input.focus(), self.trigger(self.store)
            },
            onAddName: function(event, myInput) {
                var self = this,
                    input = myInput,
                    keys = self.store.key,
                    targetName = $(event.target).text();
                "保存" === targetName ? (self.store.data[keys].name = input.value, input.value = "", $(event.target).text("增加")) : "增加" === targetName && (self.store.data.push({
                    name: input.value
                }), input = "", self.trigger(self.store))
            }
        });
    module.exports = {
        Actions: TableActions,
        Store: TableStore,
        Reflux: Reflux
    }
});
define("js/bus/react/reflux/listenActions-debug", ["common/reflux-debug"], function(require, exports, module) {
    var Reflux = require("common/reflux-debug"),
        TableActions = Reflux.createActions(["getInit", "deleteName", "addName", "editName"]),
        TableStore = Reflux.createStore({
            listenables: [TableActions],
            store: {
                data: [{
                    name: "wuxiaowen"
                }, {
                    name: "wukai"
                }, {
                    name: "一丙"
                }, {
                    name: "保健"
                }],
                key: ""
            },
            init: function() {
                this.onGetInit()
            },
            onGetInit: function() {
                var me = this;
                window.setTimeout(function() {
                    me.trigger(me.store)
                }, 0)
            },
            onDeleteName: function(event) {
                var self = this,
                    target = $(event.target),
                    index = target.data("index");
                self.store.data.splice(index - 1, 1), self.trigger(self.store)
            },
            onEditName: function(event, myInput) {
                var self = this,
                    index = $(event.target).data("index"),
                    key = index - 1,
                    value = self.store.data[key].name,
                    input = myInput;
                input.value = value, self.store.key = key, input.nextSibling.textContent = "保存", input.focus(), self.trigger(self.store)
            },
            onAddName: function(event, myInput) {
                var self = this,
                    input = myInput,
                    keys = self.store.key,
                    targetName = $(event.target).text();
                "保存" === targetName ? (self.store.data[keys].name = input.value, input.value = "", $(event.target).text("增加")) : "增加" === targetName && (self.store.data.push({
                    name: input.value
                }), input = "", self.trigger(self.store))
            }
        });
    module.exports = {
        Actions: TableActions,
        Store: TableStore,
        Reflux: Reflux
    }
});