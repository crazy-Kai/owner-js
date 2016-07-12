"use strict";

define(function (require, exports, module) {
	//依赖
	var React = require('react'),
	    Reflux = require('reflux'),
	    Pushbutton = require('./pushbutton'),
	    DateRow = require('./dataRow'),
	    ListenToActions = require('myReact/controller/listenToActions'),
	    ListenToStore = require('myReact/controller/listenToStore');
	var DataTable = React.createClass({
		displayName: 'DataTable',

		mixins: [Reflux.listenTo(ListenToStore, 'onChange')],

		getInitialState: function getInitialState() {
			return {
				data: []
			};
		},
		// 监听时间
		onChange: function onChange(data, fn) {
			var sourceData = this.state.data;
			switch (data.type) {
				case "init":
					this.setState({ data: data.value });
					break;
				case "add":
					sourceData.push(data.value);
					this.setState({ data: sourceData });
					break;
				case "modify":
					var newData = sourceData.map(function (val) {
						if (val.id == data.value.id) {
							val = data.value;
						}
						return item;
					});
					this.setState({ data: newData });
					break;
				case "delete":
					var index = sourceData.indexOf(data.value);
					//相当于一个开关只有index不为负一的时候要做的操作
					index != -1 && sourceData.splice(index, 1);
					this.setState({ data: sourceData });
					break;
			}
		}

	});
});