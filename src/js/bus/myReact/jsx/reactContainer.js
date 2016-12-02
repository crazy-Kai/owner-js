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
		//在组件构建之前，接收后端AJAX的请求的数据
		// componentWillMount:function(){
		// 	var me = this;
		// 	ConnectActions.getData().then(function(rtv){
		// 		me.setState({data:rtv})
		// 	})
		// },
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
			console.log(this.state.data);
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