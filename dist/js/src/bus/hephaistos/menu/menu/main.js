"use strict";define("src/bus/hephaistos/menu/menu/main",["common/jquery","model/searchList/main","model/modal/main","model/selectpicker/main","model/modalEditor/main","model/upload/main"],function(require,exports,module){function doSucess(msg){Modal.alert("成功",msg),searchListExp[0].searchListReload()}var SearchList=(require("common/jquery"),require("model/searchList/main")),Modal=require("model/modal/main"),Selectpicker=require("model/selectpicker/main"),ModalEditor=require("model/modalEditor/main"),Upload=require("model/upload/main"),searchListExp=SearchList.use(".searchList",{onDeleteSuccess:function(rtv,msg,response,target){doSucess(msg)},onEditorSuccess:function(rtv,msg,response,target){modalEditorExp.set("title",target.prop("title")),rtv.id=rtv.securityId,modalEditorExp.modalEditorWriteback(rtv)}});Selectpicker.use(".selectpicker");var modalEditorExp=(Upload.use(".JS-trigger-click-upload"),new ModalEditor({trigger:"#addMenu",element:"#menuModal"}).on("modalEditorSuccess",function(rtv,msg,response){doSucess(msg)}).after("modalEditorReset",function(){}).after("modalEditorWriteback",function(){var me=this;me.$("#urlBack").val(me.$("#url").val())}))});
"use strict";define("common/jquery",[],function(require,exports){return jQuery});