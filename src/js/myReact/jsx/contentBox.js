'use strict';

define(function (require, exports, module) {
	//依赖
	var React = require('react');

	var ContentBox = React.createClass({
		displayName: 'ContentBox',

		getInitialState: function getInitialState() {
			return { id: null, title: '', author: '' };
		},
		render: function render() {

			return React.createElement(
				'div',
				null,
				React.createElement(
					'ul',
					null,
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							null,
							'标题'
						),
						React.createElement(
							'span',
							null,
							' ',
							React.createElement('input', { ref: 'title', name: 'title', type: 'text', value: this.state.title }),
							' '
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							null,
							'作者'
						),
						React.createElement(
							'span',
							null,
							' ',
							React.createElement('input', { ref: 'author', name: 'author', type: 'text', value: this.state.author }),
							' '
						)
					)
				)
			);
		}
	});

	return ContentBox;
});