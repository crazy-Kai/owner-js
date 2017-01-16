"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

	//默认依赖一个全局都引用的业务模块
	require('bus/global/main');

	//依赖
	var Validator = require('common/validator'),
        pageCheck = $('#page-check'),
        Ajax = require('model/ajax/main'),
        Modal = require('model/modal/main'),
        Upload = require('model/upload/main'),
        PerChecked = require('model/perChecked/main'),
        ImgView = require('model/imgView/main'),
        AddLawyer = require('model/addLawyer/main');

    // 组件：图片查看
    new ImgView();
    
	//组件：验证
	var validatorExp = Validator.use('#page-param');

    //组件：上传
    Upload.use('.JS-need-upload');
    
    // 组件：添加代理人
    new AddLawyer();

    //组件确认
    if(pageCheck.length){
        new PerChecked({
            element: pageCheck
        }).after('psCheckedNext', function(flag){
            var me = this;
            //可以提交
            if(flag){
                //组件：提交
                new Ajax({
                    element: '#page-param',
                    paramParse: function(json){
                        for(var i in json){
                            if( json[i].indexOf('*') !== -1 ){
                                delete json[i];
                            }
                        }
                        return json;
                    },
                    events: {
                        'click .JS-trigger-click-submit': function(){
                            var meAjax = this;
                            hideSomeInput();
                            validatorExp.execute(function(flag){
                               showSomeInput();
                               if(!flag){
                                     Modal.confirm('提示 ', '提交后无法修改，确认提交么？', function(){
                                        meAjax.submit();
                                    }, function(){
                                        meAjax.destroy();
                                    });
                                }
                           });
                        }
                    }
                }).on('ajaxSuccess', function(){
                    location.reload(true)
                })
            }
        });
    }


    function hideSomeInput(){
        $('#page-param [type="text"]').each(function(){
           hideSecretInput($(this));
        });
    };
    
    function showSomeInput(){
        $('#page-param [type="text"]').removeClass('fn-hide');
    };

    function hideSecretInput(node){
        var val = node.val(),
            dVal = node.prop('defaultValue');
        // 如果内容存在，且和默认值相等就直接隐藏
        if( val && val === dVal ){
            console.log('hideSecretInput hide')
            node.addClass('fn-hide');
        };
    };


    $('#page-param').find('table').on('blur', 'input[type="text"]', function(){
        hideSecretInput($(this));
    });
    $('body').on('blur', 'input[type="text"]', function(){
        $(this).removeClass('fn-hide');
    });


});