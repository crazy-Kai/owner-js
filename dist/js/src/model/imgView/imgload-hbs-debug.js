define("src/model/imgView/imgload-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-PosRel fn-PaAl2">\t<img {{#if width}}width="{{width}}"{{/if}} src="{{href}}" />\t<a href="/fileOperation/viewDownload.json?fileIdStr={{id}}" target="_blank" class="fn-btn fn-btn-sm fn-btn-default fn-PosAbs" data-role="loadBtn" style="z-index:1;right:4px;bottom:4px;">下载</a></div>');
    return compile.source = '<div class="fn-PosRel fn-PaAl2">\t<img {{#if width}}width="{{width}}"{{/if}} src="{{href}}" />\t<a href="/fileOperation/viewDownload.json?fileIdStr={{id}}" target="_blank" class="fn-btn fn-btn-sm fn-btn-default fn-PosAbs" data-role="loadBtn" style="z-index:1;right:4px;bottom:4px;">下载</a></div>', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});