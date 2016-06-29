"use strict";
/**
 * 模型
 */
define(function(require, exports, module) {

	// 依赖
	const React = require('react');
	const Actions = require('./controller').Actions;

	class View extends React.Component {
		render(){ 
			var me = this,
				props = me.props;
			return (
				<div>
					{props.a} {props.b} <a href="javascript:;" onClick={Actions.add}>点击</a>
				</div>
			);
		}
	};

	return View;

});