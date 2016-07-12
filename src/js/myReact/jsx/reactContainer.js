'use strict';

define(function (require, exports, module) {
	"use strict";
	//依赖

	var React = require('react'),
	    ReactDOM = require('reactDOM'),
	    Reflux = require('reflux'),
	    Pushbutton = require('./pushbutton'),
	    ContentBox = require('./contentBox'),
	    DataTable = require('./dataTable'),

	//用reflux.connect方法来传递数据
	ConnectActions = require('myReact/controller/connectActions'),
	    ConnectStore = require('myReact/controller/connectStore');
	var Container = React.createClass({
		displayName: 'Container',

		mixins: [Reflux.connect(ConnectStore)],
		getInitialState: function getInitialState() {
			return {
				boxBtnType: "add",
				boxStyle: {
					display: "none"
				}
			};
		},
		addItem: function addItem() {
			console.log("1");
			ConnectActions.add();
			this.refs.contentBox.setState({ id: null });
		},
		render: function render() {
			var textList = [],
			    me = this;
			return React.createElement(
				'div',
				{ className: ' fn-W500 fn-margin-center' },
				[1, 2, 3, 4].forEach(function (val, key) {
					textList.push(React.createElement(
						'button',
						{ key: key, onClick: ConnectActions.getTarget },
						'target',
						val
					));
				}),
				React.createElement(
					'div',
					{ className: ' fn-LH30 fn-TAC' },
					'测试用Actions里的方法来获取e.target',
					textList,
					'+++++++++++++'
				),
				React.createElement(
					'div',
					{ className: 'fn-TAC fn-MT20 ' },
					React.createElement(
						'h1',
						{ className: 'fn-TAC fn-FS16 fn-FWB fn-disInBl' },
						'　React 结合Reflux  增删增删改查Demo'
					),
					React.createElement(Pushbutton, { ref: 'addBtn', btnName: '添加', callbackParent: this.addItem, className: 'fn-btn' })
				),
				React.createElement(
					'div',
					{ className: 'fn-MT20 fn-MB20 ', style: this.state.boxStyle },
					React.createElement(ContentBox, { ref: 'contentBox' })
				),
				React.createElement(
					'div',
					{ className: 'fn-MT20' },
					React.createElement(DataTable, { ref: 'dataTable' })
				)
			);
		}
	});
	module.exports = Container;
});