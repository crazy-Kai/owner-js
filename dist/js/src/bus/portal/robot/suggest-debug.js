KISSY.add("suggest",function(h,d,j,u,m){function l(a,b,c){return this instanceof l?(this.textInput=d.get(a),this.config=c=h.merge(A,c),h.isString(b)?(b+=b.indexOf("?")===-1?"?":"&",this.dataSource=b+c.callbackName+"="+(a=c.callbackFn),2===c.dataType&&(this.config.dataType=0),a!==v&&(b=a,c=b.split("."),a=c.length,a>1?(b=b.replace(/^(.*)\..+$/,"$1"),b=h.namespace(b,!0),b[c[a-1]]=r):s[b]=r)):(this.dataSource=b,this.config.dataType=2),this.queryParams=this.query=k,this._dataCache={},this._init(),0):new l(a,b,c)}function w(a,b){1===b.nodeType?(d.html(a,k),a.appendChild(b)):d.html(a,b)}function r(a){l.focusInstance&&h.later(function(){l.focusInstance._handleResponse(a)},0)}var p,s=window,B=j.Target,o=document,x=d.get("head"),q=u.ie,y=q>=9,v="KISSY.Suggest.callback",k="",z=parseInt,C=/^(?:input|button|a)$/i,A={containerCls:k,resultFormat:"%result%",closeBtnText:"关闭",shim:6===q,submitOnSelect:!0,offset:-1,charset:"utf-8",callbackName:"callback",callbackFn:v,queryName:"q",dataType:0};return h.augment(l,B,{_init:function(){p=o.body,this._initTextInput(),this._initContainer(),this.config.shim&&this._initShim(),this._initStyle(),this._initEvent()},_initTextInput:function(){var a=this,b=a.textInput,c=!1,e=0;d.attr(b,"autocomplete","off"),a.config.autoFocus&&b.focus(),j.on(b,"keydown",function(g){var i=g.keyCode;if((35==i||36==i)&&!b.value)return void g.halt();if(27===i)a.hide(),b.value=a.query;else if(i>32&&i<41)b.value?40!==i&&38!==i||(0===e++?(a._isRunning&&a.stop(),c=!0,a._selectItem(40===i)):3==e&&(e=0),g.preventDefault()):b.blur();else if(13===i){if(b.blur(),c&&b.value==a._getSelectedItemKey()&&a.fire("itemSelect")===!1)return;a._submitForm()}else a._isRunning||a.start(),c=!1;u.chrome&&(a._keyTimer&&a._keyTimer.cancel(),a._keyTimer=h.later(function(){a._keyTimer=m},500))}),j.on(b,"keyup",function(){e=0}),j.on(b,"blur",function(){a.stop(),h.later(function(){a._focusing||a.hide()},0)})},_initContainer:function(){var a=this.config.containerCls;a=d.create("<div>",{"class":"ks-suggest-container"+(a?" "+a:k),style:"position:absolute;visibility:hidden"});var b=d.create("<div>",{"class":"ks-suggest-content"}),c=d.create("<div>",{"class":"ks-suggest-footer"});a.appendChild(b),a.appendChild(c),p.insertBefore(a,p.firstChild),this.container=a,this.content=b,this.footer=c,this._initContainerEvent()},_setContainerRegion:function(){var a=this.config,b=this.textInput,c=d.offset(b),e=this.container;d.offset(e,{left:c.left,top:c.top+b.offsetHeight+a.offset}),d.width(e,a.containerWidth||b.offsetWidth-2)},_initContainerEvent:function(){var i,t,a=this,b=a.textInput,c=a.container,e=a.content,g=a.footer;j.on(e,"mousemove",function(f){a._keyTimer||(f=f.target,"LI"!==f.nodeName&&(f=d.parent(f,"li")),d.contains(e,f)&&f!==a.selectedItem&&(a._removeSelectedItem(),a._setSelectedItem(f)))}),j.on(e,"mousedown",function(f){f=f.target,"LI"!==f.nodeName&&(f=d.parent(f,"li")),i=f}),j.on(c,"mousedown",function(f){C.test(f.target.nodeName)||(b.onbeforedeactivate=function(){s.event.returnValue=!1,b.onbeforedeactivate=null},f.preventDefault())}),j.on(e,"mouseup",function(f){var n=f.target;if(!(f.which>2)&&("LI"!==n.nodeName&&(n=d.parent(n,"li")),n==i&&d.contains(e,n)&&(a._updateInputFromSelectItem(n),a.fire("itemSelect")!==!1))){try{b.blur()}catch(D){}a._submitForm()}}),j.on(g,"focusin",function(){a._focusing=!0,a._removeSelectedItem(),t=!1}),j.on(g,"focusout",function(){a._focusing=!1,h.later(function(){t?a.hide():a._focusing||a.textInput.focus()},0)}),j.on(a.container,"mouseleave",function(){t=!0}),j.on(g,"click",function(f){d.hasClass(f.target,"ks-suggest-closebtn")&&a.hide()})},_submitForm:function(){if(this.config.submitOnSelect){var a=this.textInput.form;if(a&&this.fire("beforeSubmit",{form:a})!==!1){if(o.createEvent){var b=o.createEvent("MouseEvents");b.initEvent("submit",!0,!1),a.dispatchEvent(b)}else o.createEventObject&&a.fireEvent("onsubmit");a.submit()}}},_initShim:function(){var a=d.create("<iframe>",{src:"about:blank","class":"ks-suggest-shim",style:"position:absolute;visibility:hidden;border:none"});this.container.shim=a,p.insertBefore(a,p.firstChild)},_setShimRegion:function(){var a=this.container,b=a.style,c=a.shim;c&&d.css(c,{left:z(b.left)-2,top:b.top,width:z(b.width)+2,height:d.height(a)-2})},_initStyle:function(){d.get("#ks-suggest-style")||d.addStyleSheet(".ks-suggest-container{background:white;border:1px solid #999;z-index:99999}.ks-suggest-shim{z-index:99998}.ks-suggest-container li{color:#404040;padding:1px 0 2px;font-size:12px;line-height:18px;float:left;width:100%}.ks-suggest-container .ks-selected{background-color:#39F;cursor:default}.ks-suggest-key{float:left;text-align:left;padding-left:5px}.ks-suggest-result{float:right;text-align:right;padding-right:5px;color:green}.ks-suggest-container .ks-selected span{color:#FFF;cursor:default}.ks-suggest-footer{padding:0 5px 5px}.ks-suggest-closebtn{float:right}.ks-suggest-container li,.ks-suggest-footer{overflow:hidden;zoom:1;clear:both}.ks-suggest-container{*margin-left:2px;_margin-left:-2px;_margin-top:-3px}","ks-suggest-style")},_initEvent:function(){var a=this;j.on(s,"resize",function(){a._setContainerRegion(),a._setShimRegion()})},start:function(){var a=this;a.fire("beforeStart")!==!1&&(l.focusInstance=a,a._timer=h.later(function(){a._updateContent(),a._timer=h.later(arguments.callee,200)},200),a._isRunning=!0)},stop:function(){l.focusInstance=m,this._timer&&this._timer.cancel(),this._isRunning=!1},show:function(){if(!this.isVisible()){var a=this.container,b=a.shim;this._setContainerRegion(),a.style.visibility=k,b&&(this._setShimRegion(),b.style.visibility=k)}},hide:function(){if(this.isVisible()){var a=this.container,b=a.shim;b&&(b.style.visibility="hidden"),a.style.visibility="hidden"}},isVisible:function(){return"hidden"!=this.container.style.visibility},_updateContent:function(){var a=this.textInput;if(a.value!=this.query)if(a=this.query=a.value,h.trim(a))switch(this.config.dataType){case 0:this._dataCache[a]!==m?(this._fillContainer(this._dataCache[a]),this._displayContainer()):this._requestData();break;case 1:this._requestData();break;case 2:this._handleResponse(this.dataSource[a])}else this._fillContainer(),this.hide()},_requestData:function(){var c,a=this,b=a.config;if(q&&!y||(a.dataScript=m),!a.dataScript&&(c=o.createElement("script"),c.charset=b.charset,c.async=!0,x.insertBefore(c,x.firstChild),a.dataScript=c,!q||y)){var e=h.now();a._latestScriptTime=e,d.attr(c,"data-time",e),j.on(c,"load",function(){a._scriptDataIsOut=d.attr(c,"data-time")!=a._latestScriptTime})}a.queryParams=b.queryName+"="+encodeURIComponent(a.query),a.fire("beforeDataRequest")!==!1&&(a.dataScript.src=a.dataSource+"&"+a.queryParams)},_handleResponse:function(a){var b=k;this._scriptDataIsOut||(this.returnedData=a,this.fire("dataReturn",{data:a})!==!1&&(b=this.config.contentRenderer?this.config.contentRenderer(a):this._renderContent(a),this._fillContainer(b),this.fire("beforeShow")!==!1&&(this.config.dataType||(this._dataCache[this.query]=d.html(this.content)),this._displayContainer())))},_renderContent:function(){var a,c,e,g,i,b=k;if(a=this._formatData(this.returnedData),(c=a.length)>0){for(e=d.create("<ol>"),b=0;b<c;++b)g=a[b],g=this._formatItem(i=g.key,g.result),d.attr(g,"key",i),d.addClass(g,b%2?"ks-even":"ks-odd"),e.appendChild(g);b=e}return b},_formatData:function(a){var c,e,g,b=[],i=0;if(!a)return b;if(h.isArray(a.result)&&(a=a.result),!(c=a.length))return b;for(g=0;g<c;++g)e=a[g],h.isString(e)?b[i++]={key:e}:h.isArray(e)&&e.length>1&&(b[i++]={key:e[0],result:e[1]});return b},_formatItem:function(a,b){var e,c=d.create("<li>");return c.appendChild(d.create("<span>",{"class":"ks-suggest-key",html:a})),b&&(e=this.config.resultFormat.replace("%result%",b),h.trim(e)&&c.appendChild(d.create("<span>",{"class":"ks-suggest-result",html:e}))),c},_fillContainer:function(a,b){this._fillContent(a||k),this._fillFooter(b||k),this.isVisible()&&this._setShimRegion()},_fillContent:function(a){w(this.content,a),this.selectedItem=m},_fillFooter:function(a){var b=this.config,c=this.footer;w(c,a),b.closeBtn&&c.appendChild(d.create("<a>",{"class":"ks-suggest-closebtn",text:b.closeBtnText,href:"javascript: void(0)",target:"_self"})),this.fire("updateFooter",{footer:c,query:this.query}),d.css(c,"display",d.text(c)?k:"none")},_displayContainer:function(){h.trim(d.text(this.container))?this.show():this.hide()},_selectItem:function(a){var b=d.query("li",this.container);0!==b.length&&(this.isVisible()?(this.selectedItem?(a=b[h.indexOf(this.selectedItem,b)+(a?1:-1)],a||(this.textInput.value=this.query)):a=b[a?0:b.length-1],this._removeSelectedItem(),a&&(this._setSelectedItem(a),this._updateInputFromSelectItem())):this.show())},_removeSelectedItem:function(){d.removeClass(this.selectedItem,"ks-selected"),this.selectedItem=m},_setSelectedItem:function(a){d.addClass(a,"ks-selected"),this.selectedItem=a,this.textInput.focus()},_getSelectedItemKey:function(){return this.selectedItem?d.attr(this.selectedItem,"key"):k},_updateInputFromSelectItem:function(){this.textInput.value=this._getSelectedItemKey(this.selectedItem)||this.query}}),l.version=1.1,l.callback=r,h.Suggest=l},{requires:["dom","event","ua"]});