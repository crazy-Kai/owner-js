"use strict";

define(function (require, exports, module) {
	//依赖
	var util = require('common/util'),
	    React = require('react'),
	    Pushbutton = require('./pushbutton');
	//表单行
	var DataRow = React.createClass({
		displayName: 'DataRow',

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
					React.createElement(Pushbutton, { btnName: '修改', className: 'fn-btn', data: value }),
					' ',
					React.createElement(Pushbutton, { btnName: '删除', className: 'fn-btn', data: value })
				)
			);
		}
	});
	module.exports = DataRow;
});