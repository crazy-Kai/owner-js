define("src/model/selectProperty/properties-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fixed-height"><table class="table table-bordered" style="margin-bottom:0">\t<tr data-key="a" data-value="b"><th width="50">i18nKey</th><th width="50">i18nMessage</th><th width="50">zone</th></tr>\t{{#each this}}\t<tr data-key="{{i18nKey}}" data-value="{{i18nMessage}}"><td width="50">{{i18nKey}}</td><td width="50">{{i18nMessage}}</td><td width="50">{{i18n_Lang}}</td></tr>\t{{/each}}</table></div>   ');
    return compile.source = '<div class="fixed-height"><table class="table table-bordered" style="margin-bottom:0">\t<tr data-key="a" data-value="b"><th width="50">i18nKey</th><th width="50">i18nMessage</th><th width="50">zone</th></tr>\t{{#each this}}\t<tr data-key="{{i18nKey}}" data-value="{{i18nMessage}}"><td width="50">{{i18nKey}}</td><td width="50">{{i18nMessage}}</td><td width="50">{{i18n_Lang}}</td></tr>\t{{/each}}</table></div>   ', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});