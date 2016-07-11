define(function(require,exports,module){
	//依赖
	var React = require('react');

	var ContentBox = React.createClass({
		 getInitialState: function() { 
            return { id: null, title: '', author: ''};
        }, 
		render:function(){

			return (
				<div>
					<ul>
						<li>
							<span>标题</span>
							<span> <input ref="title" name="title" type="text" value={this.state.title} /> </span>
						</li>
						<li>
							<span>作者</span>
							<span> <input ref="author" name="author" type="text" value={this.state.author} /> </span>
						</li>
					</ul>

				</div>
			)
		}
	})
	
	return ContentBox;
})