define(function(require,exports,module){
  //依赖
  var React = require('react'),
      ReactDOM = require('reactDOM');
  var data = [{name:"wuxiaowen"},{name:"wukai"},{name:"zp"},{name:"zl"}]; 

  var TableBuild = React.createClass({
        
    	// 这里可以添加初始化方法
    	//初始化state,与gitDefualtProps方法的区别是，每次实例化创建时都会被调用一次，在这方法里，你已经可以访问到this.props
    	getInitialState:function(){
    		return {
    			data:this.props.data,
    			key : "",
                value:""
    		}
    	},
    	// 此方法对于组建来说只会被调用一次,初始化的props不能被设为一个固定值。
    	getDefualtProps:function(){
    		return {
    			data:[]
    		}
    	},
        ComponentWillMount:function(){
            //组件 将要加载的时候去做一些事情，比如发送ajax请求获取数据等  
        },
        ComponentDidMount:function(){
            //等dom结构渲染成功后要去做的一些事情，比如获取dom 元素要写在此方法内

        },
        componentWillUnmount:function(){
                //组件移除之前需要做的一些事情 比如销毁一些插件等
        },
        changeValue:function(e){
            this.setState({
                value:e.target.value
            })
        },
    	//根据循环state得到的数组中每个元素的下表index ,来删除指定的元素
    	deleteName:function(e){
    		var self = this,
    		     index = $(e.target).attr("data-index"),
    		     data = self.state.data;
    		     data.splice(index-1,1);
    		     self.setState({data:data});
    	},
    	//修改名字，点击编辑的时候把当前点击的元素的下标取出来保存到组建的state里，方便以下的保存操作，利用ref属性通过ReactDOM.findDOMNode(this.refs.myInput)的方法获取元素的DOM节点,方便操作
    	editName:function(e){
    		var index = $(e.target).attr("data-index"),
    		    keys = index -1,
    			self = this,
    			input = ReactDOM.findDOMNode(self.refs.myInput);
                console.log(self.refs)
   			    input.value = self.state.data[keys].name;
   			    input.nextSibling.textContent = "保存";
  				input.focus();
    			self.setState({key:keys});
    	},
    	//保存修改//新增
    	addName:function(e){
    		var textName = e.target.textContent,
    			self = this,
    		    data = self.state.data,
    		    //取出 点击编辑后保存在state里的key(下标);
    		    key = self.state.key,
    		    input = ReactDOM.findDOMNode(self.refs.myInput);

                //input = self.refs.myInput.getDOMNode();
                console.log(input)

                input = self.refs.myInput.getDOMNode();

    		   if(textName === "保存"){
    		   	  data[key].name =  input.value;
    		   	  self.setState({data:data});
    		   	  input.value= "";
    		   	  e.target.textContent = "增加";
    		   };
    		   if(textName === "增加"){
    		   	data.push({name: input.value});
    		   	self.setState({data:data});
    		    input.value = "";
    		   }
    	},
    	render:function(){
    		//这里可以设置变量
    		//有循环元素的时候必须用key 等于一个变量来区分循环后的每个元素，就相当与给每个tr 加了ID 
    		var self = this,
                arr = [];
            this.state.data.map(function(v,i){
                arr.push(<tr key = {i}>
                            <td width="300">
                                {++i}
                            </td >
                            <td width="300">
                                {v.name}
                            </td>
                            <td>
                                <button className="fn-btn fn-btn-primary fn-MR10" data-index = {i} onClick = {self.editName} >编辑</button>
                                <button className="fn-btn fn-btn-primary" data-index = {i} onClick = {self.deleteName}  >删除</button>
                            </td>
                        </tr>)
            }.bind(this));
    		return (
        			<div className="fn-FS16">
        					<div width="100%">
								<h1 className="fn-TAC fn-LH30 fn-FS16 fn-FWB">React 基础 练习 {this.state.value}</h1>
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

		        					{arr}
		        				</tbody>	

		        			</table>

		        			<div className = "fn-MT20 fn-W300 fn-LH30 fn-MT20 ">

								<input  ref="myInput"  value={this.state.value} onChange={this.changeValue} type="text" className="fn-input-text" placeholder="请输入姓名" maxLength="20"/>
								<button className="fn-btn fn-btn-default fn-LH28" style={{backgroundColor:"#047dc6",height:"33px",verticalAlign:"-1px",color:"#fff"}}   onClick = {self.addName}>增加</button>

							
							</div>
                            <div className="fn-MT20">
                                <ul>

                                    {React.Children.map(this.props.children,function(p){
                                        return (<li>{p}</li>)
                                    })}
                                </ul>
                            </div>
					</div>
    			)
    	}
  });
// ReactDOM.render(
//     React.createElement("h1",null,"wukai"),
//     document.getElementById('dom')
// )
ReactDOM.render(<TableBuild data = {data} ><p>I am A</p><p> I am B </p></TableBuild>,
	document.getElementById("test")
	)
})