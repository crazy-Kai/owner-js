"use strict";
define(function(require, exports, module) {

	// 依赖
	var React = require('react'),
		ReactDOM = require('reactDOM'),
		ReactForm = require('');

	// 业务主类
	var NewMysuitFilter = React.createClass({
		render: function(){
			return (
				<div className="sc-filter sc-MaTo30 sc-MaLe20 sc-LiHeEm25">
                    关键词<input type="text" className="sc-input sc-MaLe10 sc-MaRi10" /><a href="javscript:;" className="sc-link-blue">高级查询<i className="ch-icon sc-MaLe5"></i></a>
                </div>
		    );
		}
	});

	// 接口
	module.exports = NewMysuitFilter;

});