define(function(require,exports,module){
	"use strict"
	//依赖
		var React = require('react'),
		  	ReactDOM = require('reactDOM'),
	    	Container = require('bus/myReact/jsx/reactContainer');
	    
		    ReactDOM.render(
		    	<Container sourceData = "bus/myReact/data.json"/>,
		    	document.getElementById('test')
		    );
})