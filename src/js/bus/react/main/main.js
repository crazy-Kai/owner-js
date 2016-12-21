'use strict';

define(function (require, exports, module) {
    //依赖
    var React = require('react'),
        ReactDOM = require('reactDOM');
    var data = [{ name: "wuxiaowen" }, { name: "wukai" }, { name: "zp" }, { name: "zl" }];

    var TableBuild = React.createClass({
        displayName: 'TableBuild',


        // 这里可以添加初始化方法
        //初始化state,与gitDefualtProps方法的区别是，每次实例化创建时都会被调用一次，在这方法里，你已经可以访问到this.props
        getInitialState: function getInitialState() {
            return {
                data: this.props.data,
                key: "",
                value: ""
            };
        },
        // 此方法对于组建来说只会被调用一次,初始化的props不能被设为一个固定值。
        getDefualtProps: function getDefualtProps() {
            return {
                data: []
            };
        },
        ComponentWillMount: function ComponentWillMount() {
            //组件 将要加载的时候去做一些事情，比如发送ajax请求获取数据等 
        },
        ComponentDidMount: function ComponentDidMount() {
            //等dom结构渲染成功后要去做的一些事情，比如获取dom 元素要写在此方法内

        },
        componentWillUnmount: function componentWillUnmount() {
            //组件移除之前需要做的一些事情 比如销毁一些插件等
        },
        changeValue: function changeValue(e) {
            this.setState({
                value: e.target.value
            });
        },
        //根据循环state得到的数组中每个元素的下表index ,来删除指定的元素
        deleteName: function deleteName(e) {
            var self = this,
                index = $(e.target).attr("data-index"),
                data = self.state.data;
            data.splice(index - 1, 1);
            self.setState({ data: data });
        },
        //修改名字，点击编辑的时候把当前点击的元素的下标取出来保存到组建的state里，方便以下的保存操作，利用ref属性通过ReactDOM.findDOMNode(this.refs.myInput)的方法获取元素的DOM节点,方便操作
        editName: function editName(e) {
            var index = $(e.target).attr("data-index"),
                keys = index - 1,
                self = this,
                input = ReactDOM.findDOMNode(self.refs.myInput);
            console.log(self.refs);
            input.value = self.state.data[keys].name;
            input.nextSibling.textContent = "保存";
            input.focus();
            self.setState({ key: keys });
        },
        //保存修改//新增
        addName: function addName(e) {
            var textName = e.target.textContent,
                self = this,
                data = self.state.data,

            //取出 点击编辑后保存在state里的key(下标);
            key = self.state.key,
                input = ReactDOM.findDOMNode(self.refs.myInput);

            //input = self.refs.myInput.getDOMNode();
            console.log(input);

            input = self.refs.myInput.getDOMNode();

            if (textName === "保存") {
                data[key].name = input.value;
                self.setState({ data: data });
                input.value = "";
                e.target.textContent = "增加";
            };
            if (textName === "增加") {
                data.push({ name: input.value });
                self.setState({ data: data });
                input.value = "";
            }
        },
        render: function render() {
            //这里可以设置变量
            //有循环元素的时候必须用key 等于一个变量来区分循环后的每个元素，就相当与给每个tr 加了ID
            var self = this,
                arr = [];
            this.state.data.map(function (v, i) {
                arr.push(React.createElement(
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
                            { className: 'fn-btn fn-btn-primary fn-MR10', 'data-index': i, onClick: self.editName },
                            '编辑'
                        ),
                        React.createElement(
                            'button',
                            { className: 'fn-btn fn-btn-primary', 'data-index': i, onClick: self.deleteName },
                            '删除'
                        )
                    )
                ));
            }.bind(this));
            return React.createElement(
                'div',
                { className: 'fn-FS16' },
                React.createElement(
                    'div',
                    { width: '100%' },
                    React.createElement(
                        'h1',
                        { className: 'fn-TAC fn-LH30 fn-FS16 fn-FWB' },
                        'React 基础 练习 ',
                        this.state.value
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
                        arr
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'fn-MT20 fn-W300 fn-LH30 fn-MT20 ' },
                    React.createElement('input', { ref: 'myInput', value: this.state.value, onChange: this.changeValue, type: 'text', className: 'fn-input-text', placeholder: '请输入姓名', maxLength: '20' }),
                    React.createElement(
                        'button',
                        { className: 'fn-btn fn-btn-default fn-LH28', style: { backgroundColor: "#047dc6", height: "33px", verticalAlign: "-1px", color: "#fff" }, onClick: self.addName },
                        '增加'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'fn-MT20' },
                    React.createElement(
                        'ul',
                        null,
                        React.Children.map(this.props.children, function (p) {
                            return React.createElement(
                                'li',
                                null,
                                p
                            );
                        })
                    )
                )
            );
        }
    });
    // ReactDOM.render(
    //     React.createElement("h1",null,"wukai"),
    //     document.getElementById('dom')
    // )
    ReactDOM.render(React.createElement(
        TableBuild,
        { data: data },
        React.createElement(
            'p',
            null,
            'I am A'
        ),
        React.createElement(
            'p',
            null,
            ' I am B '
        )
    ), document.getElementById("test"));
});