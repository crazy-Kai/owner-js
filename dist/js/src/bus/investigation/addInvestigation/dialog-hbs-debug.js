define("src/bus/investigation/addInvestigation/dialog-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-PaAl15 ">    <div class="message fn-LH30 fn-TAC">        <i class="kuma-icon kuma-icon-information fn-color-48c5ff  "></i>        <span id="messageText">         提交成功，后台处理需要10分钟左右，请您10分钟后刷新列表查看协查结果。        </span>    </div></div>');
    return compile.source = '<div class="fn-PaAl15 ">    <div class="message fn-LH30 fn-TAC">        <i class="kuma-icon kuma-icon-information fn-color-48c5ff  "></i>        <span id="messageText">         提交成功，后台处理需要10分钟左右，请您10分钟后刷新列表查看协查结果。        </span>    </div></div>', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});