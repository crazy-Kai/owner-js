define("src/modules/common.base.module/index",["common/jquery","crystal","src/modules/common.helpers/index"],function(require,exports,module){var $=require("common/jquery"),crystal=require("crystal"),autoRender=crystal.autoRender,helpers=(crystal.app,require("src/modules/common.helpers/index"));return crystal.moduleFactory({attrs:{tpl:null,helpers:{}},setup:function(){var me=this;me.render(),me.fetch()},fetch:function(){},renderModel:function(model){return{data:model}},_onRenderModel:function(model){var me=this,tpl=me.get("tpl"),renderModel=me.renderModel(model);autoRender.html(me.element,tpl(renderModel,{helpers:$.extend({},helpers,me.get("helpers"))}),function(elements){autoRender.bindSubModel(elements,model),setTimeout(function(){me.trigger("render")},0)})}})});
define("src/modules/common.helpers/index",["common/jquery","crystal"],function(require,exports,module){var crystal=(require("common/jquery"),require("crystal")),app=crystal.app;module.exports={nameNick:function(name,nickName){return nickName?name+"("+nickName+")":name},uriBroker:function(prefix,path){var args=Array.prototype.slice.call(arguments,2,arguments.length-1);return app.get(prefix)+path.replace(/\{(\d+)\}/g,function(p,p1){var index=parseInt(p1);return index in args?args[index]:""})}}});
"use strict";define("common/jquery",[],function(require,exports){return jQuery});