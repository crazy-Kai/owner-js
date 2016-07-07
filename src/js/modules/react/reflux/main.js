'use strict';

define(function (require, exports, module) {
    //依赖
    var React = require('react'),
        ReactDOM = require('reactDOM'),
        Reflux = require('reflux');
    console.log(React);
    //创建Actions  
    var TableActions = Reflux.createActions(['deleteName', 'addName', 'editName']);
    //创建Store
    var TableStore = Reflux.createStore({
        listenables: [TableActions],
        getInitialState: function getInitialState() {
            return this.store;
        },
        store: {
            data: [{ name: "wuxiaowen" }, { name: "wukai" }, { name: "一丙" }, { name: "保健" }],
            key: ""
        },
        onDeleteName: function onDeleteName(event) {
            var self = this,

            //react版本问题，这里不能用e.target否则找不到，只能用event.persist()方法来获取e.target
            target = $(event.target),
                index = target.data("index");
            self.store.data.splice(index - 1, 1);
            self.trigger(self.store);
        },
        onEditName: function onEditName(event, myInput) {
            var self = this,
                index = $(event.target).data("index"),
                key = index - 1,
                value = self.store.data[key].name,
                input = myInput;
            input.value = value;

            self.store.key = key;

            input.nextSibling.textContent = "保存";
            input.focus();
            self.trigger(self.store);
        }

    });

    var TableBuild = React.createClass({
        displayName: 'TableBuild',

        mixins: [Reflux.connect(TableStore)],
        handlefunction: function handlefunction(e) {

            TableActions.editName(e, ReactDOM.findDOMNode(this.refs.myInput));
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
                                        { className: 'fn-btn fn-btn-primary', 'data-index': i, onClick: TableActions.deleteName },
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
                        { className: 'fn-btn fn-btn-default fn-LH28' },
                        '增加'
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(TableBuild, null), document.getElementById("test"));
});