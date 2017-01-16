"use strict";
define(function(require, exports, module) {

	// 依赖
	var React = require('react'),
		ReactDOM = require('reactDOM');

	// 业务主类
	var NewMysuitDataHead = React.createClass({
		render: function(){
			return (
				<div className="sc-data-head sc-MaTo20 sc-MaLe20 sc-MaRi10 sc-LiHe25">
                    <table width="100%" className="sc-table sc-table-data sc-table-noborder">
                        <thead>
                            <tr>
                                <td>案由</td>
                                <td width="200">原告</td>
                                <td width="200">被告</td>
                                <td width="150">标的金额</td>
                                <td width="150">诉讼状态</td>
                                <td width="100" align="center">操作</td>
                            </tr>
                        </thead>
                    </table>
                </div>
		    );
		}
	});

	// 接口
	module.exports = NewMysuitDataHead;

});