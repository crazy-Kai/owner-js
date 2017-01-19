define("src/bus/court/divisionCase/courtSchedue/viewrecord-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-PaAl15">    <div class="global-tab fn-BBS-ebebeb"><i></i>庭审笔录</div>    <div class="fn-PaAl5  fn-word-wrap" style="overflow:auto;">    {{{courtRecord}}}    </div></div>');
    return compile.source = '<div class="fn-PaAl15">    <div class="global-tab fn-BBS-ebebeb"><i></i>庭审笔录</div>    <div class="fn-PaAl5  fn-word-wrap" style="overflow:auto;">    {{{courtRecord}}}    </div></div>', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});