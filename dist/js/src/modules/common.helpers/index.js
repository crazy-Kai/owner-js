define("src/modules/common.helpers/index",["common/jquery","crystal"],function(require,exports,module){var crystal=(require("common/jquery"),require("crystal")),app=crystal.app;module.exports={nameNick:function(name,nickName){return nickName?name+"("+nickName+")":name},uriBroker:function(prefix,path){var args=Array.prototype.slice.call(arguments,2,arguments.length-1);return app.get(prefix)+path.replace(/\{(\d+)\}/g,function(p,p1){var index=parseInt(p1);return index in args?args[index]:""})}}});
"use strict";define("common/jquery",[],function(require,exports){return jQuery});