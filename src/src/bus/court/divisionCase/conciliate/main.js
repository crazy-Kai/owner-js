define(function(require, exports, module) {

    require('bus/global/main');
    //依赖
    var $ = require('$'),
        Upload = require('model/upload/main'),
        delegate = require('common/delegate'),
        Validator = require('common/validator'),
        Modal = require('model/modal/main'),
        Ajax = require('model/ajax/main');

    var validatorExp = Validator.use('#mediate-form');
    
    delegate.on('click', '.JS-trigger-click-save', function(){
        handleAction();
    });

    var uploadExp = Upload.use('.JS-trigger-click-upload');

    function handleAction(){
        if($("[name=conciliateFileIds]").val()){
            new Ajax({
                request: "/court/conciliateRpc/saveConciliate.json?",
                paramName: "paramMap",
                parseForm: $("#conciliate-form")
            }).on('ajaxSuccess', function(rtv, msg, con){
                location.reload();
            }).submit();
        }else{
            Modal.alert(0, "请上传调解书");
            return;
        }
    }

});
