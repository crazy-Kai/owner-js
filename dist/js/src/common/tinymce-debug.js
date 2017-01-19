"use strict";
define("src/common/tinymce-debug", ["common/jquery-debug", "model/modal/main-debug"], function(require, exports, module) {
    var $ = require("common/jquery-debug"),
        Modal = require("model/modal/main-debug"),
        plugins = ["advlist", "autolink", "lists", "hr", "emoticons", "textcolor", "insertdatetime", "link", "table", "fullscreen", "preview", "togglemore", "upload"],
        toolbar_1 = ["preview fullscreen  undo redo", "fontselect fontsizeselect", "bold italic underline strikethrough removeformat", "forecolor backcolor", "link", "emoticons togglemore"],
        toolbar_2 = ["alignleft aligncenter alignright alignjustify", "bullist numlist outdent indent", "table hr inserttime", "upload"];
    if (!window.tinymce) return {};
    tinymce.DOM.events.domLoaded = !0;
    var config = {
        theme: "modern",
        height: 400,
        resize: !0,
        border_width: 1,
        target_list: !1,
        convert_urls: !1,
        visual: !1,
        keep_values: !1,
        forced_root_block: "div",
        show_system_default_font: !0,
        plugins: plugins,
        toolbar_1: toolbar_1.join(" | "),
        toolbar_2: toolbar_2.join(" | "),
        contentStyles: ["body{background:#F00;}"],
        setup: function(ed) {},
        uploadConfig: {
            inputName: "uploadFile",
            actionUrl: "/fileOperation/upload.json",
            formatResult: function(response) {
                var retValue = response.content.retValue;
                return {
                    content: {
                        name: retValue.fileName,
                        downloarUrl: retValue.url
                    }
                }
            },
            change: function() {},
            errorCallback: function(a, err, msg) {
                "Request Entity Too Large" === msg && Modal.alert(0, "文件大小限制在15M以内")
            },
            progressCallback: function() {},
            success: function() {}
        },
        i18n_messages: {
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
            "font.family.list": "宋体=simsun;黑体=simhei;楷体=kaiti;隶书=隶书;幼圆=幼圆;微软雅黑=微软雅黑;Arial=arial;Arial Black=arial black;Book Antiqua=book antiqua;Calibri=calibri;Comic Sans MS=comic sans MS;Courier New=courier new;Garamond=garamond;Georgia=georgia;Helvetica=helvetica;Impact=impact;Narrow=narrow;Sans Serif=sans-serif;Serif=serif;Symbol=@symbol;Tahoma=tahoma;Times New Roman=times new roman;Trebuchet MS=trebuchet MS;Verdana=verdana;Webdings=@webdings;Wide=wide;Wingdings=@wingdings",
            "button.font.family": "字体",
            "font.size.list": "10px;13px;14px;16px;18px;24px;32px;48px",
            "button.font.size": "字号",
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
            "button.toggle.more": "切换功能",
            "button.fullscreen": "全屏（Ctrl+Alt+F）",
            "button.date.time": "日期/时间",
            "button.text.color": "选择文字颜色",
            "button.background.color": "选择背景颜色"
        },
        init_instance_callback: function() {
            var editor = this;
            editor.contentDocument.body.style.minHeight = "380px"
        },
        menu_class: "aym_scroll mce-y-scroll",
        iframe_class: "aym_scroll aym_scroll_auto",
        full_screen_compute_top_fun: function() {
            var top = "0px",
                oWrapNode = $(".aym_page_wrap");
            return oWrapNode.length > 0 && (top = oWrapNode.offset().top + "px"), top
        },
        cssFiles: ["styles/skin.css", "styles/skin-ext.css", "styles/skin-autocomplete.css"]
    };
    return function(obj) {
        tinymce.init($.extend(config, obj))
    }
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});