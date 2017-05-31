"use strict";
/**
 * 业务：线下实名认证
 */
define(function(require, exports, module) {

    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');

    //依赖
    var $ = require('$'),
        util = require('common/util'),
        Modal = require('model/modal/main'), //提示框
        Ajax = require('model/ajax/main'),
        Dialog = require('common/dialog'),
        SwitchFilterBtn = require('model/switchFilterBtn/main'),
        delegate = require('common/delegate'),
        viewtemplateHbs = require('./viewtemplate-hbs'),
        SearchList = require('model/searchList/main'),
        CertificationOnsiteEdit = require('./certificationOnsiteEdit');

    var statusMap = require('common/statusMap');

    $.ajaxSetup({ cache: false });

    //组件：查询
    var searchListExp = SearchList.use('.searchList', {
        map: function(data) {
            var i = 0;
            for (; i < data.length; i++) {
                if (data[i].status) {
                    data[i].statusEx = statusMap[data[i].status];
                    data[i].amount = util.formatMoney(data[i].amount, 2);
                }
            }
            return data;
        }
    });

    //添加事件
    delegate.on('click', '#search', function() {
        doSearch();
    });

    //过滤条件
    function doSearch() {
        searchListExp[0].searchListReload();
    }

    new SwitchFilterBtn({ element: '#filterCondition' }).on('switchSuccess', function() {
        doSearch();
    });

    //查看
    delegate.on('click', '[data-role="view"]', function(element) {
        new Ajax({
            request: '/account/certificationOnsiteRpc/queryCertificationInfoById.json',
            param: $(element.target).data("param")
        }).on('ajaxSuccess', function(rtv, msg, con) {
            var dialog = Dialog.show(viewtemplateHbs(rtv), { width: 500 });
        }).submit();
    });

    //修改
    delegate.on('click', '[data-role="editor"]', function(element) {
        var role = $(element.target).data("role");
        var idObj = $(element.target).data("param");
            new Ajax({
                request: '/account/certificationOnsiteRpc/queryCertificationInfoById.json', //根据ID获取account信息,用来填充弹出表单
                param: $(element.target).data("param")
            }).on('ajaxSuccess', function(rtv, msg, con) {
                //身份证正反面，营业执照值上传原图和缩略图
                if(rtv && rtv.uploadFileBackDoList && rtv.uploadFileBackDoList[0] && rtv.uploadFileBackDoList[0].securityId){
                    var id = (rtv && rtv.uploadFileMinBackDoList && rtv.uploadFileMinBackDoList[0] && rtv.uploadFileMinBackDoList[0].securityId ? ("," + rtv.uploadFileMinBackDoList[0].securityId) : "")
                    rtv.uploadFileBackDoList[0].securityIds = rtv.uploadFileBackDoList[0].securityId + id;
                }

                if(rtv &&  rtv.uploadFileFrontDoList &&  rtv.uploadFileFrontDoList[0] && rtv.uploadFileFrontDoList[0].securityId){
                    var id = (rtv && rtv.uploadFileMinFrontDoList && rtv.uploadFileMinFrontDoList[0] && rtv.uploadFileMinFrontDoList[0].securityId ? ("," + rtv.uploadFileMinFrontDoList[0].securityId) : "")
                    rtv.uploadFileFrontDoList[0].securityIds = rtv.uploadFileFrontDoList[0].securityId + id;
                }

                if(rtv &&  rtv.uploadFileLicenseDoList &&  rtv.uploadFileLicenseDoList[0] && rtv.uploadFileLicenseDoList[0].securityId){
                    var id = (rtv && rtv.uploadFileMinLicenseDoList && rtv.uploadFileMinLicenseDoList[0] && rtv.uploadFileMinLicenseDoList[0].securityId ? ("," + rtv.uploadFileMinLicenseDoList[0].securityId) : "")
                    rtv.uploadFileLicenseDoList[0].securityIds = rtv.uploadFileLicenseDoList[0].securityId + id;
                }
                new CertificationOnsiteEdit({ role: role, rtv: rtv }).on('submitSuccess', doSearch);
            }).submit();
    });
    //删除
    delegate.on('click', '[data-role="delete"]', function(element) {
        Modal.confirm("删除", "您确定要删除吗?", function() {
            new Ajax({
                request: '/account/certificationOnsiteRpc/deleteAccountInfoById.json',
                param: $(element.target).data("param")
            }).on('ajaxSuccess', function(rtv, msg, con) {
                Modal.alert(1);
                doSearch();
            }).submit();
        }, function() {

        });
    });

    //新增
    $('#JS-addNewAcount').on('click', function() {
        new CertificationOnsiteEdit().on('submitSuccess',doSearch);
    });
});
