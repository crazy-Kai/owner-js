"use strict";
/**
 * 验证类[全站的验证入口]
 * 2015,05,21 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		Modal = require('model/modal/main');

	//变量
	var plugins = ["advlist", "autolink", "lists", "hr", "emoticons", "textcolor", "insertdatetime", "link", "table",  "fullscreen","preview", "togglemore","upload"];
	var toolbar_1 = [ "preview fullscreen  undo redo", "fontselect fontsizeselect", "bold italic underline strikethrough removeformat", "forecolor backcolor", "link","emoticons togglemore" ];
	var toolbar_2 = [ "alignleft aligncenter alignright alignjustify", "bullist numlist outdent indent", "table hr inserttime" ,"upload"];
	if(!window.tinymce){
		return {};
	};
	tinymce.DOM.events.domLoaded = true;

	//初始化
	var config = {
		// selector: '#'+J_Editor1.id,
	    theme: "modern",
	    height: 400,
	    resize: true,
	    //是否可以鼠标拖动编辑器改变大小
	    border_width: 1,
	    //编辑器的边框宽度，alimail有两种情况，编辑写信是1，设置签名是没有边框的编辑器，所以设置了0
	    target_list: false,
	    convert_urls: false,
	    //当你insertContent的时候，取消一些节点src的转换
	    visual: false,
	    //table的虚框是否显示，由于大文本设置虚框很耗性能，所以取消掉
	    keep_values: false,
	    //必须设置false用来提高性能
	    forced_root_block: "div",
	    //当空文本的时候，tinymce会设置一个根节点，默认是P，我们要改成div比较合理
	    show_system_default_font: true,
	    // 是否开启系统字体的探测，alimail这边是开启的，这个是alimail新增的功能。
	    //        content_style : aym.global.HtmlTemplateCache.getTemplate('editorContentCss'),//alimail 这边是直接设置文本进去的，content_css是ajax加载的，效果一样，设置文本节省一个请求
	    // content_css: "$assetsLink/model/tinymce/styles/editorContentCss.css",
	    //        local_image : true,//alimail 插件使用的
	    //        attach_owner : aym.global.UserData.getEmail(),//alimail 插件使用的
	    plugins: plugins,
	    toolbar_1: toolbar_1.join(" | "),
	    toolbar_2: toolbar_2.join(" | "),
	    contentStyles: ['body{background:#F00;}'],
	    setup : function(ed) {
	    	
	    },
		uploadConfig: {
	        "inputName": "uploadFile",//上传的file input的name属性，默认file
	        "actionUrl": "/fileOperation/upload.json",//数据提交后端处理接口，需要返回JSON格式数据
	        "formatResult": function(response){ //数据返回结构化，optional，供老接口兼容使用，return的Object是plugin预期的结构
	        	var retValue = response.content.retValue;
	            return {
	               content: {
	                   "name": retValue.fileName,
	                   "downloarUrl": retValue.url
	               }
	           };
	        },
	        "change": function(){
	        	console.log('123123');
	        },
	        "errorCallback": function(a, err, msg){ //自定义的错误回调，optional，不设置会直接alert错误
	            console.log('errorCallback', arguments);
	            if(msg === 'Request Entity Too Large'){
	            	Modal.alert(0, '文件大小限制在15M以内');
	            };
	        },
	        "progressCallback": function(){ //自定义的上传进度回调，optional，不设置不显示进度
	            console.log('progressCallback', arguments);
	        },
	        "success": function(){
	        	console.log('successCallback');
	        }
	    },
	    i18n_messages: {
	        //国际化
	        //tinymce.js
	        "default.font": "系统默认",
	        "button.ok": "确定",
	        "button.cancel": "取消",
	        "button.bold": "粗体（Ctrl+B）",
	        "button.italic": "斜体（Ctrl+I）",
	        "button.underline": "下划线（Ctrl+U）",
	        "button.strikethrough": "删除线",
	        "button.outdent": "减少缩进",
	        "button.indent": "增加缩进",
	        "button.horizontal.line": "插入横线",
	        "button.remove.format": "清除格式",
	        "button.align.left": "左对齐",
	        "button.align.center": "居中对齐",
	        "button.align.right": "右对齐",
	        "button.align.justify": "两端对齐",
	        "button.undo": "撤销（Ctrl+Z）",
	        "button.redo": "重做（Ctrl+Y）",
	        "font.family.list": "宋体=simsun;黑体=simhei;楷体=kaiti;隶书=隶书;幼圆=幼圆;微软雅黑=微软雅黑" + ";" + "Arial=arial;Arial Black=arial black;Book Antiqua=book antiqua;Calibri=calibri;Comic Sans MS=comic sans MS;Courier New=courier new;Garamond=garamond;Georgia=georgia;Helvetica=helvetica;Impact=impact;Narrow=narrow;Sans Serif=sans-serif;Serif=serif;Symbol=@symbol;Tahoma=tahoma;Times New Roman=times new roman;Trebuchet MS=trebuchet MS;Verdana=verdana;Webdings=@webdings;Wide=wide;Wingdings=@wingdings",
	        "button.font.family": "字体",
	        "font.size.list": "10px;13px;14px;16px;18px;24px;32px;48px",
	        "button.font.size": "字号",
	        //advlist/plugin.js
	        "button.number.list": "项目编号",
	        "number.default": "默认",
	        "number.lower.alpha": "小写英文字母",
	        "number.lower.greek": "小写希腊字母",
	        "number.lower.roman": "小写罗马字母",
	        "number.upper.alpha": "大写英文字母",
	        "number.upper.roman": "大写罗马字母",
	        "button.bullet.list": "项目符号",
	        "bullet.default": "默认",
	        "bullet.circle": "圆形",
	        "bullet.disc": "碟形",
	        "bullet.square": "方形",
	        //togglemore/plugin.js
	        "button.toggle.more": "切换功能",
	        //fullscreen/plugin.js
	        "button.fullscreen": "全屏（Ctrl+Alt+F）",
	        //insertdatetime/plugin.js
	        "button.date.time": "日期/时间",
	        //textcolor/plugin.js
	        "button.text.color": "选择文字颜色",
	        "button.background.color": "选择背景颜色"
	    },
	    //        default_style_fun : aym.util.getDefaultFontStyle, //alimail 使用的 ，获取默认字体styles的function
	    //        render_empty_fun : aym.util.renderEmptyNodeWithDefaultFontStyle,//alimail 使用的 ，获取默认字体的div文本的function
	    init_instance_callback: function() {
	        // //初始化成功后的回调，alimail这里做了比较多的事情，参考代码
	        // window.editor = this;
	        // //
	        // var editor = this;
	        // console.log(editor.get('selector'));
	        // editor.setContent($('#J_Editor1').val());
	        // var oPanelItems = this.theme.panel.items();
	        // var oContainerElm = this.getContainer();
	        // var nContainerHeight = $(oContainerElm).children().height();
	        // var oBottomToolbar = oPanelItems[0].items()[1];
	        // oBottomToolbar.show();
	        // var fullscreen = oPanelItems[0].items()[0].items()[0];
	        // var style = fullscreen.getEl().style;
	        // $(fullscreen.getEl()).css({
	        //     "margin-right": "2px",
	        //     clear: "both",
	        //     "float": "right"
	        // });
	        // $(fullscreen.getEl()).on("click", function() {
	        //     $("#___xiuxiu-temp-container-div").hide();
	        // });
			var editor = this;
			editor.contentDocument.body.style.minHeight = "380px"
	    },
	    menu_class: "aym_scroll mce-y-scroll",
	    //下拉菜单的样式，alimail这边主要是设置滚动条的样式，比如字体下拉菜单
	    iframe_class: "aym_scroll aym_scroll_auto",
	    //iframe的样式，alimail这边主要是设置滚动条的样式
	    full_screen_compute_top_fun: function() {
	        //全屏的时候，alimail这边页面最上面有广告的，所以全屏的时候不能挡住广告，所以搞个计算top的function
	        var top = "0px", oWrapNode = $(".aym_page_wrap");
	        if (oWrapNode.length > 0) {
	            top = oWrapNode.offset().top + "px";
	        }
	        return top;
	    },
	    cssFiles: [ "styles/skin.css", "styles/skin-ext.css", "styles/skin-autocomplete.css" ]
	}


	return function(obj){
		tinymce.init($.extend(config, obj));
	}


});