"use strict";

define(function (require, exports, module) {

	// 依赖
	var React = require('react'),
	    ReactDOM = require('reactDOM'),
	    limit = require('common/limit'),
	    NewMysuitController = require('./NewMysuitController');

	// 业务主类
	var NewMysuitNav = React.createClass({
		displayName: 'NewMysuitNav',

		mixins: [NewMysuitController.Reflux.connect(NewMysuitController.Stroe)],
		render: function render() {
			var me = this,
			    state = me.state,
			    props = me.props,
			    propsNavMap = state.navMap,
			    propsNav = state.nav;
			// 格式化数据
			return React.createElement(
				'div',
				{ className: 'sc-nav sc-left' },
				React.createElement(
					'dl',
					{ className: 'sc-MaTo10' },
					limit.map(propsNav, function (val, index) {
						return limit.map(val, function (val, key) {
							return !key ? React.createElement(
								'dt',
								{ key: key },
								propsNavMap[val.key]
							) : React.createElement(
								'dd',
								{ key: key },
								React.createElement(
									'a',
									{ target: val.isForward === 'true' ? '_blank' : state.iframeName,
										ref: !index && key === 1 ? 'first' : null,
										href: val.val,
										onClick: NewMysuitController.Actions.targetNav,
										className: state && state.navKey === val.key ? "ch-active" : '',
										'data-key': val.key },
									propsNavMap[val.key]
								)
							);
						});
					})
				)
			);
		},
		componentDidMount: function componentDidMount() {
			var me = this;
			// 触发第一个按钮
			// DOM渲染需要时间，这里有个时间差
			// limit.defer(function(){
			// 	me.refs.first && me.refs.first.click();
			// });
		}

	});

	// 接口
	module.exports = NewMysuitNav;
});

/** 原始结构
	<dt>待立案</dt>
	<dd><a href="" name="">立案审批</a></dd>
	<dt>已立案</dt>
	<dd><a href="">代缴费</a></dd>
	<dd><a href="">已缴费</a></dd>
	<dd><a href="">电子送达</a></dd>
*/