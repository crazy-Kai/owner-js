"use strict";
/**
 * 业务
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//依赖
	var $ = require('$'),
		Upload = require('model/upload/main'),
		SearchList = require('model/searchList/main'), //查询列表
		Modal = require('model/modal/main'), //提示框
		Selectpicker = require('model/selectpicker/main'),//单选，多选
		ModalEditor = require('model/modalEditor/main'),//弹出编辑框
		Imgareaselect = require('alinw/imgareaselect/1.0.1/imgareaselect'), //图片编辑
		tinymceUse = require('common/tinymce');//编辑器

	//组件:编辑器
	tinymceUse({selector: '#content'});

	//组件:查询列表
	var searchListExp = SearchList.use('.searchList', {
		onDeleteSuccess: function(rtv, msg, response, target){
			doSucess(msg);
		},
		onEditorSuccess: function(rtv, msg, response, target){
			modalEditorExp.set('title', target.prop('title'));
			//回写表单的值
			modalEditorExp.modalEditorWriteback(response.retValue);
			//点击编辑后的内容回写
			modalEditorExp.set('title', target.prop('title'));
			rtv.id = rtv.securityId;
			modalEditorExp.modalEditorWriteback(rtv);
			//回写上传信息
			if(rtv.newsMap){
				uploadExp[0] && uploadExp[0].set('list', {
					id: rtv.newsMap.securityId,
					name: rtv.newsMap.fileName,
					url: rtv.newsMap.url
				});
			}else{
				uploadExp[0] && uploadExp[0].set('list', []);
			}
			
			uploadExp[0] && uploadExp[0].uploadRenderList();

			//设置编辑器的值
			setTinymceVal();
		}
	});

	var width = 530,
		height  = 290,
		imgOption = {},
		imgShearsModal = $('#imgShearsModal'),
		imgShears = $('#imgShears'),
		shearX = $('[name="shearX"]'),	//首点的X
		shearY = $('[name="shearY"]'),	//首点的Y
		shearWidth = $('[name="shearWidth"]'),
		shearHeight = $('[name="shearHeight"]'),
		ratio = $('[name="ratio"]'),
		imgShowModal = $('#imgShowModal'),
		imgShow = $('#imgShow');

	// 图片查看
	$('body').on('click', '[data-rule="imgView"]', function(e){
		e.preventDefault();
		imgShowModal.modal();
		imgShow.prop('src', this.href);
	});

	// 关闭图片查看
	$('body').on('click', '[data-role="closeImgShow"]', function(){
		imgShowModal.modal('hide');
	});

	// 图片剪切确定回调
	$('body').on('click', '[data-role="shearDown"]', function(){
		imgShearsModal.modal('hide');
		// 
	});

	function openCloseInput(flag){
		shearX.prop('disabled', flag);
		shearY.prop('disabled', flag);
		shearWidth.prop('disabled', flag);
		shearHeight.prop('disabled', flag);
		ratio.prop('disabled', flag);
	}

	// 弹出层注册事件
	imgShearsModal.on('hide.bs.modal', function(){
		// 消失后隐藏图片切个的控件
		imgShears.imgAreaSelect({hide: true});
		shearX.val(imgOption.shearX);
		shearY.val(imgOption.shearY);
		shearWidth.val(imgOption.shearWidth);
		shearHeight.val(imgOption.shearHeight);
		ratio.val(imgOption.ratio);
		openCloseInput(false);
	});
	
	// 注册弹出层显示之后的事件
	imgShearsModal.on('shown.bs.modal', function(){
		// 消失后隐藏图片切个的控件
	});

	// 
	imgShears.on('load', function(){
		$.extend(imgOption, { ratio: mainWidth/imgShears.width(), shearWidth: width, shearHeight: height, shearX: 0, shearY: 0 });
		if(imgOption.ratio > 1){
			imgShears.imgAreaSelect({ 
				minWidth: width, minHeight: height, 
				x1:0, y1:0,
				x2:width ,y2:height,
				resizable: false,
				show: true,
				onSelectEnd: function(img, opt){
					console.log(opt);
					$.extend( imgOption, { shearX: opt.x1, shearY:opt.y1 } );
				}
			});
		};
		
	});

	// 初始化上传控件
	var uploadExp = Upload.use('.JS-trigger-click-upload', {imgView: true});

	var mainWidth;
	// 注册上传后的事件
	uploadExp[0] && uploadExp[0].on('success', function(response){
		var img  = new Image();
		img.onload = function(){
			img.onload = null;
			var $img = $(img);
			mainWidth = $img.appendTo('body').width();
			$img.remove();
			imgShears.prop('src', response.url);
			imgShearsModal.modal({backdrop: 'static'});
		};
		img.src = response.url;
	});

	//组件:多选
	Selectpicker.use('.selectpicker');

	//组件:弹出编辑框
	var modalEditorExp = new ModalEditor({trigger: '#addMedoatpr', element: '#medoatprModal'})
	//成功保存
	.on('modalEditorSuccess', function(rtv, msg, response){
		doSucess(msg);
	})
	.after('modalEditorReset', function(){
		uploadExp[0] && uploadExp[0].uploadRenderClear();
		// 重置表单
		openCloseInput(true);

	})
	//验证之前
	.before('modalEditorExecute', function(){
		var me = this,
			content = tinymce.get("content").getContent();
		if(content.length > 15000){
			Modal.alert(0, '输入的字符太长，请输入15000之内。');
			return false;
		}
		//设置编辑器的值
		me.$('#content').val(content);
	})
	//重置表单之后
	.after('modalEditorReset', function(){
		var me = this;
		//设置编辑器的值
		setTinymceVal();
	});

	// 函数:成功后的回调
	function doSucess(msg){
		Modal.alert('成功', msg);
		searchListExp[0].searchListReload();
	}

	// 函数:设置编辑器的值
	function setTinymceVal(){
		//设置编辑器的值
		tinymce.get("content").setContent($('#content').val());
	}

	

});