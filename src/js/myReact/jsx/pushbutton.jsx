define(function(require,exports,module){
	"use strict"
	//引用
	var React = require('react');
	var Pushbutton = React.createClass({
		getInitialState:function(){
			return {}
		},
		clickButton:function(e){
             
             console.log(this.props.btnName)
             switch(this.props.btnName){
             	case "添加":
             	this.props.callbackParent();
             	break;
             }
		},
		render:function(){
			return(
				<button className = {this.props.className} onClick ={this.clickButton}>{this.props.btnName}</button>
			)
		}

	})
    module.exports = Pushbutton;
})