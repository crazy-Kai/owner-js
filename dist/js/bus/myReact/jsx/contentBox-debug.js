"use strict";
define("js/bus/myReact/jsx/contentBox-debug", ["common/react-debug", "js/bus/myReact/jsx/pushbutton-debug", "bus/myReact/controller/connectActions-debug", "bus/myReact/controller/listenToActions-debug", "common/util-debug", "github/bus/myReact/controller/listenToActions-debug"], function(require, exports, module) {
    var React = require("common/react-debug"),
        Pushbutton = require("js/bus/myReact/jsx/pushbutton-debug"),
        util = require("common/util-debug"),
        ListenToActions = require("github/bus/myReact/controller/listenToActions-debug"),
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