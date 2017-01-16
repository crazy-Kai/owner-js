define(function(require, exports, module) {

    require('bus/global/main');
	//依赖
    var $ = require('$'),
        delegate = require('common/delegate'),
        Dialog = require('common/dialog'),
        Modal = require('model/modal/main');


    function beZero (num) {
        return num < 10 ? '0' + num : num;
    }
    function format (date) {
        return date.getFullYear(date) + '-' + beZero(date.getMonth() + 1) + '-' + beZero(date.getDate()) + ' ' + beZero(date.getHours()) + ':' + beZero(date.getMinutes());
    }
    
    //事件：查看详情
    delegate.on('click', '.JS-trigger-click-detail', function(){
        var tr = $(this).closest('tr'),
            data = tr.data('json') || tr.attr('data-json');

        data.applyTimeEx = data.applyTime && format(new Date(data.applyTime));

        if (!data.deal) {
            Dialog.showTemplate('#template-wait', data, {width:400});
        } else {
            Dialog.showTemplate('#template-detail', data, {width:400});
        }
        
    });



    $(document).on('click', '#submit-wait', function (e) {
        e.preventDefault();

        var self = this;
        var table = $(this).closest('table');
        var save = {};

        table.find('select, textarea').each( function () {
            save[$(this).attr('name')] = $.trim($(this).val());
        });

        if (save.opinion && save.opinion.replace(/[^x00-xff]/g,"xx").length > 1000) {
            Modal.alert(0, "意见的字符长度不能超过1000");
            return;
        }


        $.ajax({
            type: 'POST',
            url: '/court/LassenSuitObjectionRpc/editSuitObjection.json?securityCaseId='+encodeURIComponent($("input[name='securityCaseId']").val()),
            data: {objectionDo: JSON.stringify(save)}
        }).done( function (res) {

            $(self).closest('.kuma-dialog').find('.kuma-dialog-close').click();

            if (res.hasError) {
                Modal.alert(0, res.errors[0].msg);
            } else {
                if(!res.content.isSuccess){
                    Modal.alert(0, res.content.message);
                }else{
                    Modal.alert(1, '提交成功');
                    setTimeout(function(){
                       location.reload();
                    }, 300);
                };
               
            }
        });
    });
    
});
