"use strict";
/**
 * 线下实名认证
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        MyWidget = require('common/myWidget'),
        Modal = require('model/modal/main'),
        Validator = require('common/validator'),
        Calendar = require('common/calendar'),
        util = require('common/util'),
        limit = require('common/limit'),
        domUtil = require('common/domUtil'),
        Ajax = require('model/ajax/main'),
        Upload = require('model/upload/main'),
        ImgView = require('model/imgView/main');

    new ImgView()
        // 模板
    var edittemplateHbs = require('./edittemplate-hbs');


    //类
    var CertificationOnsiteEdit = MyWidget.extend({
        //组件：类名
        clssName: 'CertificationOnsiteEdit',
        //组件：属性
        attrs: {
            data: {

            },
            rtv: {
                certType: 'normal'
            },
            template: {
                getter: function() {
                    return edittemplateHbs(this.get('rtv')); //将实例的data属性传递给模板,这样模板就可以使用这些数据了
                }
            }
        },
        //组件：事件
        events: {
            //法人选项点击事件
            'click .cert-legal': function() {
                var me = this;
                var rtv = me.get('rtv');
                rtv.certType = "company";

                me.$('input[type="text"]').not('[name="certificationOnsiteDto.openaccountId"]').val('');
                changeShow.call(me, 'company');
                renderUpladListByFileListDo.call(me, me.get('rtv'));
                createCalendar.call(me, me.get('rtv'));
                me.$('input[type=hidden][name="certificationOnsiteDto.certType"]').val('company');
            },
            //自然人选项点击事件
            'click .cert-normal': function() {
                var me = this;

                var rtv = me.get('rtv');
                rtv.certType = "normal";

                me.$('input[type="text"]').not('[name="certificationOnsiteDto.openaccountId"]').val('');
                createCalendar.call(me, me.get('rtv'));
                changeShow.call(me, 'normal');
                renderUpladListByFileListDo.call(me, me.get('rtv'));
                me.$('input[type=hidden][name="certificationOnsiteDto.certType"]').val('normal');
            },
            //提交按钮点击
            'click .submit-btn': function() {
                var me = this;
                var oldVal = me.get('rtv');
                var tmpVal = {};
                tmpVal.fileLicenseIds = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].uploadFileLicenseDoList && oldVal.data[0].uploadFileLicenseDoList[0] && oldVal.data[0].uploadFileLicenseDoList[0].securityId;
                tmpVal.fileFrontIds = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].uploadFileFrontDoList && oldVal.data[0].uploadFileFrontDoList[0] && oldVal.data[0].uploadFileFrontDoList[0].securityId;
                tmpVal.fileBackIds = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].uploadFileBackDoList && oldVal.data[0].uploadFileBackDoList[0] && oldVal.data[0].uploadFileBackDoList[0].securityId;
                tmpVal.fileLicenseIds = tmpVal.fileLicenseIds ? tmpVal.fileLicenseIds : (oldVal && oldVal.uploadFileLicenseDoList && oldVal.uploadFileLicenseDoList[0] && oldVal.uploadFileLicenseDoList[0].securityId);
                tmpVal.fileFrontIds = tmpVal.fileFrontIds ? tmpVal.fileFrontIds : (oldVal && oldVal.uploadFileFrontDoList && oldVal.uploadFileFrontDoList[0] && oldVal.uploadFileFrontDoList[0].securityId);
                tmpVal.fileBackIds = tmpVal.fileBackIds ? tmpVal.fileBackIds : (oldVal && oldVal.uploadFileBackDoList && oldVal.uploadFileBackDoList[0] && oldVal.uploadFileBackDoList[0].securityId);
                tmpVal.securityId = oldVal && oldVal.data && oldVal.data[0] && oldVal.data[0].securityId;
                tmpVal.securityId = tmpVal.securityId ? tmpVal.securityId : (oldVal && oldVal.securityId);
                me.validatorExp.execute(function(err, errList) {
                    if (err) {
                        util.log(errList);
                    } else {
                        var Do;
                        var ajaxData = new Ajax({
                            request: '/account/certificationOnsiteRpc/saveCertificationInfo.json',
                            parseForm: me.element,
                            param: {
                                certificationOnsiteDtoTemp: tmpVal
                            },
                            paramName: 'paramMap',
                            paramParse: function(json) {
                                //身份证正反面，营业执照值上传一条记录
                                if (json['certificationOnsiteDto'].fileBackIds) {
                                    json['certificationOnsiteDto'].fileBackIds = json['certificationOnsiteDto'].fileBackIds.split(',')[0]
                                };
                                if (json['certificationOnsiteDto'].fileFrontIds) {
                                    json['certificationOnsiteDto'].fileFrontIds = json['certificationOnsiteDto'].fileFrontIds.split(',')[0]
                                }
                                if (json['certificationOnsiteDto'].fileLicenseIds) {
                                    json['certificationOnsiteDto'].fileLicenseIds = json['certificationOnsiteDto'].fileLicenseIds.split(',')[0]
                                }
                                return json;
                            },
                        }).on('ajaxSuccess', function(rtv, msg, con) {
                            me.trigger('submitSuccess');
                            Modal.alert(1, msg);
                            me.modalExp.hide();
                        }).submit();
                    }

                });
            },
            //当注册框失去焦点时触发事件
            'blur .JS-register': function() {
                var me = this;
                var explain = me.$('.JS-register').siblings('.kuma-form-explain');
                if (explain.children().length === 0) {
                    var register = me.$('.JS-register').val();
                    if (register === me.get('openaccountIdOld')) {
                        return;
                    }
                    if (register !== '') {
                        new Ajax({
                            request: '/account/certificationOnsiteRpc/queryCertificationInfo.json',
                            paramName: 'filterMap',
                            param: {
                                openaccountId: register,
                                isLostFocus: 'y'
                            }
                        }).on('ajaxSuccess', function(rtv, msg, con) {
                            var tip = '',
                                flag = 0,
                                shortTip = me.$('#check-register'),
                                longTip = me.$('#can-modify'),
                                submitBtn = me.$('input[type=button]');
                            submitBtn.off('click', me.disableClick).removeClass('fn-btn-disabled');
                            shortTip.empty();
                            longTip.empty();
                            submitBtn.prop('disabled', false);
                            me.set('rtv', rtv);
                            var status = (rtv.data && rtv.data[0] && rtv.data[0].status);
                            //清除类型禁用
                            me.$(':radio').prop('disabled', false);
                            var isTest = (rtv.data[0] && rtv.data[0].isTest);
                            var oldIsTest = $('[name="oldIsTest"]').val();
                            if(isTest && isTest !== oldIsTest){
                                 tip = '<div style="line-height:30px;color:red">该账号不能使用，请换个账号重试！</div>';
                                flag = 1;
                            };
                            if(flag !== 1){
                                if (status === 'certification') {
                                    //只有在已实名的情况下禁用类型选择
                                    tip = '<span><i class="kuma-icon kuma-icon-error fn-VAMiddle"></i> 已实名<span>';
                                    me.$(':radio').prop('disabled', true);
                                } else if (status === 'normal') {
                                    tip = '<span style="color:#88d05c"><i class="kuma-icon kuma-icon-success fn-VAMiddle"></i> 已注册</span>';
                                } else {
                                    tip = '<span style="color:#88d05c"><i class="kuma-icon kuma-icon-success fn-VAMiddle"></i> 未注册</span>';
                                }
                                var type = (rtv.data[0] && rtv.data[0].type);
                                if (type && type !== 'normal' && type !== 'legalPerson') {
                                    tip = '<div style="line-height:30px;color:red">该账号不是当事人账号，请换个账号重试！</div>';
                                    flag = 1;
                                }
                            }
                            //tip必然会显示其中一种（已注册，未注册，已实名）
                            flag ? (longTip.html(tip) && (submitBtn.on('click', me.disableClick).addClass('fn-btn-disabled'))) :
                                (shortTip.html(tip));
                            //清除所有input[type=text]的值
                            me.$('input[type="text"]').not('[name="certificationOnsiteDto.openaccountId"]').val('');
                            //清除所有隐藏域的值
                            me.$('input[type="hidden"]').val('');
                            //重新添充表单
                            if(flag !==1 ){
                                me.rtvToData(rtv.data[0]);
                            }
                        }).submit();
                        me.set('openaccountIdOld', register);
                    }

                }
            }
        },
        //组件：初始化数据
        initProps: function() {

        },

        //组件：页面操作入口
        setup: function() {
            var me = this,
                rtv = me.get('rtv'),
                status = rtv.status,
                type = rtv && rtv.certType;
            var role = me.get('role');
            type = type || 'normal';

            me.modalExp = Modal.show(me.element, {
                width: 450
            }).before('hide', function() {
                me.destroy();
            });
            if (role === "editor") {
                if (status && status === 'normal') {
                    me.disableOpenaccountId();
                } else if (status && status === 'certification') {
                    me.disableNameType();
                }
            }
            changeShow.call(me, type);
            //日历
            createCalendar.call(me, rtv);

            //表单验证
            me.validatorExp = Validator.use('#certificationOnsiteAdd-form');

            //组件：上传
            me.upload = Upload.use('.JS-need-upload');

        },

        //组件: 销毁
        destroy: function() {
            var me = this;
            // 日期
            me['normal-dateStart']&&me['normal-dateStart'].destroy();
            me['normal-dateEnd']&&me['normal-dateEnd'].destroy();
            me['company-dateStart']&&me['company-dateStart'].destroy();
            me['company-dateEnd']&&me['company-dateEnd'].destroy();
            // 验证
            me.validatorExp.destroy();
            // 上传
            me.upload.forEach(function(item) {
                item.destroy();
            })
            CertificationOnsiteEdit.superclass.destroy.call(me);
        },
        //修改时禁用姓名和类型选择
        disableNameType: function() {
            var me = this;
            me.$("input[type=text][name='certificationOnsiteDto.openaccountId']")
                .prop('disabled', true);
            me.$("input[type=radio][name='certificationOnsiteDto.certType']")
                .prop('disabled', true);
        },
        //未注册,修改,禁用手机号条目
        disableOpenaccountId: function() {
            var me = this;
            me.$("input[type=text][name='certificationOnsiteDto.openaccountId']")
                .prop('disabled', true);
        },
        // 填充表单数据
        rtvToData: function(rtv) {
            var me = this;
            var type = rtv && rtv.certType;
            //填充普通数据
            getInfo.call(me, rtv);
            // 判断自然还是法人
            changeShow.call(me, type);
            // 获取fileList去渲染上传组件
            renderUpladListByFileListDo.call(me, rtv);
            //获取地址等
            getAddress.call(me, rtv);
            //日历启用
            createCalendar.call(me, rtv);
        },
        timeToDate: function(time, jQitem) {
            var d = new Date(time),
                year = d.getFullYear(),
                mon = d.getMonth() + 1,
                dateString,
                date = d.getDate();
            dateString = year + '-' + mon + '-' + date;
            if (jQitem) {
                jQitem.val(dateString);
            }
            return dateString;
        },
        disableClick: function() {
            return false;
        }
    });

    // 私有方法
    // 获取fileList去渲染上传组件
    function renderUpladListByFileListDo(rtv) {
        var me = this,
            arr = ['uploadFileBackDoList', 'uploadFileFrontDoList', 'uploadFileLicenseDoList'],
            map = {
                'uploadFileLicenseDoList': 'fileLicenseIds', // 公司
                'uploadFileFrontDoList': 'fileFrontIds', // 正面
                'uploadFileBackDoList': 'fileBackIds' // 反面
            };
        limit.each(arr, function(val, key) {
            var doList = rtv && rtv[val],
                uploadExp;
            // 有数据
            uploadExp = MyWidget.getWidget(me.$('[data-input-name="certificationOnsiteDto.' + map[val] + '"]'));
            uploadExp.uploadRenderClear();
            if (doList) {
                uploadExp.set('list', limit.map(doList, function(val, key) {
                    me[map[val]] = val.securityId;
                    return {
                        id: val.securityId,
                        name: val.fileName,
                        url: val.url,
                    };
                }));
                uploadExp.uploadRenderList();
            }
        });

    }
    //切换自然人 法人显示内容
    function changeShow(type) {
        type = type || 'normal';
        var me = this,
            showCls = type === 'normal' ? '#item-normal' : '#item-legal',
            hideCls = type === 'normal' ? '#item-legal' : '#item-normal',
            checkRadioId = type === 'normal' ? '#radio-normal' : '#radio-legal';
        me.$(hideCls).addClass('fn-hide').find('input').prop('disabled', true);
        me.$(showCls).removeClass('fn-hide').find('input').prop('disabled', false);
        //选中动作，因为这是根据rtv动态改变的，不是用户点击触发的
        me.$(checkRadioId).prop('checked', true);
    }
    //获取二级信息
    function getAddress(rtv) {
        var type = rtv && rtv.certType;
        var me = this;
        type = type || 'normal';
        var map = {
            'normal': 'lassenAccountNormalDo',
            'company': 'lassenAccountLegalpersonDo'
        };
        var currentInfo = rtv && rtv[map[type]];
        for (var key in currentInfo) {
            //注意不要让其中的securityId把主要的securityId覆盖了
            if (key !== 'securityId') {
                me.$('input[name="certificationOnsiteDto.' + key + '"]').val(currentInfo[key]);
            }
        }
    }
    //获取一级信息
    function getInfo(rtv) {
        var me = this;
        for (var key in rtv) {
            var selectorName = 'input[name="certificationOnsiteDto.' + key + '"]';
            //不要把radio的值也给改了，但是其它的有name的，包括hidden类型的都要添
            var item = me.$(selectorName).not(':radio');
            if (key === 'expireDateStart' || key === 'expireDateEnd') {
                me.timeToDate(rtv[key], item);
            } else {
                item.val(rtv[key]);
            }
        }
    }
    //日历切换
    function createCalendar(rtv) {
        var me = this,
            type, start, end;
        type = rtv && rtv.certType;
        start = rtv && rtv.expireDateStart && me.timeToDate(rtv.expireDateStart);
        end = rtv && rtv.expireDateEnd && me.timeToDate(rtv.expireDateEnd);
        start = start || null;
        end = end || null;
        //日历
        type = type || 'normal';
        var map = {
            'normal': '#item-normal',
            'company': '#item-legal'
        };
        var key = 'has-calendar-'+type;
        if (!me.get(key)) {
        me[type+'-dateStart'] = new Calendar({
            trigger: map[type] + ' .submit-date-fr',
            clearBtn: '.JS-reset-calendar',
            range: [null, end]
        }).on('selectDate', function(date) {
            me[type+'-dateEnd'].range([date, null]);
        });
        me[type+'-dateEnd'] = new Calendar({
            trigger: map[type] + ' .submit-date-to',
            clearBtn: '.JS-reset-calendar',
            range: [start, null]
        }).on('selectDate', function(date) {
            me[type+'-dateStart'].range([null, date]);
        });
        me.set(key,true);
        }
    }
    return CertificationOnsiteEdit;
});