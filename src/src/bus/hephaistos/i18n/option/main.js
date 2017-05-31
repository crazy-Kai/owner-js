"use strict";
/**
 * 业务
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    //依赖
    var $ = require('$'),
        SearchList = require('model/searchList/main'), //查询列表
        Modal = require('model/modal/main'), //提示框
        Ajax = require('model/ajax/main'),
        Selectpicker = require('model/selectpicker/main'), //单选，多选
        ModalEditor = require('model/modalEditor/main'), //弹出编辑框
        SelectProperty = require('model/selectProperty/main');

    //组件:查询列表
    var searchListExp = SearchList.use('.searchList', {
        onDeleteSuccess: function(rtv, msg, response, target) {
            //点击删除后确认后的会掉
            doSucess(msg);
        },
        onEditorSuccess: function(rtv, msg, response, target) {
            //点击编辑后的内容回写
            modalEditorExp.set('title', target.prop('title'));
            rtv.id = rtv.securityId;
            modalEditorExp.modalEditorWriteback(rtv);
        }
    });


    //组件:多选
    Selectpicker.use('.selectpicker');

    new SelectProperty({trigger: $('[name="propertyKey"]')});

    //组件:弹出编辑框
    var modalEditorExp = new ModalEditor({ 
            trigger: '#addOption', 
            element: '#addOptionModal' , 
            events: {
                'click .JS-trigger-click-submit': function(e){
                    var me = this;
                    me.validator.execute(function(flag, list){
                        if(flag){
                            me.log('验证没过。', list);
                        }else{
                            var options = [];
                            $("#content > tbody > tr").each(function(index, ele) {
                                var option = {};
                                option.optionType = $("input[name='optionType']").val(); //optionType
                                option.optionKey = $(ele).children("td:eq(0)").find("input").val(); //optionKey
                                option.propertyKey = $(ele).children("td:eq(1)").find("input").val(); //propertyKey
                                option.remarks = $(ele).children("td:eq(2)").find("input").val(); //remarks
                                option.value = $(ele).children("td:eq(3)").find("input").val(); //value
                                option.sort = $(ele).children("td:eq(4)").find("input").val(); //sort

                                options.push(option);
                            });
                            new Ajax({
                                request: "/hephaistos/optionRpc/save.json",
                                paramName: "options",
                                param: options
                            }).on('ajaxSuccess', function(rtv, msg, con) {
                                me.trigger('modalEditorSuccess', rtv, msg, con);
                                me.modalEditorHide();
                            }).submit();
                        }
                    });
                    return me;
                },
                'click .JS-trigger-click-delete-row': function(e){
                    var me = this;
                    var tr = $(e.target).closest('tr')
                    tr.find('[data-required="true"]').each(function(){
                        me.validator.removeItem($(this));
                    });
                    tr.data('widget').destroy();
                    tr.remove();
                },
                'click .JS-trigger-click': function(e){
                    var me = this;
                    me.$("#content > tbody").append($("#rowItem").html());
                    var propertyWidget = new SelectProperty({trigger: $('#content > tbody [name="propertyKey"]:last')});
                    me.$('#content > tbody tr:last').data('widget', propertyWidget);
                    me.$('#content > tbody tr:last').find('[data-required="true"]').each(function(){
                        me.validator.addItem({element: this});
                    });
                }
            }

        })
        //成功保存
        .on('modalEditorSuccess', function(rtv, msg, response) {
            doSucess(msg);
        }).before('modalEditorShow', function(){
            var me = this;
            var addBtn = me.$('.JS-trigger-click');
            console.log(me.get('title'));
            me.get('title')=="编辑资源" ? addBtn.prop('disabled', true).hide() : addBtn.prop('disabled', false).show() ;
        })
        //验证之前
        .before('modalEditorExecute', function() {
            var me = this;
            //设置编辑器的值
        })
        //重置表单之后
        .after('modalEditorReset', function() {
            var me = this;

        });

    // 函数:成功后的回调
    function doSucess(msg) {
        Modal.alert('成功', msg);
        searchListExp[0].searchListReload();

    }


});

