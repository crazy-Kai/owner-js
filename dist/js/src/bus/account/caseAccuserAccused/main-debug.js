"use strict";
define("src/bus/account/caseAccuserAccused/main-debug", ["bus/global/main-debug", "common/jquery-debug", "model/perSearch/main-debug", "common/validator-debug", "model/ajax/main-debug", "model/modal/main-debug", "alinw/handlebars/1.3.0/handlebars-debug"], function(require, exports, module) {
    function showModal(cont, msg, response, param) {
        Modal.show(Tpl($.extend(cont, param)), {
            width: 500,
            events: {
                'click [data-role="submit"]': function() {
                    Validator.oneExecute(this.element, '[data-widget="validator"]') || submitData.call(this)
                }
            }
        })
    }

    function submitData() {
        var me = this;
        new Ajax({
            request: "/account/mediatorResendRpc/save.json",
            paramName: "lassenSuitEntityVo",
            parseForm: me.element
        }).on("ajaxSuccess", function(val, msg, response) {
            me.hide(), searchListExp.searchListReload(), Modal.alert(1, msg)
        }).submit()
    }
    require("bus/global/main-debug");
    var $ = require("common/jquery-debug"),
        PerSearch = require("model/perSearch/main-debug"),
        Validator = require("common/validator-debug"),
        Ajax = require("model/ajax/main-debug"),
        Modal = require("model/modal/main-debug"),
        Handlebars = require("alinw/handlebars/1.3.0/handlebars-debug"),
        Tpl = Handlebars.compile($("#caseAccuserAccused-template").html()),
        searchListExp = PerSearch.use(".searchList", {
            mapResponse: function(response) {
                return response.isSuccess ? {
                    data: [].concat(response.retValue.accusedsList, response.retValue.accusersList),
                    success: !0
                } : (Modal.alert(0, response.message), {
                    data: []
                })
            },
            events: {
                'click [data-role="edit"]': function(e) {
                    new Ajax({
                        request: "/account/mediatorResendRpc/getMobileMailboxByEntityId.json",
                        param: $(e.target).data("param")
                    }).on("ajaxSuccess", showModal).submit()
                },
                'click [data-role="code"]': function(e) {
                    new Ajax({
                        request: "/account/mediatorResendRpc/sendAssociateCode.json",
                        paramName: "lassenSuitEntityVo",
                        param: $(e.target).data("param"),
                        autoSuccessAlert: !0
                    }).submit()
                }
            }
        })[0]
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});