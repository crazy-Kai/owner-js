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
		MyWidget = require('common/myWidget'),
		Tab = require('model/tab/main'),
		CountDown = require('model/countDown/main'),
		PerSearch = require('model/perSearch/main'),
		ImgView = require('model/imgView/main');

	// 业务类
	var EvidenceOppugnEnd = MyWidget.extend({
		// 类名
		clssName: 'EvidenceOppugnEnd',
		// 配置
		attrs: {
			element: 'body',
			fixClassName: 'go-nav-fix'
		},
		// 事件委派
		events: {

		},
		// 私有属性
		initProps: function(){
			var me = this;
			// 切换
			me.evidenceOppugnNav = me.$('#evidenceOppugnNav');
			// 上偏移
			var offset = me.evidenceOppugnNav.offset() || {};
			me.tabTop = offset.top || 0;
			// 切换
			me.tabExp = new Tab({element: '#evidenceOppugnMain'}).on('chose', function(){
				$(window).trigger('scroll');
				if(me.winScrollY() > me.tabTop){
					me.winScrollY(me.tabTop);
				};
			});
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
					me.evidenceOppugnNav.addClass(me.get('fixClassName'));
				}else{
					me.evidenceOppugnNav.removeClass(me.get('fixClassName'));
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
				node.html('<span class="fn-color-F00">'+data.day+'</span>天 <span class="fn-color-F00">'+data.hour+'</span>时 <span class="fn-color-F00">'+data.minute+'</span>分 <span class="fn-color-F00">'+data.second+'</span>秒</span>' );
			}, 1000);
			return me;
		}
	});

	// 接口
	module.exports = EvidenceOppugnEnd;

});