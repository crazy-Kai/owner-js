"use strict";
define("src/bus/suit/oppugnProof/oppugnProof/main-debug", ["bus/global/main-debug", "common/jquery-debug", "common/handlerbars-debug", "model/countDown/main-debug"], function(require, exports, module) {
    require("bus/global/main-debug");
    var intervalID, $ = require("common/jquery-debug"),
        handlerbars = require("common/handlerbars-debug"),
        CountDown = require("model/countDown/main-debug"),
        countDownTime = $("#count-down-time"),
        countDownNode = $("#count-down-node"),
        countDownTemplate = $("#count-down-template"),
        template = handlerbars.compile(countDownTemplate.html()),
        countDownExp = new CountDown({
            target: +countDownTime.val()
        });
    intervalID = setInterval(function() {
        var data = countDownExp.use();
        return data ? void countDownNode.html(template(data)) : clearInterval(intervalID)
    }, 1e3)
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});
define("common/handlerbars-debug", [], function(require, exports, module) {});