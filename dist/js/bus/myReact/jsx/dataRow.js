"use strict";

define(function (require, exports, module) {
	//依赖
	var util = require('common/util'),
	    React = require('react'),
	    Pushbutton = require('./pushbutton');
	//表单行
	var DataRow = React.createClass({
		displayName: 'DataRow',

		operatingButton: function operatingButton(data) {
			this.props.callbackParent(data);
		},
		render: function render() {
			var formate = "yyyy-MM-dd HH:mm";
			var value = this.props.data;
			console.log(util.formateDate(formate));
			return React.createElement(
				'tr',
				{ 'data-id': value.id },
				React.createElement(
					'td',
					null,
					value.title
				),
				React.createElement(
					'td',
					null,
					value.author
				),
				React.createElement(
					'td',
					null,
					util.formateDate(formate, value.addTime)
				),
				React.createElement(
					'td',
					null,
					React.createElement(Pushbutton, { btnName: '修改', className: 'fn-btn', data: value, callbackParent: this.operatingButton }),
					' ',
					React.createElement(Pushbutton, { btnName: '删除', className: 'fn-btn', data: value })
				)
			);
		}
	});
	module.exports = DataRow;
});
'use strict';

define(function (require, exports, module) {
	"use strict";
	//引用

	var React = require('react'),
	    ConnectActions = require('bus/myReact/controller/connectActions'),
	    ListenToActions = require('bus/myReact/controller/listenToActions');

	var Pushbutton = React.createClass({
		displayName: 'Pushbutton',


		getInitialState: function getInitialState() {
			return {};
		},
		clickButton: function clickButton(e) {
			e.preventDefault();
			e.stopPropagation();

			switch (this.props.btnName) {
				case "添加":
					ConnectActions.add();
					break;
				case "修改":
					this.props.callbackParent(this.props.data);
					break;
				case "删除":
					ListenToActions.delete(this.props.data);
					break;
				default:
					this.props.callbackParent();

			}
		},
		render: function render() {
			return React.createElement(
				'button',
				{ className: this.props.className, onClick: this.clickButton },
				this.props.btnName
			);
		}

	});
	module.exports = Pushbutton;
});
'use strict';

define(function (require, exports, module) {
	"use strict";
	//引用

	var React = require('react'),
	    ConnectActions = require('bus/myReact/controller/connectActions'),
	    ListenToActions = require('bus/myReact/controller/listenToActions');

	var Pushbutton = React.createClass({
		displayName: 'Pushbutton',


		getInitialState: function getInitialState() {
			return {};
		},
		clickButton: function clickButton(e) {
			e.preventDefault();
			e.stopPropagation();

			switch (this.props.btnName) {
				case "添加":
					ConnectActions.add();
					break;
				case "修改":
					this.props.callbackParent(this.props.data);
					break;
				case "删除":
					ListenToActions.delete(this.props.data);
					break;
				default:
					this.props.callbackParent();

			}
		},
		render: function render() {
			return React.createElement(
				'button',
				{ className: this.props.className, onClick: this.clickButton },
				this.props.btnName
			);
		}

	});
	module.exports = Pushbutton;
});