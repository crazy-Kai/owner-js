"use strict";
define(function(require, exports, module) {

	// 依赖
	var React = require('react'),
		ReactDOM = require('reactDOM'),
		NewMysuitController = require('./NewMysuitController');

	// 业务主类
	var NewMysuitHead = React.createClass({
		mixins: [NewMysuitController.Reflux.connect(NewMysuitController.Stroe)],
		// 初始化状态
		getInitialState: function(){
			var me = this,
				state = {};
			state['showMore'] = false;
			return state;
		},
		// 人名鼠标进入事件
		mouseEnterHandle: function(){
			var me = this;
			me.setState({showMore: true});
		},
		// 人名鼠标出去事件
		mouseLeaveHandle: function(){
			var me = this;
			me.setState({showMore: false});
		},
		render: function(){
			var me = this,
				props = me.props,
				state = me.state;
			return (
				<div className="sc-header sc-FoSiEm12 sc-Co666">
			        <div className="ch-logo sc-left"></div>
			        <div className="ch-title sc-MaTo20 sc-left">{state.head.title}</div>
			        <div className="ch-person sc-MaRi20 sc-MaTo20 sc-right">
			            <a href={state.indexLink} className="sc-link-white">网上法庭首页</a><span className="sc-CoFFF sc-MaLe20 sc-MaRi20">|</span><a href="javascript:;" onMouseEnter={me.mouseEnterHandle} className="sc-link-white">{state.head.person}<i className="ch-icon"></i></a>
			            <ul className={'ch-list' + (state.showMore ? '':' sc-hide')} onMouseEnter={me.mouseEnterHandle} onMouseLeave={me.mouseLeaveHandle}>
			                <li>{state.head.person}<i className="ch-icon"></i></li>
			                {
			                	state.head.personCenterUrl && <li><a 
			                		href={state.head.personCenterUrl} 
			                		onClick={NewMysuitController.Actions.targetNav} 
			                		target={state.iframeName} 
			                		data-key={state.head.personCenterKey}
			                		className="sc-link-lightblack">个人资料</a></li>
			                }
			                <li><a href='javascript:;' className="sc-link-lightblack" onClick={NewMysuitController.Actions.loginOut}>退出系统</a></li>
			            </ul>
			        </div>
			    </div>
		    );
		}
	});

	// 接口
	module.exports = NewMysuitHead;

});