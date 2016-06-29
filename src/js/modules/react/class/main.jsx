define(function(require,exports,module){
   //es6 引入class
  	//在ES6里，我们通过定义一个继承自React.Component的class来定义一个组件类，像这样：
    //ES5
	var Photo1 = React.createClass({
	    render: function() {
	        return (
	            <Image source={this.props.source} />
	        );
	    },
	});
	//ES6
	class Photo2 extends React.Component {
	    render() {
	        return (
	            <Image source={this.props.source} />
	        );
	    }
	}

	//给组建定义方法
	//ES5
	var Photo3 = React.creatClass({
		componentWillMount:function(){

		},
		render:function(){
		 return <Image source={this.props.source} />
		}
	})
	//ES6
	class Photo4 extends React.Component {
	    componentWillMount() {

	    }
	    render() {
	        return (
	            <Image source={this.props.source} />
	        );
	    }
	}
	//定义组件的属性类型和默认属性
	//ES5
		var Video1 = React.createClass({
	    getDefaultProps: function() {
	        return {
	            autoPlay: false,
	            maxLoops: 10,
	        };
	    },
	    propTypes: {
	        autoPlay: React.PropTypes.bool.isRequired,
	        maxLoops: React.PropTypes.number.isRequired,
	        posterFrameSrc: React.PropTypes.string.isRequired,
	        videoSrc: React.PropTypes.string.isRequired,
	    },
	    render: function() {
	        return (
	            <View />
	        );
	    },
	});
	//ES6 
	class Video2 extends React.Component {
	    render() {
	        return (
	            <View />
	        );
	    }
	}
	Video2.defaultProps = {
	    autoPlay: false,
	    maxLoops: 10,
	};
	Video2.propTypes = {
	    autoPlay: React.PropTypes.bool.isRequired,
	    maxLoops: React.PropTypes.number.isRequired,
	    posterFrameSrc: React.PropTypes.string.isRequired,
	    videoSrc: React.PropTypes.string.isRequired,
	};
	//初始化STATE
	//ES5 
	var Videos = React.createClass({
	    getInitialState: function() {
	        return {
	            loopsRemaining: this.props.maxLoops,
	        };
	    },
	})
	//ES6下，有两种写法：

	//ES6
	class Videosss extends React.Component {
		constructor(props){
		        super(props);
		        this.state = {
		            loopsRemaining: this.props.maxLoops,
		        };
		    }
	}
	//把方法作为回调提供
	//ES5
	var PostInfo = React.createClass({
	    handleOptionsButtonClick: function(e) {
	        // Here, 'this' refers to the component instance.
	        this.setState({showOptionsModal: true});
	    },
	    render: function(){
	        return (
	            <TouchableHighlight onPress={this.handleOptionsButtonClick}>
	                <Text>{this.props.label}</Text>
	            </TouchableHighlight>
	        )
	    },
	});
	//ES6
	class PostInfosss extends React.Component
		{
			 
		    handleOptionsButtonClick(e){

		        this.setState({showOptionsModal: true});
		    }
		    render(){
		        return (
		            <TouchableHighlight 
		                onPress={this.handleOptionsButtonClick.bind(this)}
		                
		                >
		                <Text>{this.props.label}</Text>
		            </TouchableHighlight>
		        )
		    };
		}
		//需要注意的是，不论是bind还是箭头函数，每次被执行都返回的是一个新的函数引用，因此如果你还需要函数的引用去做一些别的事情（譬如卸载监听器），那么你必须自己保存这个引用
    class PauseMenu extends React.Component{
	    constructor(props){
	        super(props);
	        this._onAppPaused = this.onAppPaused.bind(this);
	    }
	    componentWillMount(){
	        AppStateIOS.addEventListener('change', this._onAppPaused);
	    }
	    componentDidUnmount(){
	        AppStateIOS.removeEventListener('change', this._onAppPaused);
	    }
	    onAppPaused(event){
	    }
	}
	//Mixins  在ES5下，我们经常使用mixin来为我们的类添加一些新的方法，譬如PureRenderMixin
	var PureRenderMixin = require('react-addons-pure-render-mixin');
	React.createClass({
	  mixins: [PureRenderMixin],

	  render: function() {
	    return <div className={this.props.className}>foo</div>;
	  }
	});
	//然而现在官方已经不再打算在ES6里继续推行Mixin，他们说：Mixins Are Dead. Long Live Composition。

	//使用高阶组件替代Mixins方法如下:
	
	<div {...this.props} className="override">
	    …
	</div>
	//这个例子则相反，如果属性中没有包含className，则提供默认的值，而如果属性中已经包含了，则使用属性中的值

	


})