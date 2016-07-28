'use strict';

define(function (require, exports, module) {
	"use strict";
	//依赖

	var React = require('react'),
	    ReactDOM = require('reactDOM'),
	    Container = require('myReact/jsx/reactContainer');

	ReactDOM.render(React.createElement(Container, { sourceData: 'myReact/data.json' }), document.getElementById('test'));
});