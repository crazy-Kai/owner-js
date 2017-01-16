"use strict";
define(function(require, exports, module) {

	// 依赖
	var $ = require('$'),
		React = require('react'),
		ReactDOM = require('reactDOM'),
		NewMysuitHead = require('./NewMysuitHead'),
		NewMysuitNav = require('./NewMysuitNav'),
		NewMysuitController = require('./NewMysuitController');

	// 业务主类
	var NewMysuit = React.createClass({
		mixins: [NewMysuitController.Reflux.connect(NewMysuitController.Stroe)],
		// 渲染
		render: function(){
			var me = this,
				state = me.state,
				props = me.props;
			return (
				<div>
					{/*头部*/}
					<NewMysuitHead iframeName="newMysuitIframe" />
					<div className="sc-bodyer sc-FoSiEm12 sc-Co666" ref="body">
						{/*导航*/}
						<NewMysuitNav iframeName="newMysuitIframe" />
						<div className="sc-content">
							<iframe src={state.firstNav} frameBorder="0" width="100%" height="100%" name="newMysuitIframe"></iframe>
						</div>
					</div>
				</div>
			);
		},
		// 挂载
		componentDidMount: function(){
			var me = this;
			// IE8下设置高度
			if(document.documentMode === 8){
				$(me.refs.body).height(document.documentElement.clientHeight - 62);
			};
		}
	});

	var suitContent = $('#suit-content');

	// 置入文档 
	ReactDOM.render(
		<NewMysuit />,
	    suitContent[0]
  	);

});