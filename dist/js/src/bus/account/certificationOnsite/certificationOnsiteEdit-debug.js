"use strict";
define("src/bus/account/certificationOnsite/certificationOnsiteEdit-debug", ["common/jquery-debug", "common/myWidget-debug", "model/modal/main-debug", "common/validator-debug", "common/calendar-debug", "common/util-debug", "common/promise-debug", "common/limit-debug", "common/limit-dom-debug", "common/domUtil-debug", "common/handlerbars-debug", "model/ajax/main-debug", "model/upload/main-debug", "model/imgView/main-debug", "src/bus/account/certificationOnsite/edittemplate-hbs-debug"], function(require, exports, module) {
    function renderUpladListByFileListDo(rtv) {
        var me = this,
            arr = ["uploadFileBackDoList", "uploadFileFrontDoList", "uploadFileLicenseDoList"],
            map = {
                uploadFileLicenseDoList: "fileLicenseIds",
                uploadFileFrontDoList: "fileFrontIds",
                uploadFileBackDoList: "fileBackIds"
            };
        limit.each(arr, function(val, key) {
            var uploadExp, doList = rtv && rtv[val];
            uploadExp = MyWidget.getWidget(me.$('[data-input-name="certificationOnsiteDto.' + map[val] + '"]')), uploadExp.uploadRenderClear(), doList && (uploadExp.set("list", limit.map(doList, function(val, key) {
                return me[map[val]] = val.securityId, {
                    id: val.securityId,
                    name: val.fileName,
                    url: val.url
                }
            })), uploadExp.uploadRenderList())
        })
    }

    function changeShow(type) {
        type = type || "normal";
        var me = this,
            showCls = "normal" === type ? "#item-normal" : "#item-legal",
            hideCls = "normal" === type ? "#item-legal" : "#item-normal",
            checkRadioId = "normal" === type ? "#radio-normal" : "#radio-legal";
        me.$(hideCls).addClass("fn-hide").find("input").prop("disabled", !0), me.$(showCls).removeClass("fn-hide").find("input").prop("disabled", !1), me.$(checkRadioId).prop("checked", !0)
    }

    function getAddress(rtv) {
        var type = rtv && rtv.certType,
            me = this;
        type = type || "normal";
        var map = {
                normal: "lassenAccountNormalDo",
                company: "lassenAccountLegalpersonDo"
            },
            currentInfo = rtv && rtv[map[type]];
        for (var key in currentInfo) "securityId" !== key && me.$('input[name="certificationOnsiteDto.' + key + '"]').val(currentInfo[key])
    }

    function getInfo(rtv) {
        var me = this;
        for (var key in rtv) {
            var selectorName = 'input[name="certificationOnsiteDto.' + key + '"]',
                item = me.$(selectorName).not(":radio");
            "expireDateStart" === key || "expireDateEnd" === key ? me.timeToDate(rtv[key], item) : item.val(rtv[key])
        }
    }

    function createCalendar(rtv) {
        var type, start, end, me = this;
        type = rtv && rtv.certType, start = rtv && rtv.expireDateStart && me.timeToDate(rtv.expireDateStart), end = rtv && rtv.expireDateEnd && me.timeToDate(rtv.expireDateEnd), start = start || null, end = end || null, type = type || "normal";
        var map = {
                normal: "#item-normal",
                company: "#item-legal"
            },
            key = "has-calendar-" + type;
        me.get(key) || (me[type + "-dateStart"] = new Calendar({
            trigger: map[type] + " .submit-date-fr",
            clearBtn: ".JS-reset-calendar",
            range: [null, end]
        }).on("selectDate", function(date) {
            me[type + "-dateEnd"].range([date, null])
        }), me[type + "-dateEnd"] = new Calendar({
            trigger: map[type] + " .submit-date-to",
            clearBtn: ".JS-reset-calendar",
            range: [start, null]
        }).on("selectDate", function(date) {
            me[type + "-dateStart"].range([null, date])
        }), me.set(key, !0))
    }
    var $ = require("common/jquery-debug"),
        MyWidget = require("common/myWidget-debug"),
        Modal = require("model/modal/main-debug"),
        Validator = require("common/validator-debug"),
        Calendar = require("common/calendar-debug"),
        util = require("common/util-debug"),
        limit = require("common/limit-debug"),
        Ajax = (require("common/domUtil-debug"), require("model/ajax/main-debug")),
        Upload = require("model/upload/main-debug"),
        ImgView = require("model/imgView/main-debug");
    new ImgView;
    var edittemplateHbs = require("src/bus/account/certificationOnsite/edittemplate-hbs-debug"),
        CertificationOnsiteEdit = MyWidget.extend({
            clssName: "CertificationOnsiteEdit",
            attrs: {
                data: {},
                rtv: {
                    certType: "normal"
                },
                template: {
                    getter: function() {
                        return edittemplateHbs(this.get("rtv"))
                    }
                }
            },
            events: {
                "click .cert-legal": function() {
                    var me = this,
                        rtv = me.get("rtv");
                    rtv.certType = "company", me.$('input[type="text"]').not('[name="certificationOnsiteDto.openaccountId"]').val(""), changeShow.call(me, "company"), renderUpladListByFileListDo.call(me, me.get("rtv")), createCalendar.call(me, me.get("rtv")), me.$('input[type=hidden][name="certificationOnsiteDto.certType"]').val("company")
                },
                "click .cert-normal": function() {
                    var me = this,
                        rtv = me.get("rtv");
                    rtv.certType = "normal", me.$('input[type="text"]').not('[name="certificationOnsiteDto.openaccountId"]').val(""), createCalendar.call(me, me.get("rtv")), changeShow.call(me, "normal"), renderUpladListByFileListDo.call(me, me.get("rtv")), me.$('input[type=hidden][name="certificationOnsiteDto.certType"]').val("normal")
                },
                "click .submit-btn": function() {
                    var me = this,
                        oldVal = me.get("rtv"),
                        tmpVal = {};
                    tmpVal.fileLicenseIds = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].uploadFileLicenseDoList && oldVal.data[0].uploadFileLicenseDoList[0] && oldVal.data[0].uploadFileLicenseDoList[0].securityId, tmpVal.fileFrontIds = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].uploadFileFrontDoList && oldVal.data[0].uploadFileFrontDoList[0] && oldVal.data[0].uploadFileFrontDoList[0].securityId, tmpVal.fileBackIds = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].uploadFileBackDoList && oldVal.data[0].uploadFileBackDoList[0] && oldVal.data[0].uploadFileBackDoList[0].securityId, tmpVal.fileLicenseIds = tmpVal.fileLicenseIds ? tmpVal.fileLicenseIds : oldVal && oldVal.uploadFileLicenseDoList && oldVal.uploadFileLicenseDoList[0] && oldVal.uploadFileLicenseDoList[0].securityId, tmpVal.fileFrontIds = tmpVal.fileFrontIds ? tmpVal.fileFrontIds : oldVal && oldVal.uploadFileFrontDoList && oldVal.uploadFileFrontDoList[0] && oldVal.uploadFileFrontDoList[0].securityId, tmpVal.fileBackIds = tmpVal.fileBackIds ? tmpVal.fileBackIds : oldVal && oldVal.uploadFileBackDoList && oldVal.uploadFileBackDoList[0] && oldVal.uploadFileBackDoList[0].securityId, tmpVal.securityId = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].securityId, tmpVal.securityId = tmpVal.securityId ? tmpVal.securityId : oldVal && oldVal.securityId, me.validatorExp.execute(function(err, errList) {
                        if (err) util.log(errList);
                        else {
                            new Ajax({
                                request: "/account/certificationOnsiteRpc/saveCertificationInfo.json",
                                parseForm: me.element,
                                param: {
                                    certificationOnsiteDtoTemp: tmpVal
                                },
                                paramName: "paramMap",
                                paramParse: function(json) {
                                    return json.certificationOnsiteDto.fileBackIds && (json.certificationOnsiteDto.fileBackIds = json.certificationOnsiteDto.fileBackIds.split(",")[0]), json.certificationOnsiteDto.fileFrontIds && (json.certificationOnsiteDto.fileFrontIds = json.certificationOnsiteDto.fileFrontIds.split(",")[0]), json.certificationOnsiteDto.fileLicenseIds && (json.certificationOnsiteDto.fileLicenseIds = json.certificationOnsiteDto.fileLicenseIds.split(",")[0]), json
                                }
                            }).on("ajaxSuccess", function(rtv, msg, con) {
                                me.trigger("submitSuccess"), Modal.alert(1, msg), me.modalExp.hide()
                            }).submit()
                        }
                    })
                },
                "blur .JS-register": function() {
                    var me = this,
                        explain = me.$(".JS-register").siblings(".kuma-form-explain");
                    if (0 === explain.children().length) {
                        var register = me.$(".JS-register").val();
                        if (register === me.get("openaccountIdOld")) return;
                        "" !== register && (new Ajax({
                            request: "/account/certificationOnsiteRpc/queryCertificationInfo.json",
                            paramName: "filterMap",
                            param: {
                                openaccountId: register,
                                isLostFocus: "y"
                            }
                        }).on("ajaxSuccess", function(rtv, msg, con) {
                            var tip = "",
                                flag = 0,
                                shortTip = me.$("#check-register"),
                                longTip = me.$("#can-modify"),
                                submitBtn = me.$("input[type=button]");
                            submitBtn.off("click", me.disableClick).removeClass("fn-btn-disabled"), shortTip.empty(), longTip.empty(), submitBtn.prop("disabled", !1), me.set("rtv", rtv);
                            var status = rtv.data && rtv.data[0] && rtv.data[0].status;
                            me.$(":radio").prop("disabled", !1);
                            var isTest = rtv.data[0] && rtv.data[0].isTest,
                                oldIsTest = $('[name="oldIsTest"]').val();
                            if (isTest && isTest !== oldIsTest && (tip = '<div style="line-height:30px;color:red">该账号不能使用，请换个账号重试！</div>', flag = 1), 1 !== flag) {
                                "certification" === status ? (tip = '<span><i class="kuma-icon kuma-icon-error fn-VAMiddle"></i> 已实名<span>', me.$(":radio").prop("disabled", !0)) : tip = "normal" === status ? '<span style="color:#88d05c"><i class="kuma-icon kuma-icon-success fn-VAMiddle"></i> 已注册</span>' : '<span style="color:#88d05c"><i class="kuma-icon kuma-icon-success fn-VAMiddle"></i> 未注册</span>';
                                var type = rtv.data[0] && rtv.data[0].type;
                                type && "normal" !== type && "legalPerson" !== type && (tip = '<div style="line-height:30px;color:red">该账号不是当事人账号，请换个账号重试！</div>', flag = 1)
                            }
                            flag ? longTip.html(tip) && submitBtn.on("click", me.disableClick).addClass("fn-btn-disabled") : shortTip.html(tip), me.$('input[type="text"]').not('[name="certificationOnsiteDto.openaccountId"]').val(""), me.$('input[type="hidden"]').val(""), 1 !== flag && me.rtvToData(rtv.data[0])
                        }).submit(), me.set("openaccountIdOld", register))
                    }
                }
            },
            initProps: function() {},
            setup: function() {
                var me = this,
                    rtv = me.get("rtv"),
                    status = rtv.status,
                    type = rtv && rtv.certType,
                    role = me.get("role");
                type = type || "normal", me.modalExp = Modal.show(me.element, {
                    width: 450
                }).before("hide", function() {
                    me.destroy()
                }), "editor" === role && (status && "normal" === status ? me.disableOpenaccountId() : status && "certification" === status && me.disableNameType()), changeShow.call(me, type), createCalendar.call(me, rtv), me.validatorExp = Validator.use("#certificationOnsiteAdd-form"), me.upload = Upload.use(".JS-need-upload")
            },
            destroy: function() {
                var me = this;
                me["normal-dateStart"] && me["normal-dateStart"].destroy(), me["normal-dateEnd"] && me["normal-dateEnd"].destroy(), me["company-dateStart"] && me["company-dateStart"].destroy(), me["company-dateEnd"] && me["company-dateEnd"].destroy(), me.validatorExp.destroy(), me.upload.forEach(function(item) {
                    item.destroy()
                }), CertificationOnsiteEdit.superclass.destroy.call(me)
            },
            disableNameType: function() {
                var me = this;
                me.$("input[type=text][name='certificationOnsiteDto.openaccountId']").prop("disabled", !0), me.$("input[type=radio][name='certificationOnsiteDto.certType']").prop("disabled", !0)
            },
            disableOpenaccountId: function() {
                var me = this;
                me.$("input[type=text][name='certificationOnsiteDto.openaccountId']").prop("disabled", !0)
            },
            rtvToData: function(rtv) {
                var me = this,
                    type = rtv && rtv.certType;
                getInfo.call(me, rtv), changeShow.call(me, type), renderUpladListByFileListDo.call(me, rtv), getAddress.call(me, rtv), createCalendar.call(me, rtv)
            },
            timeToDate: function(time, jQitem) {
                var dateString, d = new Date(time),
                    year = d.getFullYear(),
                    mon = d.getMonth() + 1,
                    date = d.getDate();
                return dateString = year + "-" + mon + "-" + date, jQitem && jQitem.val(dateString), dateString
            },
            disableClick: function() {
                return !1
            }
        });
    return CertificationOnsiteEdit
});
define("src/bus/account/certificationOnsite/edittemplate-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-BGC-FFF fn-color-666 fn-PaAl15">    <div class="global-tab fn-BBS-ebebeb">        <i></i>我的信息    </div>        <div>        <div id="certificationOnsiteAdd-form">            <table width="100%" class="fn-table fn-table-input fn-table-input-sm  fn-MT20">                 <tbody>                    <tr>                        <td align="right" valign="top" width="100" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                         注册手机号：</td>                        <td>                            <div class="kuma-form-item fn-PosRel">                                <input type="hidden" name="certificationOnsiteDto.securityId" data-skip-hidden="false" value={{securityId}} >                                <input type="hidden" name="certificationOnsiteDto.openaccountId" value="{{openaccountId}}"/>                                <input type="hidden" name="certificationOnsiteDto.certType" value="{{certType}}" />                                 <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required JS-register" value="{{openaccountId}}" data-required="true" data-rule="mobile" name="certificationOnsiteDto.openaccountId" data-errormessage-required="请填写手机号码" data-errormessage-mobile="请填写正确的手机号码" maxlength="11" placeholder="请填写手机号码"  />                                <span class="fn-PosAbs fn-ML10 fn-LH30 fn-color-F00" id="check-register"></span>                                <div id="can-modify"> </div>                            </div>                        </td>                    </tr>                    <tr class="cert-type-tr">                        <td align="right" valign="top" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                        身份类型：</td>                        <td class="fn-LH20">                            <label>                                <input type="radio" name="certificationOnsiteDto.certType" value="normal" {{#isEqual certType \'normal\'}} checked {{/isEqual}} {{#isFalse certType}} checked {{/isFalse}} class="fn-VA2D cert-normal" id="radio-normal"/>                                <span class="JS-need-tip" data-content="普通公民，个体户">自然人</span>                            </label>                            <label>                                <input type="radio" name="certificationOnsiteDto.certType" value="company" {{#isEqual certType \'company\'}} checked {{/isEqual}} class="fn-VA2D cert-legal" id="radio-legal"/>                                <span class="JS-need-tip" data-content="企业、事业单位、社会团体、民办非企业单位、党政及国家机关">法人</span>                            </label>                                                        </td>                    </tr>                    </tbody>                                        <tbody id="item-normal" {{#isEqual certType \'company\'}} class="fn-hide" {{/isEqual}}>                        <tr>                        <td align="right" valign="top" class="fn-LH30">                        <span class="global-require fn-VA1D">*</span>                         姓名：</td>                        <td>                         <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{certName}}" data-required="true" name="certificationOnsiteDto.certName" data-errormessage-required="请输入姓名" placeholder="请输入姓名" id="input-name" maxlength="200" />                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                         证件号码：</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{idcardNumber}}" data-required="true" data-rule="cardid" name="certificationOnsiteDto.idcardNumber" data-errormessage-required="请输入身份证号码" data-errormessage-cardid="请填写正确的身份证号码" placeholder="请输入身份证号码" id="input-idcard" maxlength="18" />                            </div>                        </td>                    </tr>                    <tr class="">                        <td align="right" valign="top" class="fn-LH25">                                                 身份证正面：</td>                        <td>                            <div class="kuma-form-item">                                <div>                                    <input type="button" class="fn-btn fn-btn-upload fn-btn-sm fn-W100 JS-need-upload" value="选择图片" data-style="{\'display\':\'inline-block\'}" data-size="1" data-rule="(.jpg|.jpeg|.png|.bmp)$" data-accept="image/jpg, image/jpeg, image/png, image/bmp" data-rule-err-msg="请上传后缀是jpg,jpeg,png,bmp的图片" {{#if uploadFileFrontDoList}} data-list="[{ \'id\' : \'{{uploadFileFrontDoList.[0].securityIds}}\' ,  \'name\' :  \'{{uploadFileFrontDoList.[0].fileName}}\' ,  \'url\' :  \'{{uploadFileFrontDoList.[0].url}}\' }]" {{/if}} data-img-view="true" data-input-name="certificationOnsiteDto.fileFrontIds">                                    <input type="hidden" name="certificationOnsiteDto.fileFrontIds" id="fileFrontIds" class="JS-target-required "                                                                                                         </div>                            </div>                        </td>                    </tr>                    <tr class="">                        <td align="right" valign="top" class="fn-LH25">                                                 身份证反面：</td>                        <td>                            <div class="kuma-form-item">                                <div>                                     <input type="button" class="fn-btn fn-btn-upload fn-btn-sm fn-W100 JS-need-upload" value="选择图片" data-style="{\'display\':\'inline-block\'}" data-size="1"                                      data-rule="(.jpg|.jpeg|.png|.bmp)$" data-accept="image/jpg, image/jpeg, image/png, image/bmp" data-rule-err-msg="请上传后缀是jpg,jpeg,png,bmp的图片"  {{#if uploadFileBackDoList}} data-list="[{ \'id\' : \'{{uploadFileBackDoList.[0].securityIds}}\' ,  \'name\' :  \'{{uploadFileBackDoList.[0].fileName}}\' ,  \'url\' :  \'{{uploadFileBackDoList.[0].url}}\' }]" {{/if}}  data-img-view="true" data-input-name="certificationOnsiteDto.fileBackIds">                                    <input type="hidden" name="certificationOnsiteDto.fileBackIds" id="fileBackIds" class="JS-target-required"                                                                         #data-errormessage="请上传身份证反面"                                     value="{{uploadFileBackDoList.[0].securityIds}}" />                                </div>                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                                                 证件有效日期:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-fr" name="certificationOnsiteDto.expireDateStart"                                                                                                                                  readonly="readonly" value="{{formatData \'yyyy-MM-dd\' expireDateStart}}">                                <span class="fn-ML10 fn-MR5">-</span>                                <input type="text" class=" fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-to" name="certificationOnsiteDto.expireDateEnd"                                                                                                                                  readonly="readonly"                                 value="{{formatData \'yyyy-MM-dd\' expireDateEnd}}">                                <a class="global-link fn-PL10 fn-LH24 JS-reset-calendar">清空</a>                            </div>                        </td>                    </tr>                    <tr class="">                        <td align="right" valign="top" class="fn-LH30">                                                 当前住址:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required"                                                                  name="certificationOnsiteDto.currentAddress"                                                                 placeholder="请输入本人居住地址" value="{{lassenAccountNormalDo.currentAddress}}"                                 maxlength="300" />                            </div>                        </td>                    </tr>                         <tr>                        <td></td>                        <td class="">                            <input type="button" class="fn-btn fn-btn-primary fn-FWB fn-W100 fn-LH25 fn-ML50 child-button submit-btn" id="" value="提交">                        </td>                    </tr>                    </tbody>                                        <tbody id="item-legal"  {{#isEqual certType \'normal\'}} class="fn-hide" {{/isEqual}}>                        <tr>                         <td align="right" valign="top" class="fn-LH30" >                         <span class="global-require fn-VA1D">*</span>                          公司名称:</td>                        <td>                         <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{certName}}" data-required="true"                                 name="certificationOnsiteDto.certName" data-errormessage-required="请输入公司名称" placeholder="请输入公司名称" id="input-name" maxlength="200" />                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                         证件号码：</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{idcardNumber}}"                                 data-required="true"                                 name="certificationOnsiteDto.idcardNumber"                                 data-errormessage-required="请输入营业许可证号码"                                 data-errormessage-credentials="请输入正确的营业许可证号码"                                 placeholder="请输入营业许可证号码" id="input-idcard"                                maxlength="18" />                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH25 ">                                                 证件照片:</td>                        <td>                            <div class="kuma-form-item">                                <div>                                    <input type="button" class="fn-btn fn-btn-upload fn-btn-sm fn-W100 JS-need-upload" value="选择图片" data-style="{\'display\':\'inline-block\'}" data-size="1" data-rule="(.jpg|.jpeg|.png|.bmp)$" data-accept="image/jpg, image/jpeg, image/png, image/bmp" data-rule-err-msg="请上传后缀是jpg,jpeg,png,bmp的图片"   {{#if uploadFileLicenseDoList}} data-list="[{ \'id\' : \'{{uploadFileLicenseDoList.[0].securityIds}}\' ,  \'name\' :  \'{{uploadFileLicenseDoList.[0].fileName}}\' ,  \'url\' :  \'{{uploadFileLicenseDoList.[0].url}}\' }]" {{/if}}  data-img-view="true" data-input-name="certificationOnsiteDto.fileLicenseIds" >                                    <input type="hidden" name="certificationOnsiteDto.fileLicenseIds" id="fileLicenseIds" class="JS-target-required" data-skip-hidden="false"                                                                         value="uploadFileLicenseDoList.[0].securityIds" />                                </div>                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                                                 证件有效日期:</td>                                              <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-fr" name="certificationOnsiteDto.expireDateStart" id="" data-errormessage="提交时间起始"  data-required="true" data-errormessage-required="请输入起始日期"  readonly="readonly" value="{{formatData \'yyyy-MM-dd\' expireDateStart}}">                                <span class="fn-ML10 fn-MR5">-</span>                                <input type="text" class=" fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-to" name="certificationOnsiteDto.expireDateEnd" id=""                                                                                                 readonly="readonly" value="{{formatData \'yyyy-MM-dd\' expireDateEnd}}">                                <a class="global-link fn-PL10 fn-LH24 JS-reset-calendar">清空</a>                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH30">                                                 邮寄地址:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{lassenAccountLegalpersonDo.mailingAddress}}"                                                                                                 name="certificationOnsiteDto.mailingAddress"                                 placeholder="请输入邮寄地址" maxlength="300" />                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH30">                                                联系人姓名:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{lassenAccountLegalpersonDo.linkman}}"                                                                name="certificationOnsiteDto.linkman"                                                                 placeholder="请输入联系人姓名" maxlength="200" />                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH30">                                                联系人手机号:</td>                        <td>                             <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{lassenAccountLegalpersonDo.mobile}}"                                                                 data-rule="mobile"                                                                 data-errormessage-mobile="请填写正确的手机号码"                                  name="certificationOnsiteDto.mobile"                                 placeholder="请填写联系人手机号码"                                maxlength="11" />                            </div>                        </td>                    </tr>                     <tr>                        <td></td>                        <td class="">                            <input type="button" class="fn-btn fn-btn-primary fn-FWB fn-W100 fn-LH25 fn-ML50 child-button submit-btn" id="" value="提交">                        </td>                    </tr>                    </tbody>            </table>        </div>    </div></div>');
    return compile.source = '<div class="fn-BGC-FFF fn-color-666 fn-PaAl15">    <div class="global-tab fn-BBS-ebebeb">        <i></i>我的信息    </div>        <div>        <div id="certificationOnsiteAdd-form">            <table width="100%" class="fn-table fn-table-input fn-table-input-sm  fn-MT20">                 <tbody>                    <tr>                        <td align="right" valign="top" width="100" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                         注册手机号：</td>                        <td>                            <div class="kuma-form-item fn-PosRel">                                <input type="hidden" name="certificationOnsiteDto.securityId" data-skip-hidden="false" value={{securityId}} >                                <input type="hidden" name="certificationOnsiteDto.openaccountId" value="{{openaccountId}}"/>                                <input type="hidden" name="certificationOnsiteDto.certType" value="{{certType}}" />                                 <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required JS-register" value="{{openaccountId}}" data-required="true" data-rule="mobile" name="certificationOnsiteDto.openaccountId" data-errormessage-required="请填写手机号码" data-errormessage-mobile="请填写正确的手机号码" maxlength="11" placeholder="请填写手机号码"  />                                <span class="fn-PosAbs fn-ML10 fn-LH30 fn-color-F00" id="check-register"></span>                                <div id="can-modify"> </div>                            </div>                        </td>                    </tr>                    <tr class="cert-type-tr">                        <td align="right" valign="top" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                        身份类型：</td>                        <td class="fn-LH20">                            <label>                                <input type="radio" name="certificationOnsiteDto.certType" value="normal" {{#isEqual certType \'normal\'}} checked {{/isEqual}} {{#isFalse certType}} checked {{/isFalse}} class="fn-VA2D cert-normal" id="radio-normal"/>                                <span class="JS-need-tip" data-content="普通公民，个体户">自然人</span>                            </label>                            <label>                                <input type="radio" name="certificationOnsiteDto.certType" value="company" {{#isEqual certType \'company\'}} checked {{/isEqual}} class="fn-VA2D cert-legal" id="radio-legal"/>                                <span class="JS-need-tip" data-content="企业、事业单位、社会团体、民办非企业单位、党政及国家机关">法人</span>                            </label>                                                        </td>                    </tr>                    </tbody>                                        <tbody id="item-normal" {{#isEqual certType \'company\'}} class="fn-hide" {{/isEqual}}>                        <tr>                        <td align="right" valign="top" class="fn-LH30">                        <span class="global-require fn-VA1D">*</span>                         姓名：</td>                        <td>                         <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{certName}}" data-required="true" name="certificationOnsiteDto.certName" data-errormessage-required="请输入姓名" placeholder="请输入姓名" id="input-name" maxlength="200" />                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                         证件号码：</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{idcardNumber}}" data-required="true" data-rule="cardid" name="certificationOnsiteDto.idcardNumber" data-errormessage-required="请输入身份证号码" data-errormessage-cardid="请填写正确的身份证号码" placeholder="请输入身份证号码" id="input-idcard" maxlength="18" />                            </div>                        </td>                    </tr>                    <tr class="">                        <td align="right" valign="top" class="fn-LH25">                                                 身份证正面：</td>                        <td>                            <div class="kuma-form-item">                                <div>                                    <input type="button" class="fn-btn fn-btn-upload fn-btn-sm fn-W100 JS-need-upload" value="选择图片" data-style="{\'display\':\'inline-block\'}" data-size="1" data-rule="(.jpg|.jpeg|.png|.bmp)$" data-accept="image/jpg, image/jpeg, image/png, image/bmp" data-rule-err-msg="请上传后缀是jpg,jpeg,png,bmp的图片" {{#if uploadFileFrontDoList}} data-list="[{ \'id\' : \'{{uploadFileFrontDoList.[0].securityIds}}\' ,  \'name\' :  \'{{uploadFileFrontDoList.[0].fileName}}\' ,  \'url\' :  \'{{uploadFileFrontDoList.[0].url}}\' }]" {{/if}} data-img-view="true" data-input-name="certificationOnsiteDto.fileFrontIds">                                    <input type="hidden" name="certificationOnsiteDto.fileFrontIds" id="fileFrontIds" class="JS-target-required "                                                                                                         </div>                            </div>                        </td>                    </tr>                    <tr class="">                        <td align="right" valign="top" class="fn-LH25">                                                 身份证反面：</td>                        <td>                            <div class="kuma-form-item">                                <div>                                     <input type="button" class="fn-btn fn-btn-upload fn-btn-sm fn-W100 JS-need-upload" value="选择图片" data-style="{\'display\':\'inline-block\'}" data-size="1"                                      data-rule="(.jpg|.jpeg|.png|.bmp)$" data-accept="image/jpg, image/jpeg, image/png, image/bmp" data-rule-err-msg="请上传后缀是jpg,jpeg,png,bmp的图片"  {{#if uploadFileBackDoList}} data-list="[{ \'id\' : \'{{uploadFileBackDoList.[0].securityIds}}\' ,  \'name\' :  \'{{uploadFileBackDoList.[0].fileName}}\' ,  \'url\' :  \'{{uploadFileBackDoList.[0].url}}\' }]" {{/if}}  data-img-view="true" data-input-name="certificationOnsiteDto.fileBackIds">                                    <input type="hidden" name="certificationOnsiteDto.fileBackIds" id="fileBackIds" class="JS-target-required"                                                                         #data-errormessage="请上传身份证反面"                                     value="{{uploadFileBackDoList.[0].securityIds}}" />                                </div>                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                                                 证件有效日期:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-fr" name="certificationOnsiteDto.expireDateStart"                                                                                                                                  readonly="readonly" value="{{formatData \'yyyy-MM-dd\' expireDateStart}}">                                <span class="fn-ML10 fn-MR5">-</span>                                <input type="text" class=" fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-to" name="certificationOnsiteDto.expireDateEnd"                                                                                                                                  readonly="readonly"                                 value="{{formatData \'yyyy-MM-dd\' expireDateEnd}}">                                <a class="global-link fn-PL10 fn-LH24 JS-reset-calendar">清空</a>                            </div>                        </td>                    </tr>                    <tr class="">                        <td align="right" valign="top" class="fn-LH30">                                                 当前住址:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required"                                                                  name="certificationOnsiteDto.currentAddress"                                                                 placeholder="请输入本人居住地址" value="{{lassenAccountNormalDo.currentAddress}}"                                 maxlength="300" />                            </div>                        </td>                    </tr>                         <tr>                        <td></td>                        <td class="">                            <input type="button" class="fn-btn fn-btn-primary fn-FWB fn-W100 fn-LH25 fn-ML50 child-button submit-btn" id="" value="提交">                        </td>                    </tr>                    </tbody>                                        <tbody id="item-legal"  {{#isEqual certType \'normal\'}} class="fn-hide" {{/isEqual}}>                        <tr>                         <td align="right" valign="top" class="fn-LH30" >                         <span class="global-require fn-VA1D">*</span>                          公司名称:</td>                        <td>                         <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{certName}}" data-required="true"                                 name="certificationOnsiteDto.certName" data-errormessage-required="请输入公司名称" placeholder="请输入公司名称" id="input-name" maxlength="200" />                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                        <span class="global-require fn-VA1D">*</span>                         证件号码：</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{idcardNumber}}"                                 data-required="true"                                 name="certificationOnsiteDto.idcardNumber"                                 data-errormessage-required="请输入营业许可证号码"                                 data-errormessage-credentials="请输入正确的营业许可证号码"                                 placeholder="请输入营业许可证号码" id="input-idcard"                                maxlength="18" />                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH25 ">                                                 证件照片:</td>                        <td>                            <div class="kuma-form-item">                                <div>                                    <input type="button" class="fn-btn fn-btn-upload fn-btn-sm fn-W100 JS-need-upload" value="选择图片" data-style="{\'display\':\'inline-block\'}" data-size="1" data-rule="(.jpg|.jpeg|.png|.bmp)$" data-accept="image/jpg, image/jpeg, image/png, image/bmp" data-rule-err-msg="请上传后缀是jpg,jpeg,png,bmp的图片"   {{#if uploadFileLicenseDoList}} data-list="[{ \'id\' : \'{{uploadFileLicenseDoList.[0].securityIds}}\' ,  \'name\' :  \'{{uploadFileLicenseDoList.[0].fileName}}\' ,  \'url\' :  \'{{uploadFileLicenseDoList.[0].url}}\' }]" {{/if}}  data-img-view="true" data-input-name="certificationOnsiteDto.fileLicenseIds" >                                    <input type="hidden" name="certificationOnsiteDto.fileLicenseIds" id="fileLicenseIds" class="JS-target-required" data-skip-hidden="false"                                                                         value="uploadFileLicenseDoList.[0].securityIds" />                                </div>                            </div>                        </td>                    </tr>                    <tr>                        <td align="right" valign="top" class="fn-LH25">                                                 证件有效日期:</td>                                              <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-fr" name="certificationOnsiteDto.expireDateStart" id="" data-errormessage="提交时间起始"  data-required="true" data-errormessage-required="请输入起始日期"  readonly="readonly" value="{{formatData \'yyyy-MM-dd\' expireDateStart}}">                                <span class="fn-ML10 fn-MR5">-</span>                                <input type="text" class=" fn-input-text fn-input-text-sm fn-W80 kuma-input fn-input-text-date JS-target-date submit-date-to" name="certificationOnsiteDto.expireDateEnd" id=""                                                                                                 readonly="readonly" value="{{formatData \'yyyy-MM-dd\' expireDateEnd}}">                                <a class="global-link fn-PL10 fn-LH24 JS-reset-calendar">清空</a>                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH30">                                                 邮寄地址:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{lassenAccountLegalpersonDo.mailingAddress}}"                                                                                                 name="certificationOnsiteDto.mailingAddress"                                 placeholder="请输入邮寄地址" maxlength="300" />                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH30">                                                联系人姓名:</td>                        <td>                            <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{lassenAccountLegalpersonDo.linkman}}"                                                                name="certificationOnsiteDto.linkman"                                                                 placeholder="请输入联系人姓名" maxlength="200" />                            </div>                        </td>                    </tr>                    <tr class=" ">                        <td align="right" valign="top" class="fn-LH30">                                                联系人手机号:</td>                        <td>                             <div class="kuma-form-item">                                <input type="text" class="fn-input-text fn-input-text-sm fn-W200 kuma-input JS-target-required" value="{{lassenAccountLegalpersonDo.mobile}}"                                                                 data-rule="mobile"                                                                 data-errormessage-mobile="请填写正确的手机号码"                                  name="certificationOnsiteDto.mobile"                                 placeholder="请填写联系人手机号码"                                maxlength="11" />                            </div>                        </td>                    </tr>                     <tr>                        <td></td>                        <td class="">                            <input type="button" class="fn-btn fn-btn-primary fn-FWB fn-W100 fn-LH25 fn-ML50 child-button submit-btn" id="" value="提交">                        </td>                    </tr>                    </tbody>            </table>        </div>    </div></div>',
        compile
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/util-debug", ["common/promise-debug", "common/limit-debug", "common/limit-dom-debug"], function(require, exports, module) {
    "use strict";
    var Promise = require("common/promise-debug");
    module.exports = {
        formateDate: function(formate, timestamp) {
            var timeRag = /^(yyyy)(.MM)?(.dd)?(.HH)?(.mm)?(.ss)?$/,
                getTime = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"],
                data = 1 === arguments.length ? new Date : new Date(timestamp),
                me = this;
            return isNaN(+data) ? void window.alert("时间戳解析错误") : formate.replace(timeRag, function() {
                for (var obj, val, arr = [], index = 1; index < arguments.length && (obj = arguments[index]); index++) val = data[getTime[index - 1]](), 1 === index ? arr.push("" + val) : (2 === index && val++, arr.push(obj.slice(0, 1) + me.formattingVal(val)));
                return arr.join("")
            })
        },
        formattingVal: function(val) {
            return ("00" + val).slice(-1)
        },
        mathRandom: function(form, to) {
            var form = ~~form,
                to = ~~to,
                max = Math.max(form, to),
                min = Math.min(form, to);
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        getInitData: function(url) {
            var promise = new Promise(function(resolve, reject) {
                $.ajax({
                    url: url,
                    type: "get",
                    dataType: "json",
                    success: resolve,
                    error: reject
                })
            });
            return promise
        }
    }
});
"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function")
}
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor
    }
}();
define("common/promise-debug", ["common/limit-debug", "common/limit-dom-debug"], function(require, exports) {
    var limit = require("common/limit-debug"),
        WIN = window;
    if (WIN.Promise) return Promise.prototype.Catch = function(fn) {
        return this.then(null, fn)
    }, Promise;
    var MyPromise = function() {
        function MyPromise() {
            var _this = this;
            if (_classCallCheck(this, MyPromise), this.PromiseStatus = "pedding", this.PromiseValue = void 0, this.Stack = [], limit.isFunction(arguments.length <= 0 ? void 0 : arguments[0])) {
                this.promiseList = [];
                var fun = arguments.length <= 0 ? void 0 : arguments[0],
                    resolve = function(val) {
                        limit.each([_this].concat(_this.promiseList), function(promise) {
                            "pedding" === promise.PromiseStatus && (promise.PromiseStatus = "resolved", promise.PromiseValue = val, promise._clean())
                        })
                    },
                    reject = function(val) {
                        limit.each([_this].concat(_this.promiseList), function(promise) {
                            "pedding" === promise.PromiseStatus && (promise.PromiseStatus = "rejected", promise.PromiseValue = val, promise._clean())
                        }), setTimeout(function() {
                            if (!_this.promiseList.length) throw "(in promise) " + val
                        }, 0)
                    };
                try {
                    fun(resolve, reject)
                } catch (e) {
                    this.PromiseStatus = "rejected", this.PromiseValue = e
                }
            } else this.PromiseStatus = arguments.length <= 0 ? void 0 : arguments[0], this.PromiseValue = arguments.length <= 1 ? void 0 : arguments[1]
        }
        return _createClass(MyPromise, [{
            key: "then",
            value: function(suc, err) {
                suc = limit.cb(suc), err = limit.cb(err);
                var me = this;
                if (me.promiseList) {
                    var originMe = me;
                    me = new MyPromise(me.PromiseStatus, me.PromiseValue), originMe.promiseList.push(me)
                }
                return me.Stack.push({
                    suc: suc,
                    err: err
                }), "pedding" === me.PromiseStatus || me.cleanStatus || me._clean(), me
            }
        }, {
            key: "Catch",
            value: function(err) {
                return this.then(null, err)
            }
        }, {
            key: "_clean",
            value: function() {
                var me = this,
                    one = me.Stack.shift();
                return me.cleanStatus = "init", one ? setTimeout(function() {
                    try {
                        switch (me.PromiseStatus) {
                            case "resolved":
                                me.PromiseValue = one.suc(me.PromiseValue);
                                break;
                            case "rejected":
                                me.PromiseValue = one.err(me.PromiseValue)
                        }
                        me.PromiseStatus = "resolved"
                    } catch (e) {
                        me.PromiseStatus = "rejected", me.PromiseValue = e, me.Stack.length || setTimeout(function() {
                            throw "(in promise) " + e
                        }, 0)
                    }
                    me._clean()
                }, 0) : delete me.cleanStatus, me
            }
        }], [{
            key: "all",
            value: function(list) {
                function main(arg, key) {
                    args[key] = arg, --guid || back(args)
                }
                var guid = list.length,
                    back = void 0,
                    args = [];
                return new MyPromise(function(resolve, reject) {
                    back = resolve, limit.each(list, function(val, key) {
                        val.PromiseStatus ? val.then(function(sucVal) {
                            main(sucVal, key)
                        }, function(errVal) {
                            reject(errVal)
                        }) : main(val, key)
                    })
                })
            }
        }, {
            key: "race",
            value: function(list) {
                return new MyPromise(function(resolve, reject) {
                    limit.each(list, function(val) {
                        MyPromise.resolve(val).then(function(sucVal) {
                            return resolve(sucVal)
                        }, function(errVal) {
                            return reject(errVal)
                        })
                    })
                })
            }
        }, {
            key: "resolve",
            value: function(val) {
                return new MyPromise(val && val.then ? function(resolve, reject) {
                    val.then(resolve, reject)
                } : function(resolve, reject) {
                    resolve(val)
                })
            }
        }, {
            key: "reject",
            value: function(val) {
                return new MyPromise(function(resolve, reject) {
                    reject(val)
                })
            }
        }]), MyPromise
    }();
    return MyPromise
});
"use strict";
define("common/limit-debug", ["common/limit-dom-debug"], function(require, exports, module) {
    function equalBase(a, b, type) {
        var fn = WIN[type];
        return fn(a) === fn(b)
    }

    function equal(a, b) {
        return size(a) === size(b) && every(getLoopKey(a), function(val, key) {
            return isEqual(a[val], b[val])
        })
    }

    function fixCodePointAt(codeH, codeL) {
        return codeH = padStart((1023 & codeH).toString(2), "0", 10), codeL = padStart((1023 & codeL).toString(2), "0", 10), (parseInt(codeH + codeL, 2) + 65536).toString(16)
    }

    function parseUnicode(str16) {
        if (parseInt(str16, 16) <= 65535) return [str16];
        var origin = parseInt(str16, 16) - 65536,
            originH = origin >> 10,
            originL = 1023 & origin;
        return originH = (55296 | originH).toString(16).toUpperCase(), originL = (56320 | originL).toString(16).toUpperCase(), [originH, originL]
    }

    function stringIncludes(str, arg, index) {
        return str = limitToString(str), nativeStringIncludes ? nativeStringIncludes.call(str, arg, index) : str.indexOf(arg, index) !== -1
    }

    function padStartEnd(str, arg, leg, flag) {
        str = limitToString(str), arg = limitToString(arg), leg = ~~leg;
        var min, max = str.length,
            nativeMethod = flag ? nativePadStart : nativePadEnd;
        return max >= leg ? str : nativeMethod ? nativeMethod.call(str, arg, leg) : (min = Math.ceil((leg - max) / arg.length), flag ? (repeat(arg, min) + str).slice(-leg) : (str + repeat(arg, min)).slice(0, leg))
    }

    function padChar(n, len) {
        for (null == n && (n = ""), n += "", len = ~~len; n.length < len;) n += n;
        return n.slice(0, len)
    }

    function positive(num) {
        return num = ~~num, num < 0 ? 0 : num
    }

    function checkNum() {
        var flag = !0;
        return breakEach(concat.apply(arrayProto, arguments), function(val) {
            if (!limitIsFinite(val)) return log("warn", val, "the num is not a finite number"), flag = !1
        }), flag
    }

    function getMaxScale() {
        if (checkNum.apply(void 0, arguments)) return Math.max.apply(Math, map(arguments, function(val) {
            return (("" + val).split(".")[1] || "").length
        }))
    }

    function movePointRight(sign, leftStr, rightStr, scale) {
        return scale < rightStr.length ? sign + leftStr + rightStr.slice(0, scale) + "." + rightStr.slice(scale) : sign + leftStr + padEnd(rightStr, "0", scale)
    }

    function movePointLeft(sign, leftStr, rightStr, scale) {
        return leftStr.length > scale ? sign + leftStr.slice(0, -scale) + "." + leftStr.slice(-scale) + rightStr : sign + "0." + padStart(leftStr, "0", scale) + rightStr
    }

    function movePoint(num, scale) {
        if (checkNum(num)) {
            if (num += "", scale = ~~scale, 0 === scale) return num;
            var leftStr, rightStr, sign = "";
            return num = num.split("."), leftStr = num[0], rightStr = num[1] || "", "-" === leftStr.charAt(0) && (sign = "-", leftStr = leftStr.slice(1)), scale < 0 ? movePointLeft(sign, leftStr, rightStr, -scale) : movePointRight(sign, leftStr, rightStr, scale)
        }
    }

    function getNeedNum(args, falg) {
        var tar = args[0] + "",
            arg = args[1] + "",
            medTar = (tar.split(".")[1] || "").length,
            medArg = (arg.split(".")[1] || "").length,
            num = falg ? +movePoint(+tar.replace(".", "") * +arg.replace(".", ""), -(medTar + medArg)) : +movePoint(+tar.replace(".", "") / +arg.replace(".", ""), medArg - medTar);
        return args.splice(0, 2, num), num
    }

    function getLoopKey(obj) {
        return keys(isArrayLike(obj) ? toArray(obj) : obj)
    }

    function loop(obj, iterator, context, isBreak, begin) {
        for (var key, target = getLoopKey(obj), num = ~~begin, len = target.length; num < len && (key = target[num], iterator.call(context, obj[key], key, obj) !== !1 || !isBreak); num++);
    }

    function arrayIncludes(arr, target, index) {
        if (nativeArrayIncludes) {
            var result = !1;
            return loop(arr, limitIsNaN(target) ? function(val) {
                if (limitIsNaN(val)) return result = !0, !1
            } : function(val) {
                if (val === target) return result = !0, !1
            }, void 0, !0, index >= 0 ? index : arr.length + index), result
        }
        return nativeArrayIncludes.call(arr, target, index)
    }

    function fixFindAndFindIndex(arr, iterator, context) {
        var result = {
            key: -1,
            val: void 0
        };
        return breakEach(arr, function(val, key) {
            if (iterator.call(this, val, +key)) return result = {
                key: key,
                val: val
            }, !1
        }, context), result
    }

    function whiteBlack(factor, val1) {
        return some(factor, function(val2) {
            return every(val2, function(val3, key3) {
                return val3 === val1[key3]
            })
        })
    }
    var limitDom = require("common/limit-dom-debug"),
        limit = {},
        arrayProto = Array.prototype,
        objectProto = Object.prototype,
        functionProto = Function.prototype,
        stringProto = String.prototype,
        WIN = window,
        slice = (WIN.document, arrayProto.slice),
        splice = arrayProto.splice,
        concat = arrayProto.concat,
        unshift = arrayProto.unshift,
        push = arrayProto.push,
        toString = objectProto.toString,
        hasOwnProperty = objectProto.hasOwnProperty;
    limit.slice = slice;
    var nativeKeys = Object.keys,
        nativeCreate = Object.create,
        nativeForEach = arrayProto.forEach,
        nativeIndexOf = arrayProto.indexOf,
        nativeLastIndexOf = arrayProto.lastIndexOf,
        nativeMap = arrayProto.map,
        nativeFilter = arrayProto.filter,
        nativeEvery = arrayProto.every,
        nativeSome = arrayProto.some,
        nativeReduce = arrayProto.reduce,
        nativeReduceRight = arrayProto.reduceRight,
        nativeBind = functionProto.bind,
        nativeTrim = stringProto.trim,
        nativeCodePointAt = stringProto.codePointAt,
        nativeFromCodePoint = String.fromCodePoint,
        nativeStringIncludes = stringProto.includes,
        nativeStartsWith = stringProto.startsWith,
        nativeEndsWith = stringProto.endsWith,
        nativeRepeat = stringProto.repeat,
        nativePadStart = stringProto.padStart,
        nativePadEnd = stringProto.padEnd,
        nativeArrayIncludes = arrayProto.includes,
        nativeFind = arrayProto.find,
        nativeFindIndex = arrayProto.findIndex,
        nativeFill = arrayProto.fill,
        nativeCopyWithin = arrayProto.copyWithin,
        K = limit.K = function(k) {
            return k
        },
        cb = limit.cb = function(callback) {
            return isFunction(callback) ? callback : K
        },
        O = limit.O = {},
        logColor = {
            log: "background:#333;margin-left:11px;padding-right:17px;",
            error: "background:#F00;padding-right:3px;",
            warn: "background:#F70;margin-left:11px;padding-right:10px;"
        },
        log = limit.log = function() {
            if (!limit.logClosed) {
                var log, args = slice.call(arguments),
                    type = args.shift(),
                    con = console || O,
                    isChrome = limitDom.isChrome;
                contains(["error", "log", "warn"], type) || (args.unshift(type), type = "error"), log = con[type] || K;
                try {
                    isChrome && args.unshift(logColor[type] + "color:#FFF;padding-left:3px;border-radius:3px;"), args.unshift((isChrome ? "%c" : "") + "limitJS " + type + ":"), log.apply(con, args)
                } catch (e) {
                    log("limitJS ", args)
                }
            }
        },
        typeWarn = {
            toString: function(obj) {
                return log("warn", obj, "change into", "'" + obj + "'", "limit.toString is called")
            },
            toArray: function(obj) {
                return log("warn", obj, "change into []", "limit.toArray is called")
            },
            formatDate: function(timestamp, data) {
                return log("warn", "timestamp:", timestamp, "date:", date, "limit.formatDate is called")
            },
            bind: function(obj) {
                return log("warn", fun, "type is not function, limit.bind is called")
            }
        },
        isUndefined = limit.isUndefined = function(n) {
            return void 0 === n
        };
    limit.setDefault = function(n) {
        var result;
        return breakEach(arguments, function(val) {
            return result = val, isUndefined(val)
        }), result
    };
    var isNull = (limit.isDefined = function(n) {
            return !isUndefined(n)
        }, limit.isNull = function(n) {
            return null === n
        }),
        isFunction = limit.isFunction = function(n) {
            return "function" == typeof n
        };
    limit.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" === toString.call(n)
    };
    "String,Number,Array,Date,RegExp,Error,Math".replace(/\w+/g, function(k) {
        limit["is" + k] = function(n) {
            return toString.call(n) === "[object " + k + "]"
        }
    });
    var isNumber = limit.isNumber,
        isArray = limit.isArray,
        isDate = limit.isDate,
        isMath = limit.isMath,
        isError = limit.isError,
        isRegExp = limit.isRegExp,
        isString = limit.isString,
        isObject = limit.isObject = function(n) {
            return isFunction(n) || "object" == typeof n && !!n
        },
        isArrayLike = (limit.isArguments = function(n) {
            return has(n, "callee")
        }, limit.isArrayLike = function(n) {
            return !!n && isNumber(n.length) && !isFunction(n) && !isWin(n)
        }),
        limitIsNaN = limit.isNaN = Number.isNaN || function(n) {
            return isNumber(n) && isNaN(n)
        },
        limitIsFinite = limit.isFinite = Number.isFinite || function(n) {
            return isNumber(n) && isFinite(n)
        },
        isInteger = limit.isInteger = Number.isInteger || function(n) {
            return limitIsFinite(n) && Math.floor(n) === n
        };
    limit.isSafeInteger = Number.isSafeInteger || function(n) {
        return isInteger(n) && -9007199254740992 < n && n < 9007199254740992
    };
    var isEmpty = limit.isEmpty = function(n) {
        return null == n || 0 === size(n)
    };
    limit.isElement = function(n) {
        return !!n && 1 === n.nodeType
    }, limit.isDocument = function(n) {
        return !!n && 9 === n.nodeType
    };
    var isWin = limit.isWin = function(n) {
            return !!n && n.window === n && n.self == n
        },
        equalBaseArr = ["String", "Number", "Boolean"],
        isEqual = limit.isEqual = function(a, b) {
            if (log("log", "limit.isEqual is called ", typeof a, ":", a, typeof b, ":", b), a === b) return !0;
            if (toString.call(a) !== toString.call(b)) return !1;
            if (limitIsNaN(a)) return !0;
            var type;
            return (type = isBase(a, equalBaseArr)) ? equalBase(a, b, type) : isDate(a) ? +a === +b : isRegExp(a) ? "" + a == "" + b : (!isFunction(a) || "" + a == "" + b) && equal(a, b)
        },
        baseArr = ["String", "Number", "Boolean", "Null", "Undefined", "RegExp", "Date", "Math", "Error"],
        isBase = limit.isBase = function(n, list) {
            !isArray(list) && (list = baseArr);
            var type = "";
            return some(list, function(val, key) {
                var fn = limit["is" + val];
                return fn && fn(n) && (type = val)
            }), type
        };
    limit.includes = function(obj, arg, index) {
        return isArray(obj) ? arrayIncludes(obj, arg, index) : stringIncludes(obj, arg, index)
    };
    var limitToString = limit.toString = function(obj) {
            return isString(obj) ? obj : (typeWarn.toString(obj), "" + obj)
        },
        REG_EXP_TRIM = /^\s+|\s+$/g;
    limit.trim = function(n) {
        return n = arguments.length ? n + "" : "", nativeTrim ? nativeTrim.call(n) : n.replace(REG_EXP_TRIM, "")
    };
    limit.codePointAt = function(str, index) {
        if (str = limitToString(str), index = ~~index, nativeCodePointAt) {
            var code = str.charCodeAt(index);
            return code >= 55296 && code <= 56319 ? fixCodePointAt(code, str.charCodeAt(++index)) : code.toString(16)
        }
        return nativeCodePointAt.call(str, index).toString(16)
    }, limit.fromCodePoint = function(code) {
        return isFinite(code) ? nativeFromCodePoint ? nativeFromCodePoint.call(String, code) : (code = map(parseUnicode(code.toString(16)), function(val) {
            return "\\u" + val
        }).join(""), new Function('return "' + code + '"')()) : (log("warn", code, "the code must be a number"), "")
    }, limit.startsWith = function(str, arg, index) {
        return str = limitToString(str), nativeStartsWith ? nativeStartsWith.call(str, arg, index) : (index = ~~index, str.indexOf(arg, index) === index)
    }, limit.endsWith = function(str, arg, index) {
        if (str = limitToString(str), nativeEndsWith) return nativeEndsWith.call(str, arg, index);
        index = 3 === arguments.length ? ~~index : str.length;
        var leg = index - arg.length;
        return str.lastIndexOf(arg, leg) === leg
    };
    var repeat = limit.repeat = function(str, leg) {
            if (str = limitToString(str), leg = positive(leg), nativeRepeat) return nativeRepeat.call(str, leg);
            var arr = new Array(leg),
                tem = [];
            return Array.prototype.push.apply(tem, arr), tem.map(function() {
                return str
            }).join("")
        },
        padStart = limit.padStart = function(str, arg, leg) {
            return padStartEnd(str, arg, leg, !0)
        },
        padEnd = limit.padEnd = function(str, arg, leg) {
            return padStartEnd(str, arg, leg, !1)
        },
        REG_THOUSAND_SEPARATOR = (limit.random = function(form, to) {
            form = ~~form, to = ~~to;
            var max = Math.max(form, to),
                min = Math.min(form, to);
            return Math.floor((max - min + 1) * Math.random() + min)
        }, /(\d{1,3})(?=(\d{3})+$)/g),
        REG_THOUSAND_SEPARATOR_POINT = /(\d{1,3})(?=(\d{3})+\.)/g,
        REG_THOUSAND_SEPARATOR_COMMA = /,/g;
    limit.thousandSeparator = function(num, med) {
        return limitIsFinite(num) ? (isNumber(med) || (med = 2), toFixed(num, med).replace(med ? REG_THOUSAND_SEPARATOR_POINT : REG_THOUSAND_SEPARATOR, "$1,")) : (log("warn", "limit.thousandSeparator is called ", typeof num, ":", num), "")
    }, limit.unThousandSeparator = function(str) {
        return isString(str) ? +str.replace(REG_THOUSAND_SEPARATOR_COMMA, "") : (log("warn", "limit.unThousandSeparator is called ", typeof str, ":", str), NaN)
    };
    var toFixed = limit.toFixed = function(num, scale) {
        scale = positive(scale);
        var num = movePoint(num, scale);
        return isUndefined(num) ? num : movePoint(Math.round(num), -scale)
    };
    limit.plus = function() {
        var maxScale = getMaxScale.apply(void 0, arguments);
        if (!isUndefined(maxScale)) return reduce.call(void 0, arguments, function(before, val) {
            return +movePoint(+movePoint(before, maxScale) + +movePoint(val, maxScale), -maxScale)
        })
    }, limit.minus = function() {
        var maxScale = getMaxScale.apply(void 0, arguments);
        if (!isUndefined(maxScale)) return reduce.call(void 0, arguments, function(before, val) {
            return +movePoint(+movePoint(before, maxScale) - +movePoint(val, maxScale), -maxScale)
        })
    };
    var multiply = limit.multiply = function() {
            if (checkNum.apply(void 0, arguments)) {
                var args = toArray(arguments),
                    num = getNeedNum(args, !0);
                return args.length <= 1 ? num : multiply.apply(void 0, args)
            }
        },
        except = limit.except = function() {
            if (checkNum.apply(void 0, arguments)) {
                var args = toArray(arguments),
                    num = getNeedNum(args, !1);
                return limitIsNaN(num) ? args[0] / args[1] : args.length <= 1 ? num : except.apply(void 0, args)
            }
        },
        has = limit.has = function(n, k) {
            return null != n && hasOwnProperty.call(n, k)
        },
        E = function() {},
        create = limit.create = function(prop) {
            return null == prop ? {} : nativeCreate ? nativeCreate(prop) : prop.__proto__ ? {
                __proto__: prop
            } : (E.prototype = prop, new E)
        },
        forIn = limit.forIn = function(obj, iterator, context) {
            if (null == obj) return obj;
            for (var key in obj) iterator.call(context, obj[key], key, obj);
            return obj
        },
        keys = limit.keys = function(obj) {
            if (null == obj) return [];
            if (nativeKeys) return nativeKeys.call(Object, obj);
            var arr = [];
            return forIn(obj, function(val, key) {
                has(obj, key) && arr.push(key)
            }), arr
        },
        size = limit.size = function(obj) {
            return getLoopKey(obj).length
        },
        each = limit.each = function(obj, iterator, context) {
            return iterator = cb(iterator), isArrayLike(obj) && nativeForEach ? nativeForEach.call(obj, function(val, key) {
                iterator.call(this, val, "" + key)
            }, context) : loop(obj, iterator, context)
        },
        breakEach = limit.breakEach = function(obj, iterator, context) {
            return loop(obj, iterator, context, !0)
        },
        extend = limit.extend = function(obj, isOwn) {
            function main(val, key) {
                obj[key] = val
            }
            return isObject(obj) ? (isOwn !== !0 ? each(slice.call(arguments, 1), function(val) {
                forIn(val, main)
            }) : each(slice.call(arguments, 2), function(val) {
                each(val, main)
            }), obj) : obj
        },
        copyArr = (limit.defaults = function(obj, isOwn) {
            function main(val, key) {
                isUndefined(obj[key]) && (obj[key] = val)
            }
            return isObject(obj) ? (isOwn !== !0 ? each(slice.call(arguments, 1), function(val) {
                forIn(val, main)
            }) : each(slice.call(arguments, 2), function(val) {
                each(val, main)
            }), obj) : obj
        }, limit.clone = function(obj) {
            return isBase(obj) ? copy(obj) : isFunction(obj) ? extend(function() {
                return obj.apply(this, arguments)
            }, obj) : isArray(obj) ? slice.call(obj) : extend({}, obj)
        }, ["String", "Number", "Boolean", "Null", "Undefined"]),
        copy = limit.copy = function(obj) {
            var type;
            if (type = isBase(obj, copyArr)) return isObject(obj) ? new WIN[type](obj.valueOf()) : obj;
            if (isMath(obj)) return obj;
            if (isRegExp(obj)) return new RegExp(obj.source, (obj.global ? "g" : "") + (obj.multiline ? "m" : "") + (obj.ignoreCase ? "i" : ""));
            if (isDate(obj)) return new Date(obj.getTime());
            if (isError(obj)) return new Error(obj.message);
            var value = {};
            return isArray(obj) && (value = []), isFunction(obj) && (value = function() {
                return obj.apply(this, arguments)
            }), forIn(obj, function(val, key) {
                value[key] = copy(val)
            }), value
        };
    limit.getObject = function(obj) {
        return breakEach(slice.call(arguments, 1), function(val) {
            try {
                obj = obj[val]
            } catch (e) {
                return obj = void 0, !1
            }
        }), obj
    };
    var is = limit.is = Object.is || function(a, b) {
            return !(!limitIsNaN(a) || !limitIsNaN(b)) || (0 === a && 0 === b ? 1 / a === 1 / b : a === b)
        },
        from = limit.from = Array.from || function(obj, iterator, context) {
            var arr = [];
            return iterator = cb(iterator), obj && obj.length ? (push.apply(arr, slice.call(obj)), map(arr, iterator, context)) : arr
        };
    limit.of = Array.of || function() {
        return slice.call(arguments)
    };
    var toArray = limit.toArray = function(obj) {
            return isArray(obj) ? obj : isArrayLike(obj) ? slice.call(obj) : (typeWarn.toArray(obj), [])
        },
        getArray = limit.getArray = function(arr) {
            switch (arr = toArray(arr), arr.length) {
                case 0:
                    return null;
                case 1:
                    return arr[0];
                default:
                    return arr
            }
        },
        indexOf = limit.indexOf = function(arr, ele, formIndex) {
            if (isEmpty(arr)) return -1;
            if (isArrayLike(arr) && (arr = toArray(arr)), nativeIndexOf && nativeIndexOf === arr.indexOf) return nativeIndexOf.apply(arr, slice.call(arguments, 1));
            var isArr = isArray(arr),
                index = -1;
            return loop(arr, function(val, key) {
                if (val === ele) return index = key, !1
            }, void 0, !0, ~~formIndex), isArr ? +index : index
        },
        forEach = (limit.lastIndexOf = function(arr, ele, formIndex) {
            if (arr = toArray(arr), nativeLastIndexOf) return nativeLastIndexOf.apply(arr, slice.call(arguments, 1));
            formIndex = ~~formIndex;
            var len = arr.length - 1,
                index = indexOf(arr.reverse(), ele, 3 === arguments.length ? len - formIndex : formIndex);
            return index === -1 ? -1 : len - index
        }, limit.forEach = function(arr, iterator, context) {
            return arr = toArray(arr), iterator = cb(iterator), each(arr, function(val, key) {
                iterator.call(this, val, +key, arr)
            }, context)
        }),
        map = limit.map = function(arr, iterator, context) {
            if (isEmpty(arr)) return arr;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeMap && nativeMap === arr.map) return nativeMap.call(arr, iterator, context);
            var isArr = isArray(arr),
                result = isArr ? [] : {};
            return each(arr, function(val, key) {
                result[key] = iterator.call(this, val, key, arr)
            }, context), result
        },
        filter = limit.filter = function(arr, iterator, context) {
            if (isEmpty(arr)) return arr;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeFilter && nativeFilter === arr.filter) return nativeFilter.call(arr, iterator, context);
            var isArr = isArray(arr),
                result = isArr ? [] : {};
            return isArr ? each(arr, function(val, key) {
                iterator.call(this, val, key, arr) && result.push(val)
            }, context) : each(arr, function(val, key) {
                iterator.call(this, val, key, arr) && (result[key] = val)
            }), result
        },
        every = limit.every = function(arr, iterator, context) {
            if (isEmpty(arr)) return !1;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeEvery && nativeEvery === arr.every) return nativeEvery.call(arr, iterator, context);
            var result = !0,
                isArr = isArray(arr);
            return breakEach(arr, function(val, key) {
                if (!iterator.call(this, val, isArr ? +key : key, arr)) return result = !1
            }, context), result
        },
        some = limit.some = function(arr, iterator, context) {
            if (isEmpty(arr)) return !1;
            if (isArrayLike(arr) && (arr = toArray(arr)), iterator = cb(iterator), nativeSome && nativeSome === arr.some) return nativeSome.call(arr, iterator, context);
            var result = !1,
                isArr = isArray(arr);
            return breakEach(arr, function(val, key) {
                if (iterator.call(this, val, isArr ? +key : key, arr)) return result = !0, !1
            }, context), result
        },
        ERR_MSG_REDUCE = new TypeError("Reduce of empty array with no initial value"),
        reduce = limit.reduce = function(arr, iterator, init) {
            arr = toArray(arr);
            var args = slice.call(arguments, 1);
            if (args[0] = iterator = cb(iterator), nativeReduce) return nativeReduce.apply(arr, args);
            var len = args.length,
                index = 0,
                noInit = 1 === len,
                result = noInit ? arr[index++] : init;
            if (noInit && 0 === arr.length) throw ERR_MSG_REDUCE;
            return loop(arr, function(val, key) {
                result = iterator.call(this, result, val, +key, arr)
            }, void 0, !1, index), result
        },
        contains = (limit.reduceRight = function(arr, iterator, init) {
            arr = toArray(arr);
            var args = slice.call(arguments, 1);
            if (args[0] = iterator = cb(iterator), nativeReduceRight) return nativeReduceRight.apply(arr, args);
            var len = arr.length - 1;
            return args.unshift(arr.reverse()), args[1] = function(before, val, key, arr) {
                return iterator(before, val, len - key, arr)
            }, reduce.apply(void 0, args)
        }, limit.contains = function(arr, target) {
            var result = !1;
            return loop(arr, function(val) {
                if (is(val, target)) return result = !0, !1
            }, void 0, !0), result
        });
    limit.find = function(arr, iterator, context) {
        return arr = toArray(arr), iterator = cb(iterator), nativeFind ? nativeFind.call(arr, iterator, context) : fixFindAndFindIndex(arr, iterator, context).val
    }, limit.findIndex = function(arr, iterator, context) {
        return arr = toArray(arr), iterator = cb(iterator), nativeFindIndex ? nativeFind.call(arr, iterator, context) : fixFindAndFindIndex(arr, iterator, context).key
    };
    var difference = limit.difference = function(arr) {
        arr = toArray(arr);
        var result = concat.apply(arrayProto, slice.call(arguments, 1));
        return filter(arr, function(val) {
            return !contains(result, val)
        })
    };
    limit.without = function(arr) {
        var result = difference.apply(void 0, arguments);
        return arr.length = 0, push.apply(arr, result), arr
    };
    var flatten = (limit.union = function(arr, isEasy) {
        arr = toArray(arr);
        var target;
        return isEasy ? filter(arr.sort(), function(val, key) {
            return !(key && target === val || (target = val, 0))
        }) : (target = [], filter(arr, function(val, key) {
            return !contains(target, val) && (target.push(val), !0)
        }))
    }, limit.flatten = function() {
        var value = [];
        return forEach(arguments, function(val, key) {
            push.apply(value, isArray(val) ? flatten.apply(void 0, concat.apply(arrayProto, val)) : [val])
        }), value
    });
    limit.whiteList = function(arr) {
        var factor = concat.apply(arrayProto, slice.call(arguments, 1));
        return filter(arr, function(val1) {
            return whiteBlack(factor, val1)
        })
    }, limit.blackList = function(arr) {
        var factor = concat.apply(arrayProto, slice.call(arguments, 1));
        return filter(arr, function(val1) {
            return !whiteBlack(factor, val1)
        })
    }, limit.fill = function(arr, target, start, end) {
        if (arr = toArray(arr), nativeFill) return nativeFill.call(arr, target, start, end);
        var arrLen = arr.length;
        start = ~~start, end = ~~end, start = start <= 0 ? arrLen + start : start, end = end <= 0 ? arrLen + end : end, start < 0 && (start = 0), end > arrLen && (end = arrLen);
        var len = end - start;
        if (len > 0) {
            var arg = from(new Array(len), function() {
                return target
            });
            unshift.call(arg, start, len), splice.apply(arr, arg)
        }
        return arr
    }, limit.copyWithin = function(arr, target, start, end) {
        if (arr = toArray(arr), nativeCopyWithin) return nativeCopyWithin.call(arr, target, start, end)
    };
    var bind = limit.bind = function(fun) {
            function main() {
                if (this instanceof main) {
                    args.shift();
                    var context = create(fun.prototype),
                        tar = fun.apply(context, concat.apply(args, arguments));
                    return isObject(tar) ? tar : context
                }
                return fun.apply(args.shift(), concat.apply(args, arguments))
            }
            if (!isFunction(fun)) return typeWarn.bind(fun), K;
            if (nativeBind) return nativeBind.apply(fun, slice.call(arguments, 1));
            var args = slice.call(arguments, 1);
            return main.toString = function() {
                return "function () { [native code] }"
            }, main
        },
        delay = limit.delay = function(fun, wait) {
            var args = slice.call(arguments, 2);
            return unshift.call(args, fun, void 0), setTimeout(function() {
                bind.apply(void 0, args)()
            }, wait)
        },
        defer = limit.defer = function() {
            var args = slice.call(arguments);
            return args.splice(1, 0, 0), delay.apply(void 0, args)
        },
        defered = (limit.once = function(fun) {
            var args = slice.call(arguments, 2);
            return unshift.call(args, fun, arguments[1]),
                function main() {
                    return main.used ? void 0 : (main.used = !0, bind.apply(void 0, concat.apply(args, arguments))())
                }
        }, limit.defered = function() {
            function clean() {
                var one, temp;
                (one = list.shift()) ? (main.status = "pendding", defer(function() {
                    try {
                        var checkIsNull = ~~isNull(back[0]);
                        temp = back.slice(checkIsNull), back.length = 0, back[1] = one[one.allback ? "allback" : checkIsNull ? "sucback" : "errback"].apply(void 0, temp), back[0] = null
                    } catch (e) {
                        back[0] = e
                    }
                    clean()
                })) : main.status = "end"
            }
            var main = {},
                list = [],
                back = [null];
            return main.isDefered = !0, main.status = "init", main.then = function(sucback, errback) {
                return list.push({
                    sucback: sucback || K,
                    errback: errback || K
                }), main
            }, main.always = function(allback) {
                return list.push({
                    allback: allback || K
                }), main
            }, main.pass = function(err) {
                return arguments.length && (back[0] = err, push.apply(back, slice.call(arguments, 1))), clean(), main
            }, main
        });
    limit.when = function() {
        function endDo() {
            if (--guid <= 0) {
                var isSuc = isNull(getArray(errArgs));
                isSuc && sucArgs.unshift(null), theDefer.pass.apply(void 0, isSuc ? sucArgs : errArgs)
            }
        }
        var theDefer = defered(),
            guid = arguments.length,
            sucArgs = [],
            errArgs = [];
        return forEach(arguments, function(val, key) {
            val.isDefered ? (val.then(function() {
                sucArgs[key] = getArray(arguments)
            }, function() {
                errArgs[key] = getArray(arguments)
            }).always(endDo), "end" === val.status && val.pass()) : isFunction(val) ? defer(function() {
                try {
                    sucArgs[key] = val()
                } catch (e) {
                    errArgs[key] = e
                }
                endDo()
            }) : (sucArgs[key] = val, endDo())
        }), theDefer
    };
    var REG_EXP_DATA = /^(yyyy)(?:(.+)(MM))?(?:(.+)(dd))?(?:(.+)(HH))?(?:(.+)(mm))?(?:(.+)(ss))?(.+)?$/,
        FUN_DATAS = ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"];
    return limit.formatDate = function(timestamp, formatStr) {
        !isNumber(timestamp) && (timestamp = +new Date), !isString(formatStr) && (formatStr = "yyyy-MM-dd HH:mm:ss");
        var date = new Date(timestamp);
        return limitIsNaN(+date) ? (typeWarn.formatDate(timestamp, data), "") : formatStr.replace(REG_EXP_DATA, function() {
            var arr = [];
            return forEach(slice.call(arguments, 1, -2), function(val, key) {
                var value;
                val && (key % 2 === 0 ? (value = date[FUN_DATAS[key / 2]](), "MM" === val && value++, "yyyy" !== val && (value = (padChar("0", 2) + value).slice(-2)), arr.push(value)) : arr.push(val))
            }), arr.join("")
        })
    }, limit
});
"use strict";
define("common/limit-dom-debug", [], function(require, exports) {
    var limitDom = {},
        WIN = window;
    WIN.document;
    return limitDom.isChrome = !!WIN.chrome, limitDom
});
"use strict";
define("common/domUtil-debug", ["common/jquery-debug", "common/util-debug", "common/promise-debug", "common/limit-debug", "common/limit-dom-debug", "common/handlerbars-debug"], function(require, exports, module) {
    function request(URL, DATA, TYPE, CALLBACK, CONFIG) {
        return CONFIG = CONFIG || {}, void 0 === CONFIG.needPop && (CONFIG.needPop = !0), CONFIG.needPop && Poploading.show(CONFIG), $.ajax({
            url: URL,
            dataType: "json",
            type: TYPE,
            data: DATA,
            timeout: 1e5,
            cache: !1,
            success: function(json) {
                CONFIG.needPop && Poploading.hide(), CALLBACK(json)
            },
            error: function(e) {
                CONFIG.needPop && Poploading.hide()
            }
        })
    }

    function requestParam(URL, DATA, TYPE, CALLBACK, CONFIG) {
        return "function" == typeof DATA ? (CALLBACK = maybeCallback(DATA), DATA = {}, TYPE = "post") : "function" == typeof TYPE ? (CALLBACK = maybeCallback(TYPE), TYPE = "post") : CALLBACK = maybeCallback(CALLBACK), [URL, DATA, TYPE, CALLBACK, CONFIG]
    }
    var $ = require("common/jquery-debug"),
        util = require("common/util-debug"),
        limit = require("common/limit-debug"),
        handlerbars = require("common/handlerbars-debug"),
        domUtil = {},
        maybeCallback = util.maybeCallback,
        REX = /^(.+)\.(.+)/,
        K = util.K;
    domUtil.isWebkit = !!navigator.vendor, domUtil.util = util, domUtil.jQuery = $, domUtil.handlerbars = handlerbars, domUtil.closest = function(node, query) {
        return $(node).closest(query)
    }, domUtil.show = function(query) {
        $(query).removeClass("fn-hide")
    }, domUtil.hide = function(query) {
        $(query).addClass("fn-hide")
    }, domUtil.redraw = function(query) {
        domUtil.hide(query), setTimeout(function() {
            domUtil.show(query)
        }, 0)
    }, domUtil.disabledTrue = function(query) {
        var nodes = $(query).find("input,select,textarea,button");
        nodes.prop("disabled", !0)
    }, domUtil.disabledFalse = function(query) {
        var nodes = $(query).find("input,select,textarea,button");
        nodes.prop("disabled", !1)
    }, domUtil.getInputValue = function(table, name) {
        return table.find('[name="' + name + '"]').val()
    }, domUtil.getEscapeUrl = function(url) {
        return encodeURIComponent(url)
    }, domUtil.resetForm = function(query) {
        var form = $(query)[0];
        form && form.reset && form.reset(), util.breakEachArr(form, function(val) {
            if ("hidden" === val.type) {
                var defaultValue = $(val).data("defaultValue");
                void 0 !== defaultValue && (val.value = defaultValue)
            }
        })
    }, domUtil.redirect = function(url) {
        location.href = url
    }, domUtil.paseParam = function(name, obj, factory) {
        var rev = {};
        return factory = factory || K, rev[name] = JSON.stringify(factory(obj)), rev
    }, domUtil.ajax = function(URL, DATA, TYPE, CALLBACK, CONFIG) {
        var args = requestParam(URL, DATA, TYPE, CALLBACK, CONFIG),
            callback = args[3];
        args[3] = function(json) {
            json.hasError ? callback(json.errors && json.errors[0] && json.errors[0].msg || "ajax请求，系统异常！", json.errors) : callback(null, json.content)
        }, request.apply(null, args)
    }, domUtil.http = function(URL, DATA, TYPE, CALLBACK, CONFIG) {
        var args = requestParam(URL, DATA, TYPE, CALLBACK, CONFIG),
            callback = args[3];
        args[3] = function(json) {
            var content;
            json.hasError ? callback(json.errors && json.errors[0] && json.errors[0].msg || "ajax请求，系统异常！", json.errors) : (content = json.content, content.isSuccess ? callback(null, content.retValue, content.message, content) : callback(content.message, content))
        }, request.apply(null, args)
    }, domUtil.unSerialize = function(FORM, JSON, FACTOR) {
        var name, val, obj, i = 0;
        for (FACTOR = FACTOR || util.K, JSON = FACTOR(JSON), "FORM" !== FORM.nodeName && (FORM = $(FORM).find("input,select,textarea,button")); obj = FORM[i++];)(name = obj.name) && (val = JSON[name]) && ("checkbox" === obj.type ? limit.contains(val.split(","), obj.value) ? obj.checked = !0 : obj.checked = !1 : "radio" === obj.type ? obj.value === val ? obj.checked = !0 : obj.checked = !1 : obj.value = obj.defaultValue = val)
    };
    var serialize = domUtil.serialize = function(form, factory) {
        form = $(form);
        var obj, name, formList, exclude, i = 0,
            parseArr = [],
            json = {};
        for (factory = factory || util.K, formList = form.find("[data-serialize-name]"), exclude = form.find(".JS-serialize-exclude"), form = form.find("input,select,textarea,button").not(exclude.find("input,select,textarea,button")).not(formList.find("input,select,textarea,button")); obj = form[i]; i++)
            if ((name = obj.name) && obj.disabled === !1) {
                switch (obj.type) {
                    case "radio":
                        if (!obj.checked) continue;
                        break;
                    case "checkbox":
                        obj.checked && (json[name] || (json[name] = [], parseArr.push(name)), json[name].push($.trim(obj.value)));
                        continue
                }
                json[name] = $.trim(form.eq(i).val())
            }
        return util.breakEachArr(parseArr, function(item) {
            json[item] = json[item].join(",")
        }), util.breakEachObj(json, function(val, key, obj) {
            if (REX.test(key)) {
                var tempObj = obj[RegExp.$1] || (obj[RegExp.$1] = {});
                tempObj[RegExp.$2] = val, delete obj[key]
            }
        }), formList.each(function() {
            var list, obj, node = $(this),
                serializeName = node.data("serializeName");
            (list = json[serializeName]) || (list = json[serializeName] = []), obj = serialize(node), !limit.isEmpty(obj) && list.push(obj)
        }), factory(json)
    };
    domUtil.selectSerialize = function(node, list) {
        node.length = 0, util.breakEachArr(list, function(val, key) {
            var option = new Option(val.key, val.value, (!!val.selected), (!!val.selected));
            option.disabled = !!val.disabled, node.add(option)
        })
    }, domUtil.onChange = function(node, cb) {
        function changeMain() {
            var newVal = node.val();
            newVal !== oldVal && cb.call(node, newVal, oldVal), oldVal = newVal
        }
        node = $(node);
        var oldVal = node.val();
        node.on("input.eventChange", changeMain), 9 === document.documentMode && node.on("keyup.eventChange", function(e) {
            8 === e.keyCode && changeMain()
        }), 8 === document.documentMode && node.on("propertychange.eventChange", function(e) {
            "value" === e.originalEvent.propertyName && changeMain()
        })
    }, domUtil.offChange = function(node) {
        node = $(node), node.off("input.eventChange").off("keyup.eventChange").off("propertychange.eventChange")
    }, domUtil.winScrollY = function(num) {
        return 0 === arguments.length ? window.scrollY || document.documentElement.scrollTop : (document.documentElement.scrollTop = num, void window.scrollTo(0, num))
    }, domUtil.winInnerHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }
});
define("common/handlerbars-debug", [], function(require, exports, module) {});