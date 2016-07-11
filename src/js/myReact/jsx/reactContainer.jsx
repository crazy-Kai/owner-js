define(function(require,exports,module){
	"use strict"
	//依赖
	var React = require('react'),
		ReactDOM = require('reactDOM'),
		Reflux = require('reflux'),
		Pushbutton = require('./pushbutton'),
		ContentBox = require('./contentBox'),
		DataTable = require('./dataTable'),
		//用reflux.connect方法来传递数据
		ConnectActions = require('myReact/controller/connectActions'),
		ConnectStore = require('myReact/controller/connectStore');
	var Container = React.createClass({
		getInitialState:function(){
			return {
				boxBtnType:"add",
				boxStyle : false
			}
		},
		render:function(){
			var textList = [],
			    me = this;
			return (
				<div className="fn-TAC" style={{backgroundColor:"#FFF"}}>
                	{[1,2,3,4].forEach(function(val,key){
                		textList.push(<button key ={key} onClick = {ConnectActions.getTarget}>target{val}</button>)
                	})}
                	<div className=" fn-LH30">
                		 测试用Actions里的方法来获取e.target
                		 {textList}
                		 +++++++++++++
                	</div>
                	<div calssName="fn-MT20">
                		<h1 className="fn-FS16 fn-FWB">
                		　React 结合Reflux  增删增删改查Demo
                		</h1>
                		
                	</div>
                	
				</div>	


				)
		}
	})	
	module.exports = Container;
})