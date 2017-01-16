"use strict";

define(function (require, exports, module) {

	// 依赖
	var React = require('react'),
	    ReactDOM = require('reactDOM'),
	    ReactForm = require('');

	// 业务主类
	var NewMysuitFilter = React.createClass({
		displayName: 'NewMysuitFilter',

		render: function render() {
			return React.createElement(
				'div',
				{ className: 'sc-filter sc-MaTo30 sc-MaLe20 sc-LiHeEm25' },
				'关键词',
				React.createElement('input', { type: 'text', className: 'sc-input sc-MaLe10 sc-MaRi10' }),
				React.createElement(
					'a',
					{ href: 'javscript:;', className: 'sc-link-blue' },
					'高级查询',
					React.createElement('i', { className: 'ch-icon sc-MaLe5' })
				)
			);
		}
	});

	// 接口
	module.exports = NewMysuitFilter;
});