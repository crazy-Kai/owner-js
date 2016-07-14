"use strict";
define(function(require,exports,module){
	//依赖
	var util = require('common/util'),
		React = require('react'),
		Pushbutton = require('./pushbutton');
	//表单行
	var DataRow = React.createClass({
		operatingButton:function(data){
			this.props.callbackParent(data);
		 },
		render:function(){
			var formate = "yyyy-MM-dd HH:mm" ;
			var value = this.props.data;
			console.log(util.formateDate(formate))
			  return (
                <tr data-id={value.id}>
                      <td>{value.title}</td>
                      <td>{value.author}</td>
                      <td>{util.formateDate(formate,value.addTime)}</td>
                      <td>
                          <Pushbutton btnName="修改" className="fn-btn" data={value} callbackParent = {this.operatingButton}/>
                          &nbsp;
                          <Pushbutton btnName="删除" className="fn-btn" data={value} />
                      </td>
                </tr>
            )
		}
	})	
	module.exports = DataRow ;
})