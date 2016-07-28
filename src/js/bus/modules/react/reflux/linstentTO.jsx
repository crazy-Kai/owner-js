define(function(require,exports,module){
  //依赖
  var React = require('react'),
      ReactDOM = require('reactDOM'),
      Controller = require('./listenActions'),
      Reflux = require('reflux');
     
    
   
  var TableBuild = React.createClass({
        mixins : [Reflux.listenTo(Controller.Store,'onChanges')],
        getInitialState:function(){
            return {
                data:[]
            }
        },
        onChanges:function(datas){
           
            console.log(1111111,datas)
            var me = this;
            me.setState({data:datas})
        },
        handlefunction:function(e){

            Controller.Actions.editName(e,ReactDOM.findDOMNode(this.refs.myInput))
        },
        createName:function(e){
            Controller.Actions.addName(e,ReactDOM.findDOMNode(this.refs.myInput))
        },
        render:function(){
            //这里可以设置变量
            //有循环元素的时候必须用key 等于一个变量来区分循环后的每个元素，就相当与给每个tr 加了ID 
            console.log(this.state.data.data)
            var self = this;
         
            return (
                    <div className="fn-FS16">
                            <div width="100%">
                                <h1 className="fn-TAC fn-LH30 fn-FS16 fn-FWB">React 基础 练习 </h1>
                            </div>  
                            <table className="fn-table fn-table-text fn-table-border" width="100%">
                                <thead>
                                    <tr>
                                        <th width="300">
                                            序号
                                        </th>
                                        <th width="300">
                                            名字
                                        </th>
                                        <th>
                                            操作
                                        </th>   
                                    </tr>
                                </thead>
                                <tbody>

                                    {

                                        this.state.data.map(function(v,i){
                                            return (
                                                <tr key = {i}>
                                                    <td width="300">
                                                        {++i}
                                                    </td >
                                                    <td width="300">
                                                        {v.name}
                                                    </td>
                                                    <td>
                                                        <button className="fn-btn fn-btn-primary fn-MR10" data-index = {i} onClick = {self.handlefunction} >编辑</button>
                                                        <button className="fn-btn fn-btn-primary" data-index = {i} onClick = {Controller.Actions.deleteName}  >删除</button>
                                                    </td>
                                                </tr>

                                                )
                                        })  

                                        }
                                </tbody>    

                            </table>

                            <div className = "fn-MT20 fn-W300 fn-LH30 fn-MT20 ">
                                <input  ref="myInput" type="text" className="fn-input-text" placeholder="请输入姓名" maxLength="20"/>
                                <button className="fn-btn fn-btn-default fn-LH28" onClick = {self.createName} >增加</button>
                            </div>
                    </div>
                )
        }
  });

ReactDOM.render(<TableBuild  />,
    document.getElementById("test")
    )
})