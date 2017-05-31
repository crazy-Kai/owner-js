"use strict";
/**
 * 业务：质证
 * 2015,09,02 邵红亮
 */
define(function(require, exports, module) {

	// 默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	// 依赖
	var $ = require('$'),
		Reply = require('./reply'),
		Tab = require('model/tab/main'),
		CountDown = require('model/countDown/main'),
		Ajax = require('model/ajax/main'),
		PerSearch = require('model/perSearch/main'),
		Handlerbars = require('common/handlerbars'),
		ImgView = require('model/imgView/main');

	// 业务类
	var EvidenceOppugn = Reply.extend({
		// 类名
		clssName: 'EvidenceOppugn',
		// 配置
		attrs: {
			element: 'body'
		},
		// 事件委派
		events: {

		},
		// 私有属性
		initProps: function(){
			var me = this;
			EvidenceOppugn.superclass.initProps.call(me);
			// 切换
			me.evidenceOppugnNav = me.$('#evidenceOppugnNav');
			// 上偏移
			var offset = me.evidenceOppugnNav.offset() || {};
			me.tabTop = offset.top || 0;
			// 切换
			me.tabExp = new Tab({element: '#evidenceOppugnMain', mainIndex:0}).on('chose', function(e, index, menu, list){
				$(window).trigger('scroll');
				if(me.winScrollY() > me.tabTop){
					me.winScrollY(me.tabTop);
				};
				if(index === 3){
					me.perSearchExp.searchListAjax();
				}else{
					var param = menu.data('param'),
						template = me['template'+param.source] || Handlerbars.compile( $(param.template).html() );
					me['template'+param.source] = template;
					// 局部刷星
					new Ajax({
						request: '/suit/evidenceOppugn/list.json',
						autoSubmit: true,
						param: menu.data('param'),
						paramName: 'map',
						onAjaxSuccess: function(rtv, msg, res){
							// 事实与理由
							if(index === 2){
								list.html( template(rtv) );
							}else{
								list.html( template(rtv[param.source]) );
							}
							
						}
					});
				};
				
			});
			// 证据：列表
			me.perSearchExp = new PerSearch({element: '#testimony', autoStart:false, mapResponse: function(response){
				return response.retValue.EVIDENCE;
			}, map: function(data){
				// 对附件做一些处理
				me.breakEachArr(data, function(val){
					if(val && val.value && val.value.uploadFileDos){
						var arr = val.value.uploadFile = [],
							lastArr;
						me.breakEachArr(val.value.uploadFileDos, function(fileVal, key){
							// 最多是10个
							if(key > 9) return true;
							// 被5整除的时候初始化
							if(key % 5 === 0) lastArr = [], arr.push(lastArr);
							// 塞入值
							lastArr.push(fileVal);
						});
					};
				});
				return data;
			}});
			
			// 图片显示
			me.imgViewExp = new ImgView();
		},
		// 启动
		setup: function(){
			var me = this;
			// 定时器
			me.setCountDown();
			// 绑定滚动条事件
			me.delegateEvents(window, 'scroll', function(){
				if( me.winScrollY() > me.tabTop ){
					me.evidenceOppugnNav.addClass('go-nav-fix');
				}else{
					me.evidenceOppugnNav.removeClass('go-nav-fix');
				};
			});
			$(window).trigger('scroll');
		},
		// 销毁
		destroy: function(){
			var me = this;
			// 销毁切换
			me.tabExp.destroy();
			// 销毁图片
			me.imgViewExp.destroy();
			// 父类的销毁
			EvidenceOppugn.superclass.destroy.call(me);
		},
		// 定时器
		setCountDown: function(){
			var me = this,
				node = me.$('.JS-need-count-down'),
				endTime = node.data('endTime'),
				countDownExp = new CountDown({
					target: endTime
				}),
				intervalID;
			//定时器
			intervalID = setInterval(function(){
				var data = countDownExp.use();
				//不存在 干掉定时器
				if(!data){
					return clearInterval(intervalID)
				}
				node.html( data.day + '天' );
			}, 1000);
			return me;
		}
	});

	// 接口
	module.exports = EvidenceOppugn;

});