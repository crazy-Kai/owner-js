"use strict";define("src/bus/suit/start/common/preview/main",["bus/global/main","common/jquery","common/delegate","common/scroller","model/ajax/main"],function(require,exports,module){require("bus/global/main");var $=require("common/jquery"),delegate=require("common/delegate"),Scroller=require("common/scroller"),Ajax=require("model/ajax/main");Scroller.use(".JS-need-scroller"),delegate.on("click",".JS-trigger-click-submit",function(){var self=$(this);new Ajax({autoSubmit:!0,request:"/suit/legalCaseRpc/submitLegalCase.json",parseForm:"#pageParam",onAjaxSuccess:function(){this.redirect(self.data("href"))}})})});
"use strict";define("common/jquery",[],function(require,exports){return jQuery});