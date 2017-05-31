define(function(require, exports, module) { var Handlerbars = require("common/handlerbars");return Handlerbars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "define(function(require, exports, module) { var Handlerbars = require(\"common/handlerbars\");return Handlerbars.template(<div class=\"kuma-form-item\">\r\n    <label class=\"kuma-label\">\r\n        "
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"chooseCurrency",{"name":"i18n","hash":{},"data":data}))
    + "\r\n        <a href=\"javascript:;\" class=\"kuma-icon kuma-icon-information f14\" data-widget=\"~/ui.tip/\" data-content=\""
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"chooseCurrency",{"name":"i18n","hash":{},"data":data}))
    + "\"></a>\r\n    </label>\r\n    <select class=\"J_Select\" data-widget=\"~/ui.select/\" data-model-path=\"currency\">\r\n        <option value=\"CNY\" selected=\"selected\">CNY</option>\r\n        <option value=\"USD\">USD</option>\r\n        <option value=\"TWD\">TWD</option>\r\n        <option value=\"HKD\">HKD</option>\r\n    </select>\r\n</div>\r\n<div class=\"kuma-form-item\">\r\n    <label class=\"kuma-label\">\r\n        "
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"currencyMin",{"name":"i18n","hash":{},"data":data}))
    + "\r\n        <a href=\"javascript:;\" class=\"kuma-icon kuma-icon-information f14\" data-widget=\"~/ui.tip/\" data-content=\""
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"currencyMin",{"name":"i18n","hash":{},"data":data}))
    + "\"></a>\r\n    </label>\r\n    <input type=\"text\" class=\"kuma-input\" data-widget=\"textfield\" data-pattern=\"^\\d{1,5}(\\.\\d{1,2})?$\" data-required=\"true\" data-name=\""
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"currencyMin",{"name":"i18n","hash":{},"data":data}))
    + "\" data-model-path=\"min\"/>\r\n</div>\r\n<div class=\"kuma-form-item\">\r\n    <label class=\"kuma-label\">\r\n        "
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"currencyMax",{"name":"i18n","hash":{},"data":data}))
    + "\r\n        <a href=\"javascript:;\" class=\"kuma-icon kuma-icon-information f14\" data-widget=\"~/ui.tip/\" data-content=\""
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"currencyMax",{"name":"i18n","hash":{},"data":data}))
    + "\"></a>\r\n    </label>\r\n    <input type=\"text\" class=\"kuma-input\" data-widget=\"textfield\" data-pattern=\"^\\d{1,5}(\\.\\d{1,2})?$\" data-required=\"true\" data-name=\""
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"currencyMax",{"name":"i18n","hash":{},"data":data}))
    + "\" data-model-path=\"max\"/>\r\n</div>\r\n<div class=\"kuma-form-item\">\r\n    <button class=\"kuma-button kuma-button-mblue J_Search\">"
    + alias2((helpers.i18n || (depth0 && depth0.i18n) || alias1).call(depth0,"searchBtn",{"name":"i18n","hash":{},"data":data}))
    + "</button>\r\n</div>) });";
},"useData":true}) });