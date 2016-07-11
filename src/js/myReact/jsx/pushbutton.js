"use strict";

define(function (require, exports, module) {
	"use strict";
	//引用

	var React = require('react');
	var Pushbutton = React.createClass({
		displayName: "Pushbutton",

		getInitialState: function getInitialState() {
			return {};
		},
		clickButton: function clickButton(e) {

			console.log(this.props.btnName);
			switch (this.props.btnName) {
				case "添加":
					this.props.callbackParent();
					break;
			}
		},
		render: function render() {
			return React.createElement(
				"button",
				{ className: this.props.className, onClick: this.clickButton },
				this.props.btnName
			);
		}

	});
	module.exports = Pushbutton;
});