"use strict";define("src/model/filterConditions/main",["common/jquery","common/myWidget"],function(require,exports,module){var $=require("common/jquery"),MyWidget=require("common/myWidget"),FilterConditions=MyWidget.extend({events:{"click .JS-trigger-click":function(e){var me=this;return me.focus($(e.target))}},focus:function(node){var me=this,list=node.closest(".JS-target-list");return list.find(".JS-target-label").removeClass("child-focus"),node.closest(".JS-target-label").addClass("child-focus"),me.trigger("change"),me}});return FilterConditions});
"use strict";define("common/jquery",[],function(require,exports){return jQuery});