define(function(require, exports, module) {

	//依赖
    var $ = require('$'),
        Dialog = require('common/dialog'),
        Ajax = require('model/ajax/main');

    //事件：撤销记录查看详情
    new Ajax({
		element: '#page-form',
		request: '/court/LassenSuitObjectionRpc/querySuitObjection.json',
		autoDestroy: false,
		events: {
			'click .JS-trigger-click-objects': function(e){
				var me = this,
					self = $(e.target);
				me.set('param', self.data('param'));
				this.submit();
			}
		},
		onAjaxSuccess: function(rtv, msg, res){
			Dialog.showTemplate('#template-object', rtv, {width:420});
		}
	});
            
 });
