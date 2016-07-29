"use strict";
define(function(require,exports,module){
	//依赖
	var React = require('react'),
		Reflux = require('reflux'),
		Pushbutton = require('./pushbutton'),
		DataRow = require('./dataRow'),
		ListenToActions = require('bus/myReact/controller/listenToActions'),
		ListenToStore = require('bus/myReact/controller/listenToStore');
	var DataTable = React.createClass({
		mixins: [Reflux.listenTo(ListenToStore,'onChange')],

		getInitialState:function(){
			return {
				data:[]
			}
		},
		// 监听时间
		onChange:function(data,fn){
			var sourceData = this.state.data;
			console.log(data)
			switch(data.type){
				case "init":
				this.setState({data:data.value});
				break;
				case "add":
				sourceData.push(data.value);
				this.setState({data:sourceData});
				break;
				case "modify":
				var newData = sourceData.map(function(val){
					if(val.id == data.value.id){
						val = data.value;
					}
					return val;
				});
				this.setState({data:newData});
				break;
				case "delete":
				var index = sourceData.indexOf(data.value);
				//相当于一个开关只有index不为负一的时候要做的操作
				index != -1 && sourceData.splice(index,1);
				this.setState({data:sourceData});
				break;
			}
		},
		switchOperating:function(data){
				this.props.callbackParent(data);
		},
		render:function(){
			var list = [],
				a=[1,2,3];
			this.state.data.map(function(val,i){
				list.push(<DataRow key= {i} data={val} callbackParent={this.switchOperating}/>)
			}.bind(this))
		
			return (
				<table className="fn-tabale fn-table-data" width="100%">
					<thead>
						<tr>
							<th width="100">标题</th>
							<th width="100">作者</th>
							<th width="150">发布时间</th>
							<th width="150">操作</th>
						</tr>
					</thead>
					<tbody>
						{list}
					</tbody>
				</table>
			)
		}

	})
	module.exports = DataTable;
})