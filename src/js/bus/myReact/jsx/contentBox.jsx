define(function(require,exports,module){
	//依赖
	var React = require('react'),
		Pushbutton = require('./pushbutton'),
		util = require('common/util'),
		ListenToActions = require('bus/myReact/controller/listenToActions');
	

	var ContentBox = React.createClass({
		 getInitialState: function() { 
            return { id: null, title: '', author: ''};
        }, 
        clicKaffirmButton:function(){
        	var newData,showBox;
        	if(!this.refs.title.value ){
        		showBox = "block";
        		window.alert("标题不能为空")
        	}else{
        		
        		showBox = "none";
        		newData = {
        			id:this.state.id,
        			title:this.refs.title.value,
        			author:this.refs.author.value,
        			description:"none",
        			addTime:util.formateDate('yyyy-MM-dd HH:mm')
        		};
        		console.log(ListenToActions.dataChange)
        		ListenToActions.dataChange(newData)
        	}
        	this.reset();
        	this.props.callbackParent(showBox)
        },
        reset:function(){
        	this.setState({
        		title:"",
        		author:""
        	})
        
        },
        clickCancel:function(){
        	this.reset();
        	this.props.callbackParent("none")
        },
        changeHandler: function(e){
            var obj = {};
            obj[$(e.target).attr('name')] = e.target.value;
            this.setState(obj);
        },

		render:function(){
			var me = this;
			return (
					<table className="fn-table fn-table-border">
						<tbody>
							<tr>
								<td width="250">
									<div className="fn-MB5">
										<span className="fn-MR5">标题</span>
										<span> 
											<input className="fn-input-text fn-input-text-sm fn-W180" ref="title" name="title" type="text" value={me.state.title} onChange={me.changeHandler}/> 
										</span>
									</div>
									<div>
										<span className="fn-MR5">作者</span>
										<span>
											 <input className="fn-input-text fn-input-text-sm fn-W180 " ref="author" name="author" type="text" value={me.state.author} onChange={me.changeHandler}/> 
										</span>	
									</div>
								</td>
								<td width="250">
									<div className="fn-TAC">
										<Pushbutton className="fn-btn fn-MR5" btnName="确认" callbackParent={me.clicKaffirmButton}/>
										<Pushbutton className="fn-btn" btnName="取消"  callbackParent={me.clickCancel}/>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					

				
			)
		}
	})
	
	return ContentBox;
})