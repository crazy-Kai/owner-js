'use strict';

define(function (require, exports, module) {
    //依赖
    var React = require('react'),
        ReactDOM = require('reactDOM'),
        Controller = require('./controller');

    var TableBuild = React.createClass({
        displayName: 'TableBuild',

        mixins: [Controller.Reflux.connect(Controller.Store)],
        handlefunction: function handlefunction(e) {

            Controller.Actions.editName(e, ReactDOM.findDOMNode(this.refs.myInput));
        },
        createName: function createName(e) {
            Controller.Actions.addName(e, ReactDOM.findDOMNode(this.refs.myInput));
        },
        render: function render() {
            //这里可以设置变量
            //有循环元素的时候必须用key 等于一个变量来区分循环后的每个元素，就相当与给每个tr 加了ID
            var self = this;
            return React.createElement(
                'div',
                { className: 'fn-FS16' },
                React.createElement(
                    'div',
                    { width: '100%' },
                    React.createElement(
                        'h1',
                        { className: 'fn-TAC fn-LH30 fn-FS16 fn-FWB' },
                        'React 基础 练习 '
                    )
                ),
                React.createElement(
                    'table',
                    { className: 'fn-table fn-table-text fn-table-border', width: '100%' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                { width: '300' },
                                '序号'
                            ),
                            React.createElement(
                                'th',
                                { width: '300' },
                                '名字'
                            ),
                            React.createElement(
                                'th',
                                null,
                                '操作'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        this.state.data.map(function (v, i) {
                            return React.createElement(
                                'tr',
                                { key: i },
                                React.createElement(
                                    'td',
                                    { width: '300' },
                                    ++i
                                ),
                                React.createElement(
                                    'td',
                                    { width: '300' },
                                    v.name
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    React.createElement(
                                        'button',
                                        { className: 'fn-btn fn-btn-primary fn-MR10', 'data-index': i, onClick: self.handlefunction },
                                        '编辑'
                                    ),
                                    React.createElement(
                                        'button',
                                        { className: 'fn-btn fn-btn-primary', 'data-index': i, onClick: Controller.Actions.deleteName },
                                        '删除'
                                    )
                                )
                            );
                        })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'fn-MT20 fn-W300 fn-LH30 fn-MT20 ' },
                    React.createElement('input', { ref: 'myInput', type: 'text', className: 'fn-input-text', placeholder: '请输入姓名', maxLength: '20' }),
                    React.createElement(
                        'button',
                        { className: 'fn-btn fn-btn-default fn-LH28', onClick: self.createName },
                        '增加'
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(TableBuild, null), document.getElementById("test"));
});