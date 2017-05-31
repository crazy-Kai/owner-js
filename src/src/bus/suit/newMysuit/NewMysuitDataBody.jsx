"use strict";
define(function(require, exports, module) {

	// 依赖
	var React = require('react'),
		ReactDOM = require('reactDOM');

	// 业务主类
	var NewMysuitDataHead = React.createClass({
		render: function(){
			return (
				<div className="sc-MaLe20 sc-MaRi10">
                    <div className="sc-data-body">
                        <h2>提交时间：2015-12-08 14:00 （2015）杭滨知初字第1107号</h2>
                        <table width="100%" className="sc-table sc-table-data sc-table-noborder sc-LiHeEm20">
                            <tbody>
                                <tr>
                                    <td>侵害作品信息网络传播权纠纷</td>
                                    <td width="200">北京天天文化艺术有限公司</td>
                                    <td width="200">杭州三基传媒有限公司</td>
                                    <td width="150">￥840.00 </td>
                                    <td width="150">已立案</td>
                                    <td width="100" align="center">
                                        <input type="button" className="sc-button sc-button-gray sc-button-sm" value="撤 诉" /> <br />
                                        <a href="javascript:;" className="sc-link-blue">被告送达处理</a> <br />
                                        <a href="javascript:;" className="sc-link-blue">法官调档</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
		    );
		}
	});

	// 接口
	module.exports = NewMysuitDataHead;

});