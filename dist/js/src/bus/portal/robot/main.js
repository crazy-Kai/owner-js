var sessionUuid=["wsft",(new Date).getTime(),Math.random()].join("");KISSY.add("robot/base/config",function(S){var appConfig={el:{head:"#header",body:"#content",foot:"#footer",main:"#main",side:"#side",chatpanel:"#chatpanel",chatlist:"#chatlist",inputpanel:"#inputpanel",chatinput:"#chat-input",chatbtn:"#chat-btn",inputcount:"#inputcount",extpanel:"#ext-panel",applogin:"#applogin"},tpl:{question:"#tpl-question",answer:"#tpl-answer",systips:"#tpl-systips",exttips:"#tpl-exttips",exthot:"#tpl-exthot",login:"#tpl-robot-login",defaultPaging:"#tpl-default-paging"}};return{init:function(data){return S.mix(appConfig,data,!0,["appInfo","inputSetting","appConfig","userInfo","initData"]),appConfig},get:function(){return appConfig}}},{attach:!1}),KISSY.add("robot/base/request",function(S,SDK){return function(Config){var askStatus=0;SDK.config({globalParam:{sourceId:Config.appConfig.sourceId}}),this.ask=function(data,callback){1!=askStatus&&(askStatus=1,SDK.ask(data,function(d){askStatus=0,S.isFunction(callback)&&callback(d)}))},this.isAsk=function(){return 1!=askStatus},this.feedback=function(data,callback){data.sourceId=Config.appConfig.sourceId,SDK.feedback(data,function(d){S.isFunction(callback)&&callback(d)})},this.pluginExecute=function(data,callback){data.sourceId=Config.appConfig.sourceId,SDK.pluginExecute(data,function(d){S.isFunction(callback)&&callback(d)})},this.checkUserName=function(data,callback){SDK.checkUserName(data,function(response){callback(response)})},this.addEventListener=function(name,fun){SDK.addEventListener(name,fun)},this.removeEventListener=function(name,fun){SDK.removeEventListener(name,fun)}}},{attach:!1,requires:["sdk/robot"]}),KISSY.add("robot/config",function(S,InitData,Config){return Config.init(InitData)},{attach:!1,requires:["./initdata","./base/config"]}),KISSY.add("robot/init",function(S){return{init:function(data){S.add("robot/initdata",function(S){return data}),S.use("robot/config,robot/ui/,robot/request,robot/logic/login",function(S,Config,UI,Request,Login){Login.init(function(){S.use("robot/logic/,robot/plug,robot/request,robot/config,robot/util",function(s,logic,Plug,Request,Config,Util){S.each(data.loadPlug,function(item){Plug(item.name,item.data)});var r=Math.floor(100*Math.random(0,100));if(r<Config.appConfig.greetingRate&&!Util.getUrlParam("init_ques")){var oriVal="hello_robot";Request.ask(S.mix({q:oriVal,nick:encodeURI(Config.userInfo.username)},{}),function(data){if("success"==data.status&&data.data.answer.answer&&"null"!==data.data.answer.answer){var isLoadFQ=S.one(document).data("isLoadFQ");S.one(document).data("isLoadFQ",!0),S.later(function(){UI.chatpanel.addAnswer(data.data),S.one(document).data("isLoadFQ",isLoadFQ)},500)}})}})},Config.appConfig.mustLogin)})}}}),KISSY.add("robot/logic/chat",function(S,Suggest,Util,Config,Request,UI,PlaceHolder){var $=S.all,DOM=S.DOM;Suggest.prototype._setContainerRegion=function(){var self=this,config=self.config,input=self.textInput,p=DOM.offset(input),container=self.container;DOM.css(container,{left:p.left,bottom:DOM.viewportHeight()-p.top+config.offset}),DOM.width(container,config.containerWidth||input.offsetWidth-2)},Suggest.prototype._updateInputFromSelectItem=function(){var self=this,val=self._getSelectedItemKey(self.selectedItem)||self.query;self.textInput.value=val.replace(/<[^>]+>/g,"")},Suggest.prototype._getSelectedItemKey=function(){var self=this,EMPTY="",KEY="key";return self.selectedItem?DOM.attr(self.selectedItem,KEY).replace(/<[^>]+>/g,""):EMPTY};var el=Config.el,chatbtn=$(el.chatbtn),chatinput=$(el.chatinput),disabled=function(d){d?(chatinput.prop("disabled",!0),chatinput.addClass("disabled"),chatinput.parent().addClass("disabled")):(chatinput.prop("disabled",!1),chatinput.removeClass("disabled"),chatinput.parent().removeClass("disabled"))},suggestUrl="//robot.taobao.com/services/common/suggest.json?robotCode=zhongguofawu&sessionUuid="+sessionUuid+"&sceneCode=wangshangfating";"undefined"!=typeof env&&"daily"==env&&(suggestUrl="//service.daily.taobao.net/support/minerva/ajax/suggest_ajax.do?kbs_key=robot&moduleId=");var formatData=function(data){var datahint=[],dataOrigin=data.data.recommendedKnowledgeList,question=data.data.question;if(dataOrigin)for(var i=0,len=dataOrigin.length;i<len;i++){var tag=dataOrigin[i],obj={};obj.key=tag.title.replace(new RegExp("("+question+")","g"),"<font color=red>$1</font>"),obj.result=tag.answerType,obj.knowledgeId=tag.knowledgeId,obj.knowledgeType=tag.knowledgeType,datahint.push(obj)}return datahint},_suggest=new Suggest(el.chatinput,suggestUrl,{queryName:"question",resultFormat:"约%result%次提问",dataType:1,contentRenderer:function(data){var formattedData,i,len,list,li,itemData,content="";if(formattedData=formatData(data),(len=formattedData.length)>0){for(list=DOM.create("<ol>"),i=0;i<len;++i)itemData=formattedData[i],li=_suggest._formatItem(itemData.key,itemData.result),DOM.attr(li,"key",itemData.key),DOM.attr(li,"knowledgeId",itemData.knowledgeId),DOM.attr(li,"knowledgeType",itemData.knowledgeType),DOM.addClass(li,i%2?"ks-even":"ks-odd"),list.appendChild(li);content=list}return content}}),sendmsg=function(data){_suggest.hide();var oriVal=chatinput.val(),val=S.escapeHTML(chatinput.val());if(""!=val){disabled(!0);var question=UI.chatpanel.addQuestion(val);Request.ask({question:oriVal},function(data){"success"==data.status?(question.one("div.time").html(Util.dateFormat(new Date,"yy-mm-dd HH:MM:ss")),S.later(function(){UI.chatpanel.addAnswer(data.data)},500)):question.one("div.time").html("<span class='error'>智能淘小二连接失败，请重试..</span>").on("click",function(ev){chatinput.val(question.one(".J_content").text()),chatinput[0].focus(),chkinput()}),disabled(!1),chatinput[0].focus()}),chatinput.val(""),chkinput()}},sendbyenter=function(ev){13==ev.keyCode&&sendmsg()},maxLength=Config.inputSetting.inputNumber,inputcount=$(el.inputcount).text(maxLength),chkinput=function(){var val=chatinput.val(),len=maxLength-val.length;len<0&&(chatinput.val(val.substring(0,maxLength)),len=0),inputcount.text(len)};inputcount.text(maxLength),$(el.chatinput).attr("placeholder",Config.inputSetting.defaultNoticeMsg),PlaceHolder(el.chatinput,{top:"22px",left:"19px"}),chatbtn.on("click",function(ev){sendmsg()});var hash=location.hash.slice(1);hash&&($(el.chatinput).val(hash),sendmsg()),chatinput.on("keyup",function(ev){chkinput()}).on("focus",function(){$(this).parent().addClass("chatformfocus")}).on("blur",function(){$(this).parent().removeClass("chatformfocus")}).on("keydown",function(ev){sendbyenter(ev)}),_suggest.container.shim=null,_suggest.on("beforeDataRequest",function(ev){this.shim=!1}),_suggest.on("itemSelect",function(){sendmsg({_pvf:"robotsug",knowledgeId:$(this.selectedItem).attr("knowledgeId")||"",knowledgeType:$(this.selectedItem).attr("knowledgeType")||""})}),chatinput.on("webkitspeechchange",function(){var input=chatinput[0];S.later(function(){input.focus(),_suggest.query="",_suggest.start(),chkinput()},100)})},{attach:!1,requires:["suggest","../util","../config","../request","../ui","../ui/placeholder"]}),KISSY.add("robot/logic/delegate",function(S,Suggest,Util,Config,Request,UI){var $=S.all,el=Config.el,timer=null,getAttr=function(el,attr){for(var i=0;el=el.parent();){if(el.hasAttr(attr))return el.attr(attr);if(i++>10)break}return""};$(el.body).delegate("click","a.J_TopKnowledge",function(ev){var self=this;if(ev.halt(),!Request.isAsk()||$(this).data("delayask")===!1)return void UI.chatpanel.addInfo("数据请求中，请稍后..");$(this).data("delayask",!1),timer=setTimeout(function(){$(self).data("delayask",!0)},500);var q=$(ev.currentTarget).attr("title");if(""!=q){var question=UI.chatpanel.addQuestion(q),askParam={question:q,logid:getAttr($(ev.currentTarget),"data-logid")};if($(ev.currentTarget).hasAttr("data-param")){var p=S.JSON.parse($(ev.currentTarget).attr("data-param"));S.isObject(p)&&S.mix(askParam,p)}Request.ask(askParam,function(data){"success"==data.status?(question.all("div.time").html(Util.dateFormat(new Date,"yy-mm-dd HH:MM:ss")),S.later(function(){UI.chatpanel.addAnswer(data.data),UI.extpanel.addAbout(data.data)},500)):question.one("div.time").html("<span class='error'>智能淘小二连接失败，请重试..</span>")})}}),$(el.body).delegate("click",".J_NeedLogin",function(ev){ev.halt(),S.use("robot/logic/login",function(S,Login){Login.init(function(){},!0,!0)})}),$(el.chatlist).delegate("click","ul.J_feedback li a",function(ev){var sel=$(ev.currentTarget),ul=sel.parent().parent(),selli=sel.parent(),load=$("<img src='//img.alicdn.com/tps/i3/T19mCQXbJdXXXXXXXX-60-9.gif'/>");sel[0]&&"A"!=sel[0].nodeName||(ul.all("li").hide(),ul.append(load),Request.feedback({unReason:selli.attr("data-result"),logid:getAttr($(ev.currentTarget),"data-logid"),robotChatLogId:getAttr($(ev.currentTarget),"data-robot-chatlog-id"),q:Util.encode(getAttr($(ev.currentTarget),"data-question"))},function(d){S.later(function(){load.remove(),selli.html("感谢你的反馈 <s></s>"),selli.show()},500)}))})},{requires:["suggest","../util","../config","../request","../ui"]}),KISSY.add("robot/logic/index",function(S,Config,Request,UI,Chat,Delegate,Util,IO,Event){var $=S.all;$("#toolbar a").on("click",function(){var panel=$(Config.el.chatlist),body="",msg="";panel.all(".talk-item").each(function(item){msg+=$(this).hasClass("talk-a")?'<div class="item q">':'<div class="item a">',msg+="<h3>"+$(this).all(".info-user a").attr("title")+":</h3>",msg+="<div>"+$(this).all(".J_content").html()+"</div>",msg+="<s>"+$(this).all(".time").html()+"</s>",msg+="</div>"}),body+="<html><head>",body+='<link rel="stylesheet" type="text/css" href="//assets.alicdn.com/s/kissy/1.2.0/cssreset-min.css">',body+="<style>body{margin:2em;} h1{font-size:2em;} .item{margin:10px 0;padding:1em;} .q{background:#efefef;} .a{background:#F5F9FE;} .item h3{font-size:14px;} .item s{text-decoration:none;color:#ccc;}</style>",body+="</head><body>",body+="<h1>淘宝网 - 客服机器人对话记录</h1>",body+=msg,body+="</body></html>",$("#msg-record").val(body),$("#save-form")[0].submit()});var feedbackType,randomNumber=Math.floor(100*Math.random(0,100));$("#toolbar-appraise").on("click",function(){var appraiseBox=$(".appraise-box");$(".aphrodite-submit").val("提交"),appraiseBox.hasClass("hasVote")||($(".appraise-box").show(),feedbackType=0)}),$(".aphrodite-cancle,.appraise-close").on("click",function(){$(".appraise-box").hide()}),$(".aphrodite-submit").on("click",function(){if(!$("input:checked").length)return void $(".appraise-hint").show();$(".appraise-hint").hide();for(var params={},formData=$("#appraise-form").all("input:checked,textarea"),i=0;i<formData.length;i++)params[formData[i].name]=formData[i].value;params.sourceId=Config.appConfig.sourceId,params.feedbackType=feedbackType,new IO({url:"/support/minerva/ajax/robot_feedback_ajax.do?_input_charset=UTF-8",data:params,dataType:"json",success:function(response){return response.success?($(".aphrodite-submit-fail").hide(),$(".appraise-box").hide(),Event.detach("#toolbar-appraise"),void $("#toolbar-appraise").html("已评价").attr("id","hasSubmited")):void $(".aphrodite-submit-fail").text(response.message).show()}})}),$("input[type='radio']").on("click",function(){"s3"!==this.className&&"s4"!==this.className&&"s5"!==this.className||$(".pick-checkbox").show(),"s1"!==this.className&&"s2"!==this.className||($(".pick-checkbox").hide(),$("input[type='radio']").filter(function(items){return"s1"!==items.className&&"s2"!==items.className}).attr("checked",!1))}),window.onbeforeunload=function(){if(0!==$("#toolbar-appraise").length&&randomNumber<Config.appConfig.feedbackRate)return $("#toolbar-appraise").fire("click"),feedbackType=1,randomNumber=100,$(".aphrodite-submit").val("提交并关闭机器人"),"评价一下再走吧~"}},{attach:!1,requires:["../config","../request","../ui","./chat","./delegate","../util","ajax","event"]}),KISSY.add("robot/logic/login",function(S,Util,Config,Request){var $=S.all,showDialog=function(callback,mustLogin){var dialog=Util.dialog({width:350,closable:!1,elCls:"new-popup "}),html=$($(Config.tpl.login).val()),iframe=html.all("iframe"),panel1=html.one(".loginframe"),panel2=html.one(".userinput"),btn1=html.all(".J_userinput"),btn3=(html.all(".J_J_nomember"),html.all(".J_member"));iframe.attr("src",iframe.attr("data-login-url")+"&redirect_url="+location.protocol+iframe.attr("data-redirect-url")),1==mustLogin?html.all(".extfun").hide():(btn1.on("click",function(){panel1.hide(),panel2.show(),dialog.center()}),btn3.on("click",function(){panel2.hide(),panel1.show(),dialog.center()}),html.all(".J_nomember a").on("click",function(ev){dialog.destroy(),Config.appConfig.type=3,Config.appConfig.username=Util.encode("游客"),Config.userInfo.username=Util.encode("游客"),Config.userInfo.nickname="游客",callback()}),html.one(".usernamecheck").on("click",function(ev){var userInput=html.one(".cs_username").val(),username=Util.encode(userInput);return userInput?void Request.checkUserName({loginname:username,logintype:2},function(res){res&&res.status===!0?(dialog.destroy(),Config.appConfig.type=2,Config.appConfig.username=userInput,Config.userInfo.username=userInput,Config.userInfo.nickname=userInput,callback()):alert("用户“"+userInput+"”不存在!")}):void alert("请输入用户名！")})),dialog.show(),dialog.get("body").html("").append(html),dialog.center()};return{init:function(cb,mustLogin,force){force?showDialog(cb,mustLogin):1==Config.appConfig.type?(S.log("robot notNeedLogin,then Config.appConfig.type="+Config.appConfig.type),cb()):(S.log("~~~~~~~~~~~~~~~~robot NeedLogin,then Config.appConfig.type="+Config.appConfig.type),showDialog(cb,mustLogin))}}},{attach:!1,requires:["../util","../config","../request"]}),KISSY.add("robot/plug",function(S,Util,Config,UI,Request){return function(mod,data){S.use("robot/plug/"+mod+"/",function(S,Mod){Mod(data,Util,Config,UI,Request)})}},{attach:!1,requires:["./util","./config","./ui","./request"]}),KISSY.add("robot/request",function(S,Config,Request){return new Request(Config)},{attach:!1,requires:["./config","./base/request"]}),KISSY.add("robot/ui",function(S,UI){return UI},{attach:!1,requires:["./ui/index"]}),KISSY.add("robot/ui/chatpanel",function(S,Util,Template,Scroll,Request){function ChatPanel(config){var el=config.el,tpl=config.tpl;this.config=config,this.parent=$(el.chatlist),this.tpl={question:$(tpl.question).val(),answer:$(tpl.answer).val(),tips:$(tpl.systips).val(),defaultPaging:Util.getTemplate($(tpl.defaultPaging).val())}}var $=S.all;return S.augment(ChatPanel,S.EventTarget,{addQuestion:function(q){var config=this.config,html=$(Template(this.tpl.question).render({username:config.userInfo.nickname,nickname:config.userInfo.nickname,logo:config.userInfo.logo,question:q}));return html.appendTo(this.parent),this.fire("scroll",{el:html}),html},addSentiment:function(data){var config=this.config,answerText=data.answer.sentiment;if(answerText){var html=$(Template(this.tpl.answer).render({logo:config.appInfo.logo,name:config.appInfo.name,answer:answerText,logid:data.logid,robotChatLogId:data.robotChatLogId,question:data.q}));return html.one("div.time").text(Util.dateFormat(new Date,"yy-mm-dd HH:MM:ss")),html.one(".J_feedback").hide(),html.appendTo(this.parent).css({position:"relative",top:"10px",opacity:"0.5"}),this.fire("scroll",{el:html.prev()}),html.animate({top:"0px",opacity:"1"},.6,"easeBoth",function(){html.css({position:"static"})}),html}},addAnswer:function(data){var self=this,config=this.config,answerText=data.data.answer&&data.data.answer.text;answerText||(answerText="请关注右侧的相关问题，若都不是您想要的，建议您重新提问。"),S.log("data.debug="+data.debug),data.debug&&(answerText+="<br></br>",answerText+="<br>分词结果为："+data.answer.segment,answerText+="<br>定位到的问题是："+data.answer.matchedQuestion,answerText+="<br>该问题匹配度是："+data.answer.score,answerText+="<br>该问题对应的标准问题是："+data.answer.standardQuestion,answerText+="<br>该问题knowledgeId是："+data.answer.knowledgeId,answerText+="<br>该问题catId是："+data.answer.catId);var html=$(Template(this.tpl.answer).render({logo:config.appInfo.logo,name:config.appInfo.name,answer:answerText}));if(html.one("div.time").text(Util.dateFormat(new Date,"yy-mm-dd HH:MM:ss")),0!=html.all(".paging-node").length&&S.use("gallery/pagination/1.0/index",function(S,Pagination){var pagingCfg=S.JSON.parse(html.all(".paging-node").attr("pagination")),pageSize=pagingCfg.pageSize,totalPage=Math.ceil(html.all(".paging-item").length/pageSize);new Pagination({container:html.one(".paging-container"),pageSize:pageSize,totalPage:totalPage,template:self.tpl.defaultPaging,loadCurrentPage:!0,callback:function(idx,pg,ready){html.all(".paging-item").each(function(item,index){index>=(idx-1)*pageSize&&index<idx*pageSize?item.show():item.hide()}),ready(idx)}})}),data.needFeedback=!0,data.needFeedback&&1==data.needFeedback?html.one(".J_feedback").show():html.one(".J_feedback").hide(),html.all(".J_content img").each(function(img){var maxWidth=600;img.on("load",function(){var img=$(this);this.width>maxWidth&&(this.width=maxWidth,$('<a href="'+img.attr("src")+'" target="_blank" title="查看大图"></a>').insertBefore(img).append(img))})}),10==data.type){var node=html.all(".dynamic-node"),code=node.attr("dynamic_code");if(node.hasAttr("special")){var interfaceType=node.attr("special");S.use("robot/dynknowledge/"+interfaceType+"/",function(S,Mod){new Mod(html,data,Request)})}else html.all(".ajaxtrigger").on("click",function(e){e.halt();var form=html.all("form"),param=Util.extractFormData(form,!0);html.all(".J_result").html(""),html.all(".J_result_extra").html(""),Request.pluginExecute(S.merge({knowledgeId:data.answer.knowledgeId,dynamic_code:code,key:Util.keys(param).join(",")},param),function(d){html.all(".J_result").html(d.data),html.all(".J_result_extra").html(d.extra)})})}return html.all("a").each(function(a){$(this).on("click",function(ev){var link=$(this).attr("href");if(/^\#(.+)/.test(link)){ev.halt();var el=html.all('a[name="'+link.substring(1,link.length)+'"]');el.length>0&&Scroll.scrollToElement(el[0])}})}),html.appendTo(this.parent).css({position:"relative",top:"10px",opacity:"0.5"}),this.fire("scroll",{el:html.prev()}),html.animate({top:"0px",opacity:"1"},.6,"easeBoth",function(){html.css({position:"static"})}),html},addTips:function(html){var self=this,html=$(html);html.all(".close").on("click",function(ev){ev.halt();var tg=$(this);tg.parent().hide(.3,function(){tg.parent().remove(),self.fire("scroll",{el:null})})}),this.parent.append(html),this.fire("scroll",{el:html})},addInfo:function(info){this.parent.append($('<div class="sysinfo"><i class="icon"></i>'+info+"</div>")),this.fire("scroll",{el:null})}}),ChatPanel},{attach:!1,requires:["../util","template","./scroll","../request"]}),KISSY.add("robot/ui/extpanel",function(S,Util,Anim){function ExtPanel(config){function scroll(p){var ul=p.one("ul"),firstli=ul.one("li:first"),liHeight=firstli.height(),marginTop=parseInt(ul.css("margin-top")),LINE_HEIGHT=23,speed=1.5*(liHeight+marginTop)/LINE_HEIGHT;ul.stop().animate({marginTop:-liHeight},speed,void 0,function(){firstli.appendTo(ul),ul.css("margin-top","0"),S.later(function(){scroll(hot)},0)})}function bindHotScrollMouseEvt(){hot.one("ul").height()>HOT_BOX_HEIGHT&&hot.one(".exthot").on("mouseenter",function(){hot.one("ul").stop()}).on("mouseleave",function(){scroll(hot)})}function show(p){box.all(".bd").hide(.3),box.all(".hd").removeClass("hdext"),p.all(".bd").show(.3),p.all(".hd").addClass("hdext"),p==hot?S.later(function(){hot.one("ul").height()>HOT_BOX_HEIGHT&&scroll(hot)},500):hot.one("ul").stop()}var el=config.el,panel=$(el.extpanel),box=panel.all("div.box"),tips=panel.all(".tipbox"),hot=$(box[0]),HOT_BOX_HEIGHT=($(box[1]),200);show(hot),S.later(function(){bindHotScrollMouseEvt()},500),this.addTips=function(html){html=subStr(html),tips.one("div.bd").html(html),tips.all("div.item:last").css({"border-width":"0px"})},this.addHot=function(html){hot.one("div.bd").html(html)},this.addAbout=function(data){return},this.fire("resize")}var $=S.all,subStr=function(str){return str.replace(/<a[^>]*>(.*?)<\/a>/g,function(a,b){return a.replace(/>(.*?)<\/a>/g,function(c){return"title='"+b+"'>"+Util.subStr(b,12,"..")+"</a>"})})};return S.augment(ExtPanel,S.EventTarget),ExtPanel},{attach:!1,requires:["../util","anim"]}),KISSY.add("robot/ui/filldata",function(S,Template,Config,Util){var $=S.all;return{init:function(chat,ext){var tpl=Config.tpl,data=Config.initData,extTips=Template($(tpl.exttips).val()).render({tips:data.extTips}),hot=Template($(tpl.exthot).val()).render({list:data.extHot});if(data.sysTips&&data.sysTips.length>0){var sysTips=Template($(tpl.systips).val()).render({tips:data.sysTips});chat.addTips($(sysTips))}ext.addTips(extTips),ext.addHot(hot);var appinfo=$(Config.el.head).one(".appinfo");appinfo.html(Template($("#tpl-userinfo").val()).render(Config.appInfo))}}},{attach:!1,requires:["template","../config","../util"]}),KISSY.add("robot/ui/index",function(S,Config,Layout,Scroll,ChatPanel,ExtPanel,FillData){var $=S.all,cfg=Config,el=cfg.el,ie6=6==S.UA.ie,layout=new Layout(cfg.el),scroll=Scroll,chatPanel=new ChatPanel(cfg),extPanel=new ExtPanel(cfg);return chatPanel.on("scroll",function(ev){scroll.resize(),scroll.scrollToElement(ev.el)}),layout.resize(),scroll.resize($(el.chatpanel).innerWidth(),$(el.chatpanel).innerHeight()),S.all(window).on("resize",function(){ie6&&scroll.get("container").hide(),layout.resize(),scroll.resize($(el.chatpanel).innerWidth(),$(el.chatpanel).innerHeight()),ie6&&scroll.get("container").show()}),FillData.init(chatPanel,extPanel),{layout:Layout,scroll:Scroll,chatpanel:chatPanel,extpanel:extPanel}},{attach:!1,requires:["../config","./layout","./scroll","./chatpanel","./extpanel","./filldata"]}),KISSY.add("robot/ui/layout",function(S,sizzle){var $=S.all,DOM=S.DOM;return function(el){var self=this;S.mix(self,{head:$(el.head),body:$(el.body),foot:$(el.foot),main:$(el.main),side:$(el.side),chatpanel:$(el.chatpanel),chatlist:$(el.chatlist),chatinput:$(el.chatinput),inputpanel:$(el.inputpanel),resize:function(){var docHeight=DOM.viewportHeight()<500?500:DOM.viewportHeight(),docWidth=DOM.viewportWidth()<950?950:DOM.viewportWidth(),margin=10,h=docHeight-self.head.height();self.head.width(docWidth),self.body.width(docWidth),self.side.height(h),self.main.height(h),self.chatpanel.height(h-self.inputpanel.height()-2*margin),self.chatinput.width(self.chatpanel.width()-100)}})}},{attach:!1,requires:["sizzle"]}),KISSY.add("robot/ui/placeholder",function(S){var $=S.all,support="placeholder"in document.createElement("input"),defaultConfig={focusColor:"#ccc",showColor:"#999",left:0,top:0},render=function(field,config){var tg=$(field),cfg=S.merge(defaultConfig,config||{});tip=$("<span style='position:absolute;'>"+tg.attr("placeholder")+"</span>"),tip.css({top:cfg.top,left:cfg.left,color:cfg.showColor}).on("click",function(){tg[0].focus()}),tg.parent().append(tip),tg.on("focus",function(){""==$(this).val()?tip.css({color:cfg.focusColor}):tip.hide()}).on("blur",function(){""==$(this).val()?tip.css({color:cfg.showColor}).show():tip.hide()}).on("keydown keyup",function(){""==$(this).val()?tip.show().css({color:cfg.focusColor}):tip.hide()})};return function(target,config){support||(target=$(target),!target.length>0||target.each(function(tg){$(tg).hasAttr("placeholder")&&render(tg,config)}))}}),KISSY.add("robot/ui/scroll",function(S,Config,Scroll){var $=S.all;return new Scroll($(Config.el.chatlist),{prefix:"clear-"})},{attach:!1,requires:["../config","gallery/kscroll/1.0/index"]}),KISSY.add("robot/util",function(S,Node,Calendar,Overlay){var $=Node.all,rselectTextarea=/^(?:select|textarea)/i,rinput=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,hasEnumBug=!{toString:1}.propertyIsEnumerable("toString"),enumProperties=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toString","toLocaleString","valueOf"];return{pad:function(str,len,sign){for(var l=len-str.length;l>0;)str+=sign,l--;return str},dateFormat:Calendar.Date.format,encode:function(str){return encodeURIComponent(str)},subStr:function(str,len,fill){if(str.length<=len)return str;for(var strs=str.split(""),l=strs.length,arr=[],count=0,i=0;i<l&&(/\w/g.test(strs[i])?count+=.5:count++,arr.push(strs[i]),!(count>=len));i++);return arr.join("")+(fill?fill:"")},dialog:function(config){var d={bodyContent:"<div class='loading'></div>",mask:!0,elCls:"clear-dialog",width:550,align:{points:["cc","cc"]},closable:!0};return new Overlay.Dialog(S.mix(d,config||{},!0))},getUrlParam:function(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i"),r=window.location.search.substr(1).match(reg);return null!=r?decodeURIComponent(r[2]):null},extractFormData:function(form,encode){var self=this,form=$(form)[0],elements=S.makeArray(form.elements),data=outputData={};return elements=S.filter(elements,function(el){return el.name&&!el.disabled&&(el.checked||rselectTextarea.test(el.nodeName)||rinput.test(el.type))}),S.each(elements,function(el){var vs,val=$(el).val();return(vs=data[el.name])?(vs&&!S.isArray(vs)&&(vs=data[el.name]=[vs]),void vs.push.apply(vs,S.makeArray(val))):void(data[el.name]=val)}),S.each(data,function(v,k){encode?S.isArray(v)?outputData[k]=self.encode(v.join(",")):outputData[k]=self.encode(v):S.isArray(v)?outputData[k]=v.join(","):outputData[k]=v}),outputData},getTemplate:function(str){return str.replace(/{{@/g,"{{#")},keys:function(obj){var p,i,result=[];for(p in obj)result.push(p);if(hasEnumBug)for(i=enumProperties.length-1;i>=0;i--)p=enumProperties[i],obj.hasOwnProperty(p)&&result.push(p);return result}}},{requires:["node","calendar","overlay"]}),KISSY.add("sdk/robot/base",function(S,Utils,Config,Interfaces){var sdk={},request=new Utils.request(Interfaces);return S.mix(sdk,{config:function(cfg){cfg.log&&S.isFunction(cfg.log)&&(Utils.log=cfg.log),!cfg.charset||"utf-8"!=cfg.charset&&"gbk"!=cfg.charset||(Config.charset=cfg.charset),cfg.globalParam&&(Config.globalParam=cfg.globalParam)},request:request.start,addEventListener:function(type,fun){request.on(type,function(ev){fun(ev.response)})},ask:function(question,callback){request.start({interfaceName:"ask",data:question,success:function(data,textStatus,xhrObj){callback({data:data,status:textStatus,xhr:xhrObj})},error:function(textStatus,xhrObj){callback({data:null,status:textStatus,xhr:xhrObj})}})},feedback:function(data,callback){request.start({interfaceName:"feedback",data:data,success:function(data,textStatus,xhrObj){callback(data)},error:function(textStatus,xhrObj){callback(null)}})},pluginExecute:function(data,callback){request.start({interfaceName:"pluginExecute",data:data,success:function(data,textStatus,xhrObj){callback(data)},error:function(textStatus,xhrObj){callback(null)}})},checkUserName:function(data,callback){request.start({interfaceName:"checkUserName",data:data,success:function(data,textStatus,xhrObj){data&&1==data.success?S.isFunction(callback)&&callback({status:!0,data:data,textStatus:textStatus,xhr:xhrObj}):S.isFunction(callback)&&callback({status:!1,data:data,textStatus:textStatus,xhr:xhrObj})},error:function(textStatus,xhrObj){S.isFunction(callback)&&callback({status:!1,data:null,textStatus:textStatus,xhr:xhrObj})}})},notifyLogin:function(data,callback){request.start({interfaceName:"notifyLogin",data:data,success:function(data,textStatus,xhrObj){callback(data)},error:function(textStatus,xhrObj){callback(null)}})}}),sdk.config({log:function(msg){}}),sdk},{requires:["../utils/base","./config","./interface"]}),KISSY.add("sdk/robot/config",function(S){var sdkConfig={robotConfigMap:{},urlConfig:{},dailyConfig:{common_check_user_name_url:"//service.daily.taobao.net/support/minerva/sdk/minerva_login.do",robot_ask_url:"//robot.taobao.com/services/common/answer.json?robotCode=zhongguofawu&sessionUuid="+sessionUuid+"&sceneCode=wangshangfating",robot_feedback_url:"//service.daily.taobao.net/support/minerva/sdk/RobotSdkFeedback.do",notify_login_url:"//service.daily.taobao.net/support/minerva/sdk/RobotSdkBaiduLog.do"},onlineConfig:{common_check_user_name_url:"//service.taobao.com/support/minerva/sdk/minerva_login.do",robot_ask_url:"//robot.taobao.com/services/common/answer.json?robotCode=zhongguofawu&sessionUuid="+sessionUuid+"&sceneCode=wangshangfating",robot_feedback_url:"//service.taobao.com/support/minerva/sdk/RobotSdkFeedback.do",notify_login_url:"//service.taobao.com/support/minerva/sdk/RobotSdkBaiduLog.do"}};sdkConfig.urlConfig=sdkConfig.onlineConfig;try{env&&"daily"==env?sdkConfig.urlConfig=sdkConfig.dailyConfig:sdkConfig.urlConfig=sdkConfig.onlineConfig}catch(e){S.log(e)}return sdkConfig}),KISSY.add("sdk/robot/interface",function(S,Config,Utils){var Interface=new Utils.requestStore({jsonp:"callback",dataType:"jsonp",queryName:"question"});return Interface.add("ask",{url:Config.urlConfig.robot_ask_url,data:{version:"2"},jsonpCallback:"RobotAskCallback",before:function(){Utils.log("ask before!")},success:function(result){Utils.log("ask successed!")}}),Interface.add("feedback",{url:Config.urlConfig.robot_feedback_url,data:{version:"2"},jsonpCallback:"RobotFeedbackCallback",before:function(){Utils.log("robot_feedback before")},success:function(result){Utils.log("robot_feedback success")}}),Interface.add("checkUserName",{url:Config.urlConfig.common_check_user_name_url,jsonpCallback:"MinervaLoginCallback",data:{version:"2"}}),Interface.add("notifyLogin",{url:Config.urlConfig.notify_login_url,jsonpCallback:"RobotBaiduNotifyLoginCallback",data:{version:"2"}}),Interface.add("pluginExecute",{url:"ajax/PlugAjax.do",jsonpCallback:"RobotPluginExecuteCallback",data:{version:"2"}}),Interface},{requires:["./config","../utils/base"]}),KISSY.add("sdk/utils/base",function(S,Request){var Utils={};return S.mix(Utils,{log:function(logs){S.log(logs)},requestStore:function(def){var store={},cfg={dataType:"jsonp",async:!0,type:"POST",timeout:1e5};S.mix(cfg,def||{}),this.add=function(name,config){store[name]=S.merge(cfg,config)},this.get=function(name){return store[name]}},request:Request}),Utils},{requires:["./request"]}),KISSY.add("sdk/utils/request",function(S,IO){function Request(apiconfig){this.API=apiconfig}return S.augment(Request,S.EventTarget,{start:function(config){var self=this,interfaceName=config.interfaceName,defcfg=self.API.get(interfaceName);if(!defcfg)return void S.log({code:"",message:"你请求的接口'"+config.type+"'不存在"});var param=S.clone(defcfg);S.mix(param.data,config.data),S.mix(param,config,!0,["async","type","timeout","data","jsonp","jsonpCallback","form","dataType"],!0),param.error=function(textStatus,xhrObj){try{S.isFunction(defcfg.error)&&defcfg.error(textStatus,xhrObj),S.isFunction(config.error)&&config.error(textStatus,xhrObj)}catch(e){}self.fire(interfaceName,{response:{data:null,textStatus:textStatus,xhr:xhrObj}})},param.success=function(data,textStatus,xhrObj){try{S.isFunction(defcfg.success)&&defcfg.success(data,textStatus,xhrObj),S.isFunction(config.success)&&config.success(data,textStatus,xhrObj)}catch(e){}self.fire(interfaceName,{response:{data:data,textStatus:textStatus,xhr:xhrObj}})},param.complete=function(data,textStatus,xhrObj){self.fire("complete",{response:{data:param}})},param.before&&S.isFunction(param.before)&&param.before(param.data),self.fire("before",{response:{data:param}}),self.send(param)},send:function(param){var url=param.url;/^(http|https)/.test(url)||(url=location.protocol+url);new IO({scriptCharset:"utf-8",url:url,dataType:param.dataType||"jsonp",form:param.form,jsonp:param.jsonp,jsonpCallback:param.jsonpCallback,async:!0,data:param.data,timeout:4e3,cache:!1,error:function(textStatus,xhrObj){S.log("request error!",textStatus,xhrObj),param.error&&param.error(textStatus,xhrObj)},success:function(data,textStatus,xhrObj){param.success&&param.success(data,textStatus,xhrObj)}})}}),IO.on("error",function(xhr){try{JSTracker&&JSTracker.error(JSON.stringify({url:xhr.ajaxConfig.url,data:xhr.ajaxConfig.data,status:xhr.xhr.status}))}catch(e){}}),Request},{requires:["ajax"]}),KISSY.add("sdk/robot",function(S,Robot){return Robot},{requires:["./robot/base"]});