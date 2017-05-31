define(function(require, exports, module) { var Handlerbars = require("common/handlerbars");return Handlerbars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3="function";

  return "                <tr>\r\n                    <td>\r\n                        <label>\r\n                            <input class=\"kuma-checkbox J_CheckOne\" type=\"checkbox\"/><s></s>\r\n                        </label>\r\n                    </td>\r\n                    <td>"
    + alias2((helpers.nameNick || (depth0 && depth0.nameNick) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),(depth0 != null ? depth0.nickName : depth0),{"name":"nameNick","hash":{},"data":data}))
    + "</td>\r\n                    <td>"
    + alias2(((helper = (helper = helpers.level || (depth0 != null ? depth0.level : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"level","hash":{},"data":data}) : helper)))
    + "</td>\r\n                    <td>"
    + alias2(((helper = (helper = helpers.department || (depth0 != null ? depth0.department : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"department","hash":{},"data":data}) : helper)))
    + "</td>\r\n                    <td>"
    + alias2(((helper = (helper = helpers.salary || (depth0 != null ? depth0.salary : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"salary","hash":{},"data":data}) : helper)))
    + "</td>\r\n                    <td><a href=\""
    + alias2((helpers.uriBroker || (depth0 && depth0.uriBroker) || alias1).call(depth0,"workPrefix","u/{0}",(depth0 != null ? depth0.workNo : depth0),{"name":"uriBroker","hash":{},"data":data}))
    + "\" class=\"kuma-button kuma-button-swhite\">View</a></td>\r\n                </tr>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "define(function(require, exports, module) { var Handlerbars = require(\"common/handlerbars\");return Handlerbars.template(<div class=\"kuma-table-container\">\r\n    <table class=\"kuma-table\">\r\n        <thead>\r\n            <tr>\r\n                <th>\r\n                    <label>\r\n                        <input class=\"kuma-checkbox J_CheckAll\" type=\"checkbox\"/><s></s>\r\n                    </label>\r\n                </th>\r\n                <th>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"name",{"name":"i18n","hash":{},"data":data}))
    + "</th>\r\n                <th>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"level",{"name":"i18n","hash":{},"data":data}))
    + "</th>\r\n                <th>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"department",{"name":"i18n","hash":{},"data":data}))
    + "</th>\r\n                <th>"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"salary",{"name":"i18n","hash":{},"data":data}))
    + "</th>\r\n                <th width=\"80\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"operation",{"name":"i18n","hash":{},"data":data}))
    + "</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\r\n        <tfoot></tfoot>\r\n    </table>\r\n</div>) });";
},"useData":true}) });