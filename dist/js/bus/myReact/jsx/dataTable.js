"use strict";

define(function (require, exports, module) {
	//依赖
	var React = require('react'),
	    Reflux = require('reflux'),
	    Pushbutton = require('./pushbutton'),
	    DataRow = require('./dataRow'),
	    ListenToActions = require('bus/myReact/controller/listenToActions'),
	    ListenToStore = require('bus/myReact/controller/listenToStore');
	var DataTable = React.createClass({
		displayName: 'DataTable',

		mixins: [Reflux.listenTo(ListenToStore, 'onChange')],

		getInitialState: function getInitialState() {
			return {
				data: []
			};
		},
		// 监听时间
		onChange: function onChange(data, fn) {
			var sourceData = this.state.data;
			console.log(data);
			switch (data.type) {
				case "init":
					this.setState({ data: data.value });
					break;
				case "add":
					sourceData.push(data.value);
					this.setState({ data: sourceData });
					break;
				case "modify":
					var newData = sourceData.map(function (val) {
						if (val.id == data.value.id) {
							val = data.value;
						}
						return val;
					});
					this.setState({ data: newData });
					break;
				case "delete":
					var index = sourceData.indexOf(data.value);
					//相当于一个开关只有index不为负一的时候要做的操作
					index != -1 && sourceData.splice(index, 1);
					this.setState({ data: sourceData });
					break;
			}
		},
		switchOperating: function switchOperating(data) {
			this.props.callbackParent(data);
		},
		render: function render() {
			var list = [],
			    a = [1, 2, 3];
			this.state.data.map(function (val, i) {
				list.push(React.createElement(DataRow, { key: i, data: val, callbackParent: this.switchOperating }));
			}.bind(this));

			return React.createElement(
				'table',
				{ className: 'fn-tabale fn-table-data', width: '100%' },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'th',
							{ width: '100' },
							'标题'
						),
						React.createElement(
							'th',
							{ width: '100' },
							'作者'
						),
						React.createElement(
							'th',
							{ width: '150' },
							'发布时间'
						),
						React.createElement(
							'th',
							{ width: '150' },
							'操作'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					list
				)
			);
		}

	});
	module.exports = DataTable;
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