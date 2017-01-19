define("src/model/react/demo1/aaa-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile("<span>\t{{a}}</span>");
    return compile.source = "<span>\t{{a}}</span>", compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});