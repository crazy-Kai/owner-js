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
		mixins: [Reflux.connect(ConnectStore)],
		getInitialState:function(){
			return {
				boxBtnType:"add",
				boxStyle : {
					display:"none"
				}
			}
		},
		
		render:function(){
			var textList = [],
			    me = this;
			return (
				<div className=" fn-W500 fn-margin-center" >
                	{[1,2,3,4].forEach(function(val,key){
                		textList.push(<button key ={key} onClick = {ConnectActions.getTarget}>target{val}</button>)
                	})}
                	<div className=" fn-LH30 fn-TAC">
                		 测试用Actions里的方法来获取e.target
                		 {textList}
                		 +++++++++++++
                	</div>
                	<div className="fn-TAC fn-MT20 ">
                		<h1 className="fn-TAC fn-FS16 fn-FWB fn-disInBl">
                		　React 结合Reflux  增删增删改查Demo
                		</h1>
                		< Pushbutton ref='addBtn' btnName="添加"  className="fn-btn"/>
                		
                	</div>
                	<div className="fn-MT20 fn-MB20 " style= {this.state.boxStyle}>
                		< ContentBox ref="contentBox" />
                	</div>
                	<div className="fn-MT20">
                		<DataTable ref="dataTable" />
                	</div>
				</div>	


				)
		}
	})	
	module.exports = Container;
})