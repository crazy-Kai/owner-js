'use strict';

define(function (require, exports, module) {
	//依赖
	var React = require('react'),
	    Pushbutton = require('./pushbutton');

	var ContentBox = React.createClass({
		displayName: 'ContentBox',

		getInitialState: function getInitialState() {
			return { id: null, title: '', author: '' };
		},
		render: function render() {

			return React.createElement(
				'table',
				{ className: 'fn-table fn-table-border' },
				React.createElement(
					'tbody',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							{ width: '250' },
							React.createElement(
								'div',
								{ className: 'fn-MB5' },
								React.createElement(
									'span',
									{ className: 'fn-MR5' },
									'标题'
								),
								React.createElement(
									'span',
									null,
									React.createElement('input', { className: 'fn-input-text fn-input-text-sm fn-W180', ref: 'title', name: 'title', type: 'text', value: this.state.title })
								)
							),
							React.createElement(
								'div',
								null,
								React.createElement(
									'span',
									{ className: 'fn-MR5' },
									'作者'
								),
								React.createElement(
									'span',
									null,
									React.createElement('input', { className: 'fn-input-text fn-input-text-sm fn-W180 ', ref: 'author', name: 'author', type: 'text', value: this.state.author })
								)
							)
						),
						React.createElement(
							'td',
							{ width: '250' },
							React.createElement(
								'div',
								{ className: 'fn-TAC' },
								React.createElement(Pushbutton, { className: 'fn-btn fn-MR5', btnName: '确认' }),
								React.createElement(Pushbutton, { className: 'fn-btn', btnName: '取消' })
							)
						)
					)
				)
			);
		}
	});

	return ContentBox;
});