 "use strict"
 define(function(require, exports, module) {

     /*--依赖--*/
     var $ = require('$'), //JQ
         util = require('common/util'), //工具类
         limit = require('common/limit'),
         handlerbars = require('common/handlerbars');//模板
         // Poploading = require('model/poploading/main');

     /*--变量--*/
     var domUtil = {},
         maybeCallback = util.maybeCallback,
         REX = /^(.+)\.(.+)/,
         K = util.K;

     // 浏览器判断
     domUtil.isWebkit = !!navigator.vendor;

     /*--函数--*/

     //接口:util
     domUtil.util = util;

     //接口:jQuery
     domUtil.jQuery = $;

     //接口:handlerbars
     domUtil.handlerbars = handlerbars;

     //接口:closest
     domUtil.closest = function(node, query) {
         return $(node).closest(query);
     }

     //接口:显示
     domUtil.show = function(query) {
         $(query).removeClass('fn-hide');
     }

     //接口:隐藏
     domUtil.hide = function(query) {
         $(query).addClass('fn-hide');
     }

     //接口:重绘
     domUtil.redraw = function(query) {
         domUtil.hide(query);
         setTimeout(function() { domUtil.show(query) }, 0);
     }

     //接口:不可用
     domUtil.disabledTrue = function(query) {
             var nodes = $(query).find('input,select,textarea,button');
             nodes.prop('disabled', true)
         }
         //可用
     domUtil.disabledFalse = function(query) {
         var nodes = $(query).find('input,select,textarea,button');
         nodes.prop('disabled', false);
     }


     //获取值
     domUtil.getInputValue = function(table, name) {
         return table.find('[name="' + name + '"]').val();
     }

     //获取
     domUtil.getEscapeUrl = function(url) {
         return encodeURIComponent(url);
     }

     //重置表单
     domUtil.resetForm = function(query) {
         var form = $(query)[0];
         form && form.reset && form.reset();
         //对于隐藏域做特殊的处理
         util.breakEachArr(form, function(val) {
             if (val.type === 'hidden') {
                 var defaultValue = $(val).data('defaultValue');
                 defaultValue !== void 0 && (val.value = defaultValue);
             }
         });
     }

     //跳转
     domUtil.redirect = function(url) {
         location.href = url;
     }

     //解析参数
     domUtil.paseParam = function(name, obj, factory) {
         var rev = {};
         factory = factory || K;
         rev[name] = JSON.stringify(factory(obj)); //.replace(/\\\\+u/g, '\\u');
         return rev;
     }

     //请求
     function request(URL, DATA, TYPE, CALLBACK, CONFIG) {
         CONFIG = CONFIG || {};
         // 设置默认值为true
         CONFIG.needPop === void 0 && (CONFIG.needPop = true);
         CONFIG.needPop && Poploading.show(CONFIG);
         return $.ajax({
             url: URL,
             dataType: 'json',
             type: TYPE,
             data: DATA,
             timeout: 100000,
             cache: false,
             success: function(json) {
                 CONFIG.needPop && Poploading.hide();
                 CALLBACK(json);
             },
             error: function(e) {
                 //CALLBACK('系统异常！', e);
                 CONFIG.needPop && Poploading.hide();
             }
         });
     }
     //格式化参数
     /**
      * 可能的写法
      * 1.ajax('a.json', {}, 'get', function(){});
      * 2.ajax('a.json', {}, function(){});
      * 3.ajax('a.json', function(){});
      */
     function requestParam(URL, DATA, TYPE, CALLBACK, CONFIG) {
         //3.ajax('a.json', function(){});
         if (typeof DATA === 'function') {
             CALLBACK = maybeCallback(DATA);
             DATA = {};
             TYPE = 'post';
         }
         //2.ajax('a.json', {}, function(){});
         else if (typeof TYPE === 'function') {
             CALLBACK = maybeCallback(TYPE);
             TYPE = 'post';
         }
         //1.ajax('a.json', {}, 'get', function(){});
         else {
             CALLBACK = maybeCallback(CALLBACK);
         }
         return [URL, DATA, TYPE, CALLBACK, CONFIG]
     }
     domUtil.ajax = function(URL, DATA, TYPE, CALLBACK, CONFIG) {
         var args = requestParam(URL, DATA, TYPE, CALLBACK, CONFIG),
             callback = args[3];
         args[3] = function(json) {
             if (json.hasError) {
                 callback((json.errors && json.errors[0] && json.errors[0].msg) || 'ajax请求，系统异常！', json.errors);
             } else {
                 callback(null, json.content);
             }
         }
         request.apply(null, args);
     }
     domUtil.http = function(URL, DATA, TYPE, CALLBACK, CONFIG) {
             var args = requestParam(URL, DATA, TYPE, CALLBACK, CONFIG),
                 callback = args[3];
             args[3] = function(json) {
                 var content;
                 if (json.hasError) {
                     callback((json.errors && json.errors[0] && json.errors[0].msg) || 'ajax请求，系统异常！', json.errors);
                 } else {
                     content = json.content;
                     if (!content.isSuccess) {
                         callback(content.message, content)
                     } else {
                         callback(null, content.retValue, content.message, content);
                     }
                 }
             }
             request.apply(null, args);
         }
         //反序列化
     domUtil.unSerialize = function(FORM, JSON, FACTOR) {
             var name, i = 0,
                 val, obj;
             FACTOR = FACTOR || util.K;
             JSON = FACTOR(JSON);
             if (FORM.nodeName !== 'FORM') {
                 FORM = $(FORM).find('input,select,textarea,button');
             }
             for (; obj = FORM[i++];) {
                 if ((name = obj.name) && (val = JSON[name])) {
                     //如果是checkbox
                     if (obj.type === 'checkbox') {
                         if (limit.contains(val.split(','), obj.value)) {
                             obj.checked = true;
                         } else {
                             obj.checked = false;
                         }
                     }
                     //如果是radio
                     else if (obj.type === 'radio') {
                         if (obj.value === val) {
                             obj.checked = true;
                         } else {
                             obj.checked = false;
                         }
                     } else {
                         obj.value = obj.defaultValue = val;
                     }
                 }
             }
         }
         //序列化
     var serialize = domUtil.serialize = function(form, factory) {
         form = $(form);
         var i = 0,
             obj,
             name,
             parseArr = [],
             formList, exclude,
             json = {};
         factory = factory || util.K;
         //获取序列化list
         formList = form.find('[data-serialize-name]');
         //排除list
         exclude = form.find('.JS-serialize-exclude');
         //获取所有的表单，但是排除序列化list内的表单
         form = form.find('input,select,textarea,button').not(exclude.find('input,select,textarea,button')).not(formList.find('input,select,textarea,button'));
         for (; obj = form[i]; i++) {
             if ((name = obj.name) && (obj.disabled === false)) {
                 switch (obj.type) {
                     //对radio的处理
                     case 'radio':
                         if (!obj.checked) {
                             continue;
                         }
                         break;
                         //对于checkbox的特殊处理
                     case 'checkbox':
                         if (obj.checked) {
                             if (!json[name]) {
                                 json[name] = [];
                                 parseArr.push(name);
                             }
                             json[name].push($.trim(obj.value));
                         }
                         continue;
                         break;
                         // case 'textarea':
                         // 	json[name] = form.eq(i).val();
                         // 	continue;
                         // break;
                 }
                 //用JQ的val方法可以对IE下textarea的回车\r\n做处理
                 json[name] = $.trim(form.eq(i).val());
             }
         };
         //对checkbox的解析 [1,2,3] => 1,2,3
         util.breakEachArr(parseArr, function(item) {
             json[item] = json[item].join(',');
         });
         //对一层对象的解析 {"a.b": "c"} => {"a": {"b": "c"}}
         util.breakEachObj(json, function(val, key, obj) {
             if (REX.test(key)) {
                 var tempObj = obj[RegExp.$1] || (obj[RegExp.$1] = {});
                 tempObj[RegExp.$2] = val;
                 delete obj[key];
             }
         });
         //对formList的解析
         formList.each(function() {
             var node = $(this),
                 serializeName = node.data('serializeName'),
                 list,
                 obj;
             if (!(list = json[serializeName])) {
                 list = json[serializeName] = [];
             };
             obj = serialize(node);
             !limit.isEmpty(obj) && list.push(obj);
         });
         return factory(json);
     }

     // 选择框的序列化
     domUtil.selectSerialize = function(node, list) {
         //干掉原始数据
         node.length = 0;
         util.breakEachArr(list, function(val, key) {
             var option = new Option(val.key, val.value, !!val.selected, !!val.selected);
             option.disabled = !!val.disabled;
             node.add(option);
         });
     }

     //输入事件
     domUtil.onChange = function(node, cb) {
         node = $(node);
         var oldVal = node.val(),
             guid;

         function changeMain() {
             var newVal = node.val();
             newVal !== oldVal && cb.call(node, newVal, oldVal);
             oldVal = newVal;
         };
         //W3C
         node.on('input.eventChange', changeMain);
         //IE9 IE9 input 不支持 退格
         document.documentMode === 9 && node.on('keyup.eventChange', function(e) {
             e.keyCode === 8 && changeMain();
         });
         //IE8
         document.documentMode === 8 && node.on('propertychange.eventChange', function(e) {
             e.originalEvent.propertyName === 'value' && changeMain();
         });
     };

     // 反绑定输入时间
     domUtil.offChange = function(node) {
         node = $(node);
         node.off('input.eventChange').off('keyup.eventChange').off('propertychange.eventChange');
     };

     domUtil.winScrollY = function(num) {
         if (arguments.length === 0) {
             return window.scrollY || document.documentElement.scrollTop;
         } else {
             document.documentElement.scrollTop = num;
             window.scrollTo(0, num);
         };
     };

     domUtil.winInnerHeight = function() {
         return window.innerHeight || document.documentElement.clientHeight;
     };
 })
;