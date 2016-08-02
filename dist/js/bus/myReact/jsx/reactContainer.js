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
	ConnectActions = require('bus/myReact/controller/connectActions'),
	    ConnectStore = require('bus/myReact/controller/connectStore');
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
		switchBox: function switchBox(show) {
			var me = this;
			me.setState({
				boxStyle: {
					display: show
				}
			});

			ConnectStore.isShow = show === "none" ? false : true;
		},
		onModify: function onModify(data) {
			var me = this;
			me.refs.contentBox.setState({
				id: data.id,
				title: data.title,
				author: data.author
			});
			me.setState({
				boxStyle: {
					display: "block"
				}
			});
			ConnectStore.isShow = true;
		},
		render: function render() {
			var textList = [],
			    me = this;
			[1, 2, 3, 4].forEach(function (val, key) {
				textList.push(React.createElement(
					'button',
					{ key: key, onClick: ConnectActions.getTarget },
					'target',
					val
				));
			});

			return React.createElement(
				'div',
				{ className: ' fn-W500 fn-margin-center' },
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
					React.createElement(Pushbutton, { ref: 'addBtn', btnName: '添加', className: 'fn-btn' })
				),
				React.createElement(
					'div',
					{ className: 'fn-MT20 fn-MB20 ', style: me.state.boxStyle },
					React.createElement(ContentBox, { ref: 'contentBox', callbackParent: me.switchBox })
				),
				React.createElement(
					'div',
					{ className: 'fn-MT20' },
					React.createElement(DataTable, { ref: 'dataTable', callbackParent: me.onModify })
				)
			);
		}
	});
	module.exports = Container;
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