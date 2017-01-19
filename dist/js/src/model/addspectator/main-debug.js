"use strict";
define("src/model/addspectator/main-debug", ["common/jquery-debug", "model/ajax/main-debug", "model/perSearch/main-debug", "model/modal/main-debug", "common/validator-debug", "common/handlerbars-debug", "common/myWidget-debug", "src/model/addspectator/spectator-hbs-debug", "src/model/addspectator/spectatorSeed-hbs-debug"], function(require, exports, module) {
    function save(dialog) {
        var me = this;
        new Ajax({
            request: me.get("rpcSave"),
            paramName: "paraMap",
            parseForm: dialog.element,
            autoSuccessAlert: !0
        }).on("ajaxSuccess", function() {
            dialog.$('[name="mobile"]').val(""), me.search.searchListReload(), check.call(me, dialog)
        }).submit()
    }

    function remove(dialog, node) {
        var me = this;
        new Ajax({
            request: me.get("rpcDelete"),
            paramName: "paraMap",
            param: node.data("param"),
            autoSuccessAlert: !0
        }).on("ajaxSuccess", function() {
            me.search.searchListReload(), check.call(me, dialog)
        }).submit()
    }

    function check(dialog) {
        var me = this;
        dialog.$('[data-role="delete"]').length >= me.get("size") ? dialog.$('[data-role="save"]').hide() : dialog.$('[data-role="save"]').show()
    }
    var $ = require("common/jquery-debug"),
        Ajax = require("model/ajax/main-debug"),
        PerSearch = require("model/perSearch/main-debug"),
        Modal = require("model/modal/main-debug"),
        Validator = require("common/validator-debug"),
        MyWidget = (require("common/handlerbars-debug"), require("common/myWidget-debug")),
        addSpectatorHbs = require("src/model/addspectator/spectator-hbs-debug"),
        templateSeedNode = require("src/model/addspectator/spectatorSeed-hbs-debug"),
        AddSpectator = MyWidget.extend({
            clssName: "AddSpectator",
            attrs: {
                triggerName: '[data-role="addSpectator"]',
                rpcSave: "/court/suitObserverRpc/save.json",
                rpcDelete: "/court/suitObserverRpc/delete.json",
                rpcList: "/court/suitObserverRpc/list.json",
                size: 10
            },
            events: {},
            setup: function() {
                var me = this;
                me.delegateEvents($("body"), "click " + me.get("triggerName"), function(e) {
                    me.show($(e.target).data("param"))
                })
            },
            show: function(param) {
                var me = this,
                    dialog = Modal.show(addSpectatorHbs(param), {
                        width: 650,
                        events: {
                            'click [data-role="save"]': function() {
                                Validator.oneExecute(dialog.element, '[data-widget="validator"]') || save.call(me, dialog)
                            },
                            'click [data-role="delete"]': function(e) {
                                Modal.confirm("提醒", "您确定要删除嘛？", function() {
                                    remove.call(me, dialog, $(e.target))
                                })
                            }
                        }
                    });
                dialog.before("hide", function() {
                    search.destroy()
                });
                var search = me.search = new PerSearch({
                    request: me.get("rpcList"),
                    element: dialog.element,
                    paramName: "paraMap",
                    template: templateSeedNode.source,
                    hidePage: !0,
                    onAjaxSuccess: function() {
                        dialog._setPosition(), check.call(me, dialog)
                    }
                })
            }
        });
    return AddSpectator
});
define("src/model/addspectator/spectator-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-PL20 fn-PR20 fn-PB20 fn-PT20 fn-color-666">    <div class="param">        <input type="hidden" name="securityCaseId" value="{{securityId}}" />    </div>    <div class="global-tab fn-BBS-ebebeb"><i></i>新增旁观者</div>    <div class="fn-MT10 kuma-form-item" style="padding-left:50px;">        <span style="margin-left:-50px;">手机号：</span>        <input type="text" name="mobile" value="" class="fn-input-text fn-input-text-sm fn-W180 kuma-input"            data-widget="validator"             data-required="true" data-errormessage-required="请填写手机号"             data-rule="mobile" data-errormessage-mobile="请填写正确的手机号"             maxlength="11" />        <input type="button" class="fn-btn fn-btn-primary fn-btn-sm " data-role="save" value="新增">    </div>    <div class="fn-MT10">        <table width="100%" class="fn-table fn-table-data fn-table-data-ho">            <thead>                <tr>                    <th width="50">序号</th>                    <th width="160">手机</th>                    <th>姓名</th>                    <th width="75">操作</th>                </tr>            </thead>            <tbody class="content"></tbody>        </table>    </div></div>');
    return compile.source = '<div class="fn-PL20 fn-PR20 fn-PB20 fn-PT20 fn-color-666">    <div class="param">        <input type="hidden" name="securityCaseId" value="{{securityId}}" />    </div>    <div class="global-tab fn-BBS-ebebeb"><i></i>新增旁观者</div>    <div class="fn-MT10 kuma-form-item" style="padding-left:50px;">        <span style="margin-left:-50px;">手机号：</span>        <input type="text" name="mobile" value="" class="fn-input-text fn-input-text-sm fn-W180 kuma-input"            data-widget="validator"             data-required="true" data-errormessage-required="请填写手机号"             data-rule="mobile" data-errormessage-mobile="请填写正确的手机号"             maxlength="11" />        <input type="button" class="fn-btn fn-btn-primary fn-btn-sm " data-role="save" value="新增">    </div>    <div class="fn-MT10">        <table width="100%" class="fn-table fn-table-data fn-table-data-ho">            <thead>                <tr>                    <th width="50">序号</th>                    <th width="160">手机</th>                    <th>姓名</th>                    <th width="75">操作</th>                </tr>            </thead>            <tbody class="content"></tbody>        </table>    </div></div>', compile
});
define("src/model/addspectator/spectatorSeed-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('{{#each this}}    <tr>        <td>            {{rightIndex @index}}        </td>        <td>            {{mobile}}        </td>        <td>            {{name}}        </td>        <td>            <a href="javascript:;" data-role="delete" class="fn-btn-link" data-param=\'{"suitEntityId": "{{securityId}}"}\'>删除</a>        </td>       </tr>{{/each}}');
    return compile.source = '{{#each this}}    <tr>        <td>            {{rightIndex @index}}        </td>        <td>            {{mobile}}        </td>        <td>            {{name}}        </td>        <td>            <a href="javascript:;" data-role="delete" class="fn-btn-link" data-param=\'{"suitEntityId": "{{securityId}}"}\'>删除</a>        </td>       </tr>{{/each}}', compile
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});