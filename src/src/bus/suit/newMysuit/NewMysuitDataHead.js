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
        { className: 'sc-data-head sc-MaTo20 sc-MaLe20 sc-MaRi10 sc-LiHe25' },
        React.createElement(
          'table',
          { width: '100%', className: 'sc-table sc-table-data sc-table-noborder' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                '案由'
              ),
              React.createElement(
                'td',
                { width: '200' },
                '原告'
              ),
              React.createElement(
                'td',
                { width: '200' },
                '被告'
              ),
              React.createElement(
                'td',
                { width: '150' },
                '标的金额'
              ),
              React.createElement(
                'td',
                { width: '150' },
                '诉讼状态'
              ),
              React.createElement(
                'td',
                { width: '100', align: 'center' },
                '操作'
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