'use strict';

define(function (require, exports, module) {
	//依赖
	var React = require('react'),
	    Pushbutton = require('./pushbutton'),
	    util = require('common/util'),
	    ListenToActions = require('github/bus/myReact/controller/listenToActions');

	var ContentBox = React.createClass({
		displayName: 'ContentBox',

		getInitialState: function getInitialState() {
			return { id: null, title: '', author: '' };
		},
		clicKaffirmButton: function clicKaffirmButton() {
			var newData, showBox;
			if (!this.refs.title.value) {
				showBox = "block";
				window.alert("标题不能为空");
			} else {

				showBox = "none";
				newData = {
					id: this.state.id,
					title: this.refs.title.value,
					author: this.refs.author.value,
					description: "none",
					addTime: util.formateDate('yyyy-MM-dd HH:mm')
				};
				ListenToActions.dataChange(newData);
			}
			this.reset();
			this.props.callbackParent(showBox);
		},
		reset: function reset() {
			this.setState({
				title: "",
				author: ""
			});
		},
		clickCancel: function clickCancel() {
			this.reset();
			this.props.callbackParent("none");
		},
		changeHandler: function changeHandler(e) {
			var obj = {};
			obj[$(e.target).attr('name')] = e.target.value;
			this.setState(obj);
		},

		render: function render() {
			var me = this;
			return React.createElement(
				'table',
				{ className: 'fn-table fn-table-border' },
				React.createElement(
					'tbody',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ width: '250' },
							React.createElement(
								'div',
								{ className: 'fn-MB5' },
								React.createElement(
									'span',
									{ className: 'fn-MR5' },
									'标题'
								),
								React.createElement(
									'span',
									null,
									React.createElement('input', { className: 'fn-input-text fn-input-text-sm fn-W180', ref: 'title', name: 'title', type: 'text', value: me.state.title, onChange: me.changeHandler })
								)
							),
							React.createElement(
								'div',
								null,
								React.createElement(
									'span',
									{ className: 'fn-MR5' },
									'作者'
								),
								React.createElement(
									'span',
									null,
									React.createElement('input', { className: 'fn-input-text fn-input-text-sm fn-W180 ', ref: 'author', name: 'author', type: 'text', value: me.state.author, onChange: me.changeHandler })
								)
							)
						),
						React.createElement(
							'td',
							{ width: '250' },
							React.createElement(
								'div',
								{ className: 'fn-TAC' },
								React.createElement(Pushbutton, { className: 'fn-btn fn-MR5', btnName: '确认', callbackParent: me.clicKaffirmButton }),
								React.createElement(Pushbutton, { className: 'fn-btn', btnName: '取消', callbackParent: me.clickCancel })
							)
						)
					)
				)
			);
		}
	});

	return ContentBox;
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