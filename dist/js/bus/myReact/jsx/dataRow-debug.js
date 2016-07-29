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