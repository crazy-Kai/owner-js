define("src/model/applicationMatters/paymentStates-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('{{#each this}}<div class="JS-target-item" data-id="{{securityId}}">    <a href="{{url}}" class="fn-color-047dc6" target="_blank">{{wrapWord fileName 20}}</a>    <span class="fn-CuPo kuma-icon kuma-icon-close JS-trigger-click-remove" aria-hidden="true"></span></div>{{/each}}');
    return compile.source = '{{#each this}}<div class="JS-target-item" data-id="{{securityId}}">    <a href="{{url}}" class="fn-color-047dc6" target="_blank">{{wrapWord fileName 20}}</a>    <span class="fn-CuPo kuma-icon kuma-icon-close JS-trigger-click-remove" aria-hidden="true"></span></div>{{/each}}', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});