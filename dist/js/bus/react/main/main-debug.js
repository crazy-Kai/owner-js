"use strict";
define("js/bus/react/main/main-debug", ["react-debug", "reactDOM-debug"], function(require, exports, module) {
    var React = require("react-debug"),
        ReactDOM = require("reactDOM-debug"),
        data = [{
            name: "wuxiaowen"
        }, {
            name: "wukai"
        }, {
            name: "zp"
        }, {
            name: "zl"
        }],
        TableBuild = React.createClass({
            displayName: "TableBuild",
            getInitialState: function() {
                return {
                    data: this.props.data,
                    key: ""
                }
            },
            getDefualtProps: function() {
                return {
                    data: []
                }
            },
            deleteName: function(e) {
                var self = this,
                    index = $(e.target).attr("data-index"),
                    data = self.state.data;
                data.splice(index - 1, 1), self.setState({
                    data: data
                })
            },
            editName: function(e) {
                var index = $(e.target).attr("data-index"),
                    keys = index - 1,
                    self = this,
                    input = ReactDOM.findDOMNode(self.refs.myInput);
                input.value = self.state.data[keys].name, input.nextSibling.textContent = "保存", input.focus(), self.setState({
                    key: keys
                })
            },
            addName: function(e) {
                var textName = e.target.textContent,
                    self = this,
                    data = self.state.data,
                    key = self.state.key,
                    input = ReactDOM.findDOMNode(self.refs.myInput);
                "保存" === textName && (data[key].name = input.value, self.setState({
                    data: data
                }), input.value = "", e.target.textContent = "增加"), "增加" === textName && (data.push({
                    name: input.value
                }), self.setState({
                    data: data
                }), input.value = "")
            },
            render: function() {
                var self = this,
                    arr = [];
                return this.state.data.map(function(v, i) {
                    arr.push(React.createElement("tr", {
                        key: i
                    }, React.createElement("td", {
                        width: "300"
                    }, ++i), React.createElement("td", {
                        width: "300"
                    }, v.name), React.createElement("td", null, React.createElement("button", {
                        className: "fn-btn fn-btn-primary fn-MR10",
                        "data-index": i,
                        onClick: self.editName
                    }, "编辑"), React.createElement("button", {
                        className: "fn-btn fn-btn-primary",
                        "data-index": i,
                        onClick: self.deleteName
                    }, "删除"))))
                }.bind(this)), React.createElement("div", {
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
                }, "名字"), React.createElement("th", null, "操作"))), React.createElement("tbody", null, arr)), React.createElement("div", {
                    className: "fn-MT20 fn-W300 fn-LH30 fn-MT20 "
                }, React.createElement("input", {
                    ref: "myInput",
                    type: "text",
                    className: "fn-input-text",
                    placeholder: "请输入姓名",
                    maxLength: "20"
                }), React.createElement("button", {
                    className: "fn-btn fn-btn-default fn-LH28",
                    onClick: self.addName
                }, "增加")))
            }
        });
    ReactDOM.render(React.createElement(TableBuild, {
        data: data
    }), document.getElementById("test"))
});