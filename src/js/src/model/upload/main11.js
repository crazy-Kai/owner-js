"use strict";
/**
 * 上传组件
 * 2015,06,23 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var nwUpload = require('alinw/upload/2.1.2/upload.js'),
		Modal = require('model/modal/main'),
		MyWidget = require('common/myWidget'),
		$ = require('$');

	//变量
	var handlerbars = MyWidget.handlerbars,
		documentMode = document.documentMode;

	//模板
	var TEMPLATE_WAITE = handlerbars.compile([
			'<span class="file-list fn-VATop">',
    			'上传中...',
    		'</span>'
    	].join('')),
		TEMPLATE_ONE = handlerbars.compile([
			'<span class="file-list JS-target-item fn-VATop" data-id="{{id}}">',
    			'<input type="checkbox" checked="checked" name="UploadFileInput" value="{{id}}" style="display:none;"/><a class="file-list-text fn-btn-link" href="{{url}}" target="_blank">{{name}}</a> <span class="fn-CuPo kuma-icon kuma-icon-close JS-trigger-click-remove" aria-hidden="true"></span>',
    		'</span>',
		].join('')),
		TEMPLATE_LIST = handlerbars.compile([
			'{{#each this}}',
			TEMPLATE_ONE.source,
    		'{{/each}}'
		].join(''));

	//上传类
	var Upload = MyWidget.extend({
		//类名
		clssName: 'Upload',
		//属性
		attrs: {
			trigger: null,
			name: 'uploadFile', //上传的名字
			inputName: 'list', //存储的表单
			fileRewrite: null, //文件回写的地方
			action: '/fileOperation/upload.json',//上传地址
			deleteFile: '/fileOperation/deleteFile.json',//删除
			rule: '(\\.jpg|\\.jpeg|\\.png|\\.bmp|\\.msg|\\.pdf|\\.doc|\\.docx|\\.rar|\\.zip|\\.xls|\\.xlsx|\\.txt|\\.mp3|\\.wav|\\.cda)$',
			list: [],
			size: 10
		},
		//事件
		events: {
			'click .JS-trigger-click-remove': function(e){
				var me = this,
					target = me.closest(e.target, '.JS-target-item'),
					oldHtml = target.html();
				target.html('删除中...');
				me.http(me.get('deleteFile'), {fileIdStr: target.data('id')}, function(err, rtv, mes, con){
					if(err){
						me.log(err);
						Modal.alert(0, err);
						target.html(oldHtml);
					}else{
						target.remove();
						me.uploadToggle().uploadParseData();
					}
				});
			
			}
		},
		initProps: function(){
			var me = this,
				nodeMap,
				triggerNode = me.triggerNode,
				fileRewrite = me.jQuery(me.get('fileRewrite'));
			//设置trigger
			me.set('trigger', triggerNode);
			//设置父亲节点
			me.set('parentNode', fileRewrite.length ? fileRewrite : triggerNode.parent());
			//初始化节点
			nodeMap = me.nodeMap = {};
			//找到影子表单
			me.inputName = triggerNode.parent().find('[name="'+me.get('inputName')+'"]');
			//初始化上传组件
			me.nwUpload = me.initUpload();
			// me.nwUpload.destroy();
		},
		//初始化上传组件
		initUpload: function(){
			var me = this,
				nodeMap = me.nodeMap;
			return new nwUpload({
				trigger: me.triggerNode,
				name: me.get('name'),
				action: me.get('action'),
				accept: me.get('accept'),
				change: function(e){
					//console.log( this.get('input') );
					var name = e[0].name,
						rule = new RegExp(me.get('rule'), 'i');
					//验证格式
					me.log('log', '验证格式:', rule, '文件名称:', name, '验证结果:', rule.test(name));
					if(rule.test(name)){
						//开始上传
						var node = me.tempNode = nodeMap[name] = $(TEMPLATE_WAITE());
						me.tempName = name;
						me.element.append(node);
						this.submit();
					}else{
						me.resetUpload();
						return Modal.alert(0, me.get('ruleErrMsg') || '上传格式不正确');
					}
				},
				success: function(response){
					var content;
					if(response){
						response = JSON.parse(response);
						content = response.content;
						if(!response.hasError && content.isSuccess){
							response = content.retValue;
							var node,
								fileName = response.fileName;
							if( !(node = nodeMap[fileName]) ){
								fileName = fixResponseFileName(nodeMap, fileName);
								node = nodeMap[fileName];
							}
							node.replaceWith(TEMPLATE_ONE({
								id: response.securityId,
								name: response.fileName,
								url: response.url
							}));
							delete nodeMap[fileName];
							
							//上传完成 触发事件
							me.trigger('success', response);
							//IE9-以下
							if(documentMode && documentMode <= 9){
								me.resetUpload();
							}
							//确认是否显示隐藏
							me.uploadToggle().uploadParseData();
						}else{
							Modal.alert(0, response.content.message);
							me.tempNode.remove();
							delete nodeMap[me.tempName];
						}
						
					}else{
						me.log('上传失败。');
						me.tempNode.remove();
						delete nodeMap[me.tempName];
					}
				}
			});
		},
		// 重新设置上传组件
		resetUpload: function(){
			var me = this;
			clearInterval( me.nwUpload.get('runner') );
			me.nwUpload.destroy();
			me.nwUpload = me.initUpload();
			return me;
		},
		//入口
		setup: function(){
			var me = this;
			//初始化文件dom
			me.render();
			//渲染LIST
			me.uploadRenderList();
		},
		//销毁
		destroy: function(){
			var me = this;
			clearInterval( me.nwUpload.get('runner') );
			me.nwUpload.destroy();
			Upload.superclass.destroy.call(me);
		},
		//渲染list
		uploadRenderList: function(){
			var me = this,
				list = [].concat(me.get('list'));
			me.element.append( TEMPLATE_LIST(list) );
			me.uploadToggle();
			return me;
		},
		//清楚
		uploadRenderClear: function(){
			var me = this,
				inputName = me.inputName;
			me.element.empty();
			inputName.val('');
			me.uploadToggle();
			return me;
		},
		//显隐
		uploadToggle: function(){
			var me = this,
				nwUpload = me.nwUpload,
				size = me.get('size');
			// console.log(nwUpload, me.$('.JS-target-item').length, size);
			if(me.$('.JS-target-item').length >= size){
				nwUpload.get('form').hide();
			}else{
				nwUpload.get('form').show();
			}
			return me;
		},
		//数据
		uploadParseData: function(){
			var me = this,
				inputName = me.inputName;
			inputName.val(me.serialize(me.element).UploadFileInput);
			inputName.trigger('blur');
			return me;
		},
		//静态属性
		Statics: {
			use: function(query, config){
				var me = this,
					list = [];
				$(query).each(function(){
					var self = $(this);
					list.push( new me( $.extend({
						trigger: this
					}, config) ) );
				});
				return list;
			},
			remove: function(query){
				$(query).each(function(){
					var self = $(this);
					self.data('myWidget').destroy();
				});
			}
		}

	});

	//函数：由于IE89 name 是 c:\xxx\xxx\ddd.jpg
	function fixResponseFileName(nodeMap, name){
		var rtv;
		name = name.split('.')[0];
		MyWidget.breakEachObj(nodeMap, function(val, key){
			if(key.indexOf(name) !== -1){
				rtv = key;
				return true;
			}
		});
		return rtv;
	}

	return Upload

});
