define(function(require,exports,module){
	//依赖
	var React = require('react'),
		Pushbutton = require('./pushbutton');

	var ContentBox = React.createClass({
		 getInitialState: function() { 
            return { id: null, title: '', author: ''};
        }, 
		render:function(){

			return (
					<table className="fn-table fn-table-border">
						<tbody>
							<tr>
								<td width="250">
									<div className="fn-MB5">
										<span className="fn-MR5">标题</span>
										<span> 
											<input className="fn-input-text fn-input-text-sm fn-W180" ref="title" name="title" type="text" value={this.state.title} /> 
										</span>
									</div>
									<div>
										<span className="fn-MR5">作者</span>
										<span>
											 <input className="fn-input-text fn-input-text-sm fn-W180 " ref="author" name="author" type="text" value={this.state.author} /> 
										</span>	
									</div>
								</td>
								<td width="250">
									<div className="fn-TAC">
										<Pushbutton className="fn-btn fn-MR5" btnName="确认" />
										<Pushbutton className="fn-btn" btnName="取消" />
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