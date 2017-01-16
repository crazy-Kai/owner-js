"use strict";

define(function (require, exports, module) {

    // 依赖
    var React = require('react'),
        ReactDOM = require('reactDOM');

    // 业务主类
    var NewMysuitDataHead = React.createClass({
        displayName: 'NewMysuitDataHead',

        render: function render() {
            return React.createElement(
                'div',
                { className: 'sc-MaLe20 sc-MaRi10' },
                React.createElement(
                    'div',
                    { className: 'sc-data-body' },
                    React.createElement(
                        'h2',
                        null,
                        '提交时间：2015-12-08 14:00 （2015）杭滨知初字第1107号'
                    ),
                    React.createElement(
                        'table',
                        { width: '100%', className: 'sc-table sc-table-data sc-table-noborder sc-LiHeEm20' },
                        React.createElement(
                            'tbody',
                            null,
                            React.createElement(
                                'tr',
                                null,
                                React.createElement(
                                    'td',
                                    null,
                                    '侵害作品信息网络传播权纠纷'
                                ),
                                React.createElement(
                                    'td',
                                    { width: '200' },
                                    '北京天天文化艺术有限公司'
                                ),
                                React.createElement(
                                    'td',
                                    { width: '200' },
                                    '杭州三基传媒有限公司'
                                ),
                                React.createElement(
                                    'td',
                                    { width: '150' },
                                    '￥840.00 '
                                ),
                                React.createElement(
                                    'td',
                                    { width: '150' },
                                    '已立案'
                                ),
                                React.createElement(
                                    'td',
                                    { width: '100', align: 'center' },
                                    React.createElement('input', { type: 'button', className: 'sc-button sc-button-gray sc-button-sm', value: '撤 诉' }),
                                    ' ',
                                    React.createElement('br', null),
                                    React.createElement(
                                        'a',
                                        { href: 'javascript:;', className: 'sc-link-blue' },
                                        '被告送达处理'
                                    ),
                                    ' ',
                                    React.createElement('br', null),
                                    React.createElement(
                                        'a',
                                        { href: 'javascript:;', className: 'sc-link-blue' },
                                        '法官调档'
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    // 接口
    module.exports = NewMysuitDataHead;
});