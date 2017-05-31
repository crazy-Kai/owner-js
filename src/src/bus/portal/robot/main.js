/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-30
 * Time: 下午2:20
 * To change this template use File | Settings | File Templates.
 */

 var sessionUuid = ['wsft', new Date().getTime(), Math.random()].join('');

 KISSY.add("robot/base/config", function(S){
 	var appConfig =  {
		//要控制的ID
		el: {
			//头部
			head: "#header",
			//主窗口
			body: "#content",
			//页脚
			foot: "#footer",
			//主窗口
			main: "#main",
			//侧栏
			side: "#side",
			//聊天内容面板
			chatpanel: "#chatpanel",
			//聊天记录
			chatlist: "#chatlist",
			//输入面板
			inputpanel: "#inputpanel",
			//输入框
			chatinput:"#chat-input",
			//输入按钮
			chatbtn:"#chat-btn",
            //字数统计
            inputcount: "#inputcount",
            //右侧扩展面板
            extpanel: "#ext-panel",
            //loading
            applogin:   "#applogin"
        },
        tpl:{
        	question:   "#tpl-question",
        	answer:     "#tpl-answer",
        	systips:    "#tpl-systips",
        	exttips:    "#tpl-exttips",
        	exthot:     "#tpl-exthot",
        	login:      "#tpl-robot-login",
        	defaultPaging:"#tpl-default-paging"
        }
    };

    return {
    	init: function(data){
    		S.mix(appConfig,data,true,["appInfo","inputSetting","appConfig","userInfo","initData"]);
    		return appConfig;
    	},
    	get: function(){
    		return appConfig;
    	}
    }

},{
	attach :false
});
/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-2-7
 * describe: --
 */
 KISSY.add("robot/base/request", function(S, SDK){
 	return function(Config){
 		var self = this,
            //1=发送中，0=空闲
            askStatus = 0;

            SDK.config({
            	globalParam: {
            		sourceId: Config.appConfig.sourceId
            	}
            });

        /**
         * 问答接口
         * @param question
         * @param data
         * @param callback
         */
         this.ask = function(data,callback){
			//单线程,只能一问一答-
			if(askStatus==1){
                //Utils.MessageBox.alert("正在处理其他消息，请稍后！");
                return;
            }

			//锁定状态
			askStatus=1;

            //后端需要对中文编码两次
            // data.q = encodeURI((data.q));
            // data.sourceId = Config.appConfig.sourceId;
            // data.moduleId = Config.appConfig.moduleId;

			//请求结果
			SDK.ask(data,function(d){
				askStatus=0;
				//执行回调
				if(S.isFunction(callback)){
					callback(d);
				}
			});

		};

		this.isAsk = function(){
			return askStatus==1?false:true;
		};

        /**feedback
         * 反馈接口
         * @param data
         * @param callback
         */
         this.feedback = function(data,callback){
         	data.sourceId = Config.appConfig.sourceId;
         	SDK.feedback(data,function(d){
         		if(S.isFunction(callback)){
         			callback(d);
         		}
         	});
         };

         this.pluginExecute = function(data,callback){
         	data.sourceId = Config.appConfig.sourceId;
         	SDK.pluginExecute(data,function(d){
         		if(S.isFunction(callback)){
         			callback(d);
         		}
         	});
         };


        /**
         * 检查用户名
         */
         this.checkUserName = function(data,callback){
         	SDK.checkUserName(data,function(response){
         		callback(response);
         	});
         };


        /**
         * 监听某个请求事件
         * @param name
         * @param fun
         */
         this.addEventListener = function(name,fun){
         	SDK.addEventListener(name,fun);
         };

        /**
         * 移除某个监听
         * @param name
         * @param fun
         */
         this.removeEventListener = function(name,fun){
         	SDK.removeEventListener(name,fun);
         };




     };

 },{
 	attach:false,
 	requires:["sdk/robot"]
 });
/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-3-1
 * describe: 配置文件
 */
 KISSY.add("robot/config", function(S, InitData, Config){

    /**
     * 多一层嵌套主要是为了方便其他模块能直接引用config
     */
     return Config.init(InitData);

 },{
 	attach:false,
 	requires:["./initdata", "./base/config"]
 })
/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-2-7
 * describe: 客服机器人初始化入口
 */
 KISSY.add("robot/init", function(S){
 	return {
        /**
         * 客服机器人初始化方法
         * @param data 初始化数据或者重置config中的配置
         */
         init: function(data){

            //方便robot/config模块调用
            S.add("robot/initdata", function(S){
            	return data;
            });

            //初始化config，ui,request模块，供logic模块使用
            S.use("robot/config,robot/ui/,robot/request,robot/logic/login", function(S,Config,UI,Request,Login){
            	Login.init(function(){
                    //logic依赖的组件初始化好了logic才能初始化，logic模块包含所有的事件绑定，逻辑处理等
                    S.use("robot/logic/,robot/plug,robot/request,robot/config,robot/util", function(s, logic, Plug, Request, Config, Util){
                    	S.each(data.loadPlug, function(item){
                    		Plug(item.name,item.data);
                    	});
                    	var r = Math.floor(Math.random(0,100)*100);
                    	if (r < Config.appConfig.greetingRate && !Util.getUrlParam('init_ques')) {
                    		var oriVal="hello_robot";
                    		Request.ask(S.mix({q:oriVal,nick:encodeURI(Config.userInfo.username)},{}), function(data){
                    			if(data.status=="success" && data.data.answer.answer && data.data.answer.answer!=="null"){
                    				var isLoadFQ = S.one(document).data("isLoadFQ");
                    				S.one(document).data("isLoadFQ", true);
                    				S.later(function(){
                                        //显示答案
                                        UI.chatpanel.addAnswer(data.data);
                                        S.one(document).data("isLoadFQ", isLoadFQ);
                                    },500);
                    			}
                    		});
                    	}
                    });
                }, Config.appConfig.mustLogin);
            });

        }
    };
});

/**va
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-30
 * Time: 下午2:20
 * describe: 聊天对话框各种事件
 */
 KISSY.add("robot/logic/chat", function(S, Suggest, Util, Config, Request, UI, PlaceHolder){
 	var $ = S.all, DOM = S.DOM;

    //重写suggest,底部对齐
    Suggest.prototype._setContainerRegion =  function() {
    	var self = this, config = self.config,
    	input = self.textInput,
    	p = DOM.offset(input),
    	container = self.container;

    	DOM.css(container, {
    		left: p.left,
            //bottom: DOM.docHeight() - p.top + config.offset
            bottom: DOM.viewportHeight() - p.top + config.offset
        });

    	DOM.width(container, config['containerWidth'] || input.offsetWidth - 2);
    };

    //重写suggest,过滤html代码
    Suggest.prototype._updateInputFromSelectItem = function() {
    	var self = this, val = self._getSelectedItemKey(self.selectedItem) || self.query;
        self.textInput.value = val.replace(/<[^>]+>/g,""); // 如果没有 key, 就用输入值
    };

    //过滤html代码
    Suggest.prototype._getSelectedItemKey = function () {
    	var self = this,
    	EMPTY = '',
    	KEY = 'key';
    	if (!self.selectedItem) return EMPTY;

    	return DOM.attr(self.selectedItem, KEY).replace(/<[^>]+>/g,"");
    };

    var el = Config.el,
        //发送按钮
        chatbtn =    $(el.chatbtn),
        //输入框
        chatinput =  $(el.chatinput),
        firstSentiment = true,

        //禁用文本框
        disabled = function(d){
            if(d){
                chatinput.prop("disabled",true);
                chatinput.addClass("disabled");
                chatinput.parent().addClass("disabled");
            }else{
                chatinput.prop("disabled",false);
                chatinput.removeClass("disabled");
                chatinput.parent().removeClass("disabled");
            }
        };

        var suggestUrl = "//robot.taobao.com/services/common/suggest.json?robotCode=zhongguofawu&sessionUuid="+sessionUuid+"&sceneCode=wangshangfating";
        // var suggestUrl = "//service.taobao.com/support/minerva/ajax/suggest_ajax.do?kbs_key=robot&moduleId=";

        if(typeof env !="undefined" && env=="daily"){
            suggestUrl = "//service.daily.taobao.net/support/minerva/ajax/suggest_ajax.do?kbs_key=robot&moduleId=";
        };

        var formatData=function (data) {
            // console.log(data);
            var datahint = [];
            var dataOrigin = data.data.recommendedKnowledgeList;
            var question = data.data.question;
            if (dataOrigin) {
                for(var i = 0,len=dataOrigin.length; i<len; i++){
                    var tag = dataOrigin[i], 
                        obj = {};
                    obj.key = tag.title.replace(new RegExp('('+question+')', 'g'), '<font color=red>$1</font>');
                    obj.result = tag.answerType;
                    obj.knowledgeId = tag.knowledgeId;
                    obj.knowledgeType = tag.knowledgeType;
                    datahint.push(obj);
                };
            };
            return datahint;
        }

        //suggest + "&sourceId=" + Config.appConfig.sourceId
        var _suggest = new Suggest(el.chatinput, suggestUrl , {
            queryName: 'question',
        	resultFormat: '约%result%次提问',
        	dataType: 1,
        	contentRenderer: function(data){
        		var self = this, formattedData,
        		content = '', i, len, list, li, itemData;

                // 格式化数据
                formattedData = formatData(data);

                // 填充数据
                if ((len = formattedData.length) > 0) {
                	list = DOM.create('<ol>');
                	for (i = 0; i < len; ++i) {
                		itemData = formattedData[i];
                		li = _suggest._formatItem(itemData['key'], itemData['result']);

                        // 缓存 key 值到 attribute 上
                        DOM.attr(li, 'key', itemData['key']);
                        DOM.attr(li, 'knowledgeId', itemData['knowledgeId']);
                        DOM.attr(li, 'knowledgeType', itemData['knowledgeType']);
                        // 添加奇偶 class
                        DOM.addClass(li, i % 2 ? 'ks-even': 'ks-odd');
                        list.appendChild(li);
                    }
                    content = list;
                }
                return content;
            }
        }),

        /**
         * 发送问题
         */
         sendmsg =    function(data){

         	_suggest.hide();

             //判断是否可以发起请求
             //if(!Request.isAsk()){
             //    UI.chatpanel.addInfo("数据请求中，请稍后..");
             //    return;
             //}

             //如果用户输入为空则直接返回
             var oriVal = chatinput.val();//.replace(/<[^>]+>/g,"");
             var val = S.escapeHTML(chatinput.val());
             if(val==""){
             	return;
             }
             
             disabled(true);

            /**
             * 在面板上显示问题
             */
             var question = UI.chatpanel.addQuestion(val);

            //开始发送请求
            Request.ask({question:oriVal}, function(data){
            	if(data.status=="success"){
            		question.one("div.time").html(Util.dateFormat(new Date(),"yy-mm-dd HH:MM:ss"));
            		S.later(function(){
       //                   //显示答案
       //                   if (firstSentiment && data.data.answer.sentiment) {
       //                   	firstSentiment = false;
       //                   	if (data.data.answer.sentiment === "N/A") {
       //                   		UI.chatpanel.addAnswer(data.data);
       //                   	} else {
       //                   		UI.chatpanel.addSentiment(data.data);
       //                   		S.later(function(){
       //                   			UI.chatpanel.addAnswer(data.data);
       //                   		},1500);
       //                   	}
       //                   } else {
       //                   	UI.chatpanel.addAnswer(data.data);
       //                   }
						 // //显示渠道
						 // UI.extpanel.addAbout(data.data);
						 UI.chatpanel.addAnswer(data.data);
						},500);
            	}else{
            		question.one("div.time")
            		.html("<span class='error'>智能淘小二连接失败，请重试..</span>")
            		.on("click", function(ev){
            			chatinput.val(question.one(".J_content").text());
            			chatinput[0].focus();
            			chkinput();
            		});
            	}
                 //不管成功是否，使输入框可用
                 disabled(false);
                 chatinput[0].focus();
             });

            chatinput.val("");
            chkinput();
        },

         //按Enter键发送消息
         sendbyenter=    function(ev){
         	if(ev.keyCode==13){
         		sendmsg();
         	}
         },

         //统计字数
         maxLength = Config.inputSetting.inputNumber,
         inputcount = $(el.inputcount).text(maxLength),
         chkinput = function(){
         	var val = chatinput.val(),
         	len = maxLength-val.length;
         	if(len<0){
         		chatinput.val(val.substring(0,maxLength));
         		len = 0;
         	}
         	inputcount.text(len);
         };

    //初始设置
    inputcount.text(maxLength);
    $(el.chatinput).attr("placeholder",Config.inputSetting.defaultNoticeMsg);
    PlaceHolder(el.chatinput,{
    	top:"22px",
    	left:"19px"
    });


    //按钮事件
    chatbtn.on("click", function(ev){
        //chkinput();
        sendmsg();
    });

    var hash = location.hash.slice(1);
    if(hash){
        $(el.chatinput).val(hash);
        sendmsg();
    };

    //输入框各种事件绑定
    chatinput.on("keyup", function(ev){
    	chkinput();
    }).on("focus", function(){
    	$(this).parent().addClass("chatformfocus");
    }).on("blur", function(){
    	$(this).parent().removeClass("chatformfocus");
    }).on("keydown", function(ev){
    	sendbyenter(ev);
    });



    _suggest.container.shim = null;
    _suggest.on("beforeDataRequest",function(ev){
    	this.shim = false;
    	// this.queryParams = encodeURI(this.queryParams);
    });
    _suggest.on("itemSelect", function(){
    	sendmsg({'_pvf':'robotsug','knowledgeId':$(this.selectedItem).attr('knowledgeId')||'','knowledgeType':$(this.selectedItem).attr('knowledgeType')||''});
    });

    //语音搜索事件
    chatinput.on("webkitspeechchange", function(){
    	var input = chatinput["0"];
    	S.later(function(){
    		input.focus();
    		_suggest.query="";
    		_suggest.start();
    		chkinput();
    	},100);
    });

},{
	attach: false,
	requires:["suggest","../util","../config", "../request", "../ui", "../ui/placeholder"]
});

/**va
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-30
 * Time: 下午2:20
 * To change this template use File | Settings | File Templates.
 */
 KISSY.add("robot/logic/delegate", function(S, Suggest, Util, Config, Request, UI){
 	var $ = S.all,
 	el = Config.el,
 	timer = null,
 	getAttr = function(el,attr){
 		var i=0;
 		while(el=el.parent()){
 			if(el.hasAttr(attr)){
 				return el.attr(attr);
 			}
 			if(i++>10){
 				break;
 			}
 		}
 		return "";
 	};


    //页面内部提问
    $(el.body).delegate("click","a.J_TopKnowledge", function(ev){
    	var self = this;
    	ev.halt();
    	if(!Request.isAsk() || $(this).data("delayask")===false){
    		UI.chatpanel.addInfo("数据请求中，请稍后..");
    		return;
    	}

        //防止快速重复点击
        $(this).data("delayask",false);
        timer = setTimeout(function(){
        	$(self).data("delayask",true);
        },500);

        var q = $(ev.currentTarget).attr("title");
        //直接取innerText会取到省略号或者被截断的title
		//@guoliang 2013-4-3 update 直接用title
		if(q=="")return;
		var question = UI.chatpanel.addQuestion(q);

        //允许通过data-param配置特殊参数
        var askParam = {
        	question:q,
        	logid:getAttr($(ev.currentTarget),"data-logid")
        };

        if($(ev.currentTarget).hasAttr("data-param")){
        	var p = S.JSON.parse($(ev.currentTarget).attr("data-param"));
        	if(S.isObject(p)){
        		S.mix(askParam,p);
        	}
        }
        Request.ask(askParam, function(data){
        	if(data.status=="success"){
        		question.all("div.time").html(Util.dateFormat(new Date(),"yy-mm-dd HH:MM:ss"));
        		S.later(function(){
                    //显示答案
                    UI.chatpanel.addAnswer(data.data);
                    //显示相关问题和渠道
                    UI.extpanel.addAbout(data.data);
                },500);
        	}else{
        		question.one("div.time").html("<span class='error'>智能淘小二连接失败，请重试..</span>");
        	}
        });
    });

    //登录
    $(el.body).delegate("click",".J_NeedLogin", function(ev){
    	ev.halt();
    	S.use('robot/logic/login', function(S, Login){
    		Login.init(function(){}, true, true);
    	});
    });

    //反馈
    $(el.chatlist).delegate("click","ul.J_feedback li a", function(ev){
    	var sel = $(ev.currentTarget),
    	ul = sel.parent().parent(),
    	selli = sel.parent(),
			//ul = $(ev.currentTarget),
            //sel = $(ev.target),
            //selli = sel.parent(),
            load = $("<img src='//img.alicdn.com/tps/i3/T19mCQXbJdXXXXXXXX-60-9.gif'/>");

            if(sel["0"] && sel["0"].nodeName!="A"){
            	return;
            }
            ul.all("li").hide();
            ul.append(load);
            Request.feedback(
            {
            	"unReason": selli.attr("data-result"),
            	"logid": getAttr($(ev.currentTarget),"data-logid"),
            	"robotChatLogId": getAttr($(ev.currentTarget),"data-robot-chatlog-id"),
            	"q": Util.encode(getAttr($(ev.currentTarget),"data-question"))
            }, function(d){
            	S.later(function(){
            		load.remove();
            		selli.html("感谢你的反馈 <s></s>");
            		selli.show();
            	},500);
            }
            );


        });



},{
	requires:["suggest","../util","../config", "../request", "../ui"]
});

/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-2-7
 * describe: 所有页面逻辑的入口，事件绑定等等
 */
 KISSY.add("robot/logic/index",function(S, Config, Request, UI, Chat, Delegate , Util,IO,Event){
 	var $ = S.all;
    //页面右上两个链接点击之后，要带上用户问的最后一个问题
    // $(Config.el.head).one(".otherservice li a").on("click", function(ev){
    // 	ev.halt();
    // 	var url = $(this).attr("href"),
    // 	q = $(Config.el.chatlist+" .talk-a .J_content:last");
    // 	if(q.length==1){
    // 		url += q.text();
    // 	}
    // 	if(Config.appConfig.ocsBizMap){
    // 		url += "&"+Config.appConfig.ocsBizMap;
    // 	}
    // 	window.open(url);
    // });

    //保存聊天记录
    $("#toolbar a").on("click", function(){
    	var panel = $(Config.el.chatlist),
    	body = '',
    	msg = '';
    	panel.all(".talk-item").each(function(item){
    		if($(this).hasClass("talk-a")){
    			msg += '<div class="item q">';
    		}else{
    			msg += '<div class="item a">';
    		}
    		msg += '<h3>'+$(this).all(".info-user a").attr("title")+':</h3>';
    		msg += '<div>'+$(this).all(".J_content").html()+'</div>';
    		msg += '<s>'+$(this).all(".time").html()+'</s>';
    		msg += '</div>';
    	});
    	body += '<html><head>';
    	body += '<link rel="stylesheet" type="text/css" href="//assets.alicdn.com/s/kissy/1.2.0/cssreset-min.css">';
    	body += '<style>body{margin:2em;} h1{font-size:2em;} .item{margin:10px 0;padding:1em;} .q{background:#efefef;} .a{background:#F5F9FE;} .item h3{font-size:14px;} .item s{text-decoration:none;color:#ccc;}</style>';
    	body += '</head><body>';
    	body += '<h1>淘宝网 - 客服机器人对话记录</h1>';
    	body += msg;
    	body += '</body></html>';
    	$("#msg-record").val(body);
    	$("#save-form")["0"].submit();
    });

    var feedbackType;
    var randomNumber = Math.floor(Math.random(0,100)*100);
    //满意度评价
    $('#toolbar-appraise').on('click',function(){
    	var appraiseBox = $('.appraise-box');
    	$('.aphrodite-submit').val('提交');
    	if(appraiseBox.hasClass('hasVote')){
    		return ;
    	}
    	$('.appraise-box').show();
    	feedbackType = 0;
    });
    $('.aphrodite-cancle,.appraise-close').on('click',function(){
    	$('.appraise-box').hide();
    });

    $('.aphrodite-submit').on('click',function(){
    	if(!$("input:checked").length){
    		$('.appraise-hint').show();
    		return;
    	}

    	$('.appraise-hint').hide();
    	var params = {};
    	var formData = $('#appraise-form').all("input:checked,textarea");
    	for(var i=0;i<formData.length;i++){
    		params[formData[i].name] = formData[i].value;
    	}
    	params.sourceId = Config.appConfig.sourceId;
    	params.feedbackType = feedbackType;

    	new IO({
    		url: '/support/minerva/ajax/robot_feedback_ajax.do?_input_charset=UTF-8',
    		data: params,
    		dataType: 'json',
    		success: function(response) {
    			if (!response.success) {
    				$('.aphrodite-submit-fail').text(response.message).show();
    				return;
    			}
    			$('.aphrodite-submit-fail').hide();
    			$('.appraise-box').hide();
    			Event.detach('#toolbar-appraise');
    			$('#toolbar-appraise').html('已评价').attr('id','hasSubmited');
    		}
    	});
    });

    $("input[type='radio']").on('click',function(){
    	if(this.className ==='s3'||this.className ==='s4'|| this.className==='s5'){
    		$('.pick-checkbox').show();
    	}
    	if(this.className ==='s1'||this.className ==='s2'){
    		$('.pick-checkbox').hide();

    		$("input[type='radio']").filter(function(items){
    			return items.className !=='s1'&& items.className !=='s2';
    		}).attr('checked',false);

    	}
    });

    window.onbeforeunload = function(){
    	if($('#toolbar-appraise').length!==0 && (randomNumber < Config.appConfig.feedbackRate)){
    		$('#toolbar-appraise').fire('click');
    		feedbackType = 1;
    		randomNumber = 100;
    		$('.aphrodite-submit').val('提交并关闭机器人');
    		return '评价一下再走吧~';
    	}
    };




},{
	attach: false,
	requires:["../config", "../request", "../ui", "./chat", "./delegate", "../util","ajax","event"]
});

/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-3-16
 * describe: 登录模块
 */

 KISSY.add("robot/logic/login", function(S, Util, Config, Request){
 	var $ = S.all;

    //判断登录
    var showDialog = function(callback, mustLogin){
    	var dialog = Util.dialog({
    		width:350,
    		closable:false,
    		elCls:"new-popup "
    	}),
    	html = $($(Config.tpl.login).val()),
    	iframe = html.all('iframe'),
    	panel1 = html.one(".loginframe"),
    	panel2 = html.one(".userinput"),
    	btn1 = html.all(".J_userinput"),
    	btn2 = html.all(".J_J_nomember"),
    	btn3 = html.all(".J_member");

      //构造iframe redirect-url
      iframe.attr("src",iframe.attr('data-login-url')+'&redirect_url='+location.protocol+iframe.attr('data-redirect-url'));


      if(mustLogin==true){
      	html.all(".extfun").hide();
      }
            //绑定各种事件及操作
            else{
            	btn1.on("click", function(){
            		panel1.hide();
            		panel2.show();
            		dialog.center();
            	});
            	btn3.on("click", function(){
            		panel2.hide();
            		panel1.show();
            		dialog.center();
            	});

                 //我不是淘宝会员
                 html.all(".J_nomember a").on("click", function(ev){
                 	dialog.destroy();
                 	Config.appConfig.type = 3;
                 	Config.appConfig.username = Util.encode("游客");
                 	Config.userInfo.username = Util.encode("游客");
                 	Config.userInfo.nickname = "游客";
                 	callback();
                 });

                 //忘记密码
                 html.one(".usernamecheck").on("click", function(ev){
                 	var userInput = html.one(".cs_username").val();
                 	var username = Util.encode(userInput);
                 	if(!userInput){
                 		alert("请输入用户名！");
                 		return;
                 	}
                     //要判断用户名是否存在
                     Request.checkUserName({
                     	loginname:username,
                     	logintype:2
                     },function(res){
                     	if(res && res.status===true){
                     		dialog.destroy();
                     		Config.appConfig.type = 2;
                     		Config.appConfig.username = userInput;
                     		Config.userInfo.username = userInput;
                     		Config.userInfo.nickname = userInput;
                     		callback();
                     	}else{
                     		alert("用户“"+userInput+"”不存在!");
                     	}
                     })
                 });
             }





            //设置登录地址
            dialog.show();
            dialog.get("body").html("").append(html);
            dialog.center();
            //html.one("iframe").attr("src","//login.taobao.com/member/login.jhtml?is_ignore=true&from=onlinecs&style=minisimple&minititle=&redirect_url="+location.href);
        };


        return {
        	init: function(cb, mustLogin, force){
        		if(!force){
                //有用户名就表示登录了，这个值是后端获取并且给出的
                if(Config.appConfig.type==1){
                	S.log("robot notNeedLogin,then Config.appConfig.type="+Config.appConfig.type);
                	cb();
                }else{
                	S.log("~~~~~~~~~~~~~~~~robot NeedLogin,then Config.appConfig.type="+Config.appConfig.type);
                	showDialog(cb, mustLogin);
                }
            }else{
            	showDialog(cb, mustLogin);
            }
        }
    }

},{
	attach :false,
	requires:["../util", "../config", "../request"]
});
/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-9-26
 * describe: 插件载入入口
 */
 KISSY.add("robot/plug", function(S, Util, Config, UI, Request){


 	return function(mod,data){
 		S.use("robot/plug/"+mod+"/", function(S, Mod){
 			Mod(data,Util,Config,UI,Request);
 		})
 	}


 },{
 	attach:false,
 	requires:["./util","./config","./ui","./request"]
 })
/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-3-1
 * describe: 与SDK通讯的模块，所有请求都是通过request发起的
 */
 KISSY.add("robot/request", function(S, Config, Request){

 	return new Request(Config);

 },{
 	attach:false,
 	requires:["./config", "./base/request"]
 })
/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-3-1
 * describe: UI接口
 */
 KISSY.add("robot/ui", function(S, UI){

 	return UI;

 },{
 	attach:false,
 	requires:["./ui/index"]
 })
/**
 * 聊天记录显示面板控制器.
 * User: satans17
 * Date: 11-12-30
 * Time: 下午2:20
 * To change this template use File | Settings | File Templates.
 */
 KISSY.add("robot/ui/chatpanel", function(S, Util, Template, Scroll,Request){
 	var $ = S.all;

    /**
     * 聊天版面各操作
     * @param config
     */
     function ChatPanel(config){
     	var el = config.el, tpl = config.tpl;

     	this.config = config;

        //聊天面板
        this.parent = $(el.chatlist);

        //模板
        this.tpl = {
        	question:   $(tpl.question).val(),
        	answer:     $(tpl.answer).val(),
        	tips:       $(tpl.systips).val(),
        	defaultPaging: Util.getTemplate($(tpl.defaultPaging).val())
        };

    }

    S.augment(ChatPanel, S.EventTarget, {
        /**
         * 增加问题,动画效果展示
         * @param q
         */
         addQuestion: function(q){
         	var config = this.config,
         	html = $(Template(this.tpl.question).render({
         		username:config.userInfo.nickname,
         		nickname:config.userInfo.nickname,
         		logo:config.userInfo.logo,
         		question:q
         	}));
         	html.appendTo(this.parent);
         	this.fire("scroll",{
         		el: html
         	});
         	return html;
         },

        /**
         * 增加情感安抚
         */
         addSentiment: function(data){
         	var self = this;
         	var config = this.config;
         	var answerText = data.answer.sentiment;
         	if (!answerText) return;
         	var html = $(Template(this.tpl.answer).render({
         		logo:config.appInfo.logo,
         		name:config.appInfo.name,
         		answer:answerText,
         		logid: data.logid,
         		robotChatLogId: data.robotChatLogId,
         		question: data.q
         	}));


         	html.one("div.time").text(Util.dateFormat(new Date(),"yy-mm-dd HH:MM:ss"));
         	html.one(".J_feedback").hide();
            //动画展示
            html.appendTo(this.parent).css({
            	"position": "relative",
            	"top":      "10px",
            	"opacity":  "0.5"
            });
            this.fire("scroll",{
            	el: html.prev()
            });
            html.animate(
            {
            	"top":      "0px",
            	"opacity":  "1"
            },
            .6,
            'easeBoth',
            function(){
            	html.css({
            		"position": "static"
            	});
            }
            );
            return html;
        },
        /**
         * 增加答案
         */
         addAnswer: function(data){

         	var self = this;
         	var config = this.config;
         	var answerText = data.data.answer && data.data.answer.text;
         	if(!answerText){
            	//说明是返回了问题列表
            	answerText = "请关注右侧的相关问题，若都不是您想要的，建议您重新提问。";
            };

            S.log("data.debug="+data.debug);
            if(data.debug){
            	answerText += "<br></br>";
            	answerText += "<br>"+"分词结果为："+data.answer.segment;
            	answerText += "<br>"+"定位到的问题是："+data.answer.matchedQuestion;
            	answerText += "<br>"+"该问题匹配度是："+data.answer.score;
            	answerText += "<br>"+"该问题对应的标准问题是："+data.answer.standardQuestion;
            	answerText += "<br>"+"该问题knowledgeId是："+data.answer.knowledgeId;
            	answerText += "<br>"+"该问题catId是："+data.answer.catId;
            	
            };

            var html = $(Template(this.tpl.answer).render({
            	logo:config.appInfo.logo,
            	name:config.appInfo.name,
            	answer:answerText,
            	// logid: data.logid,
            	// robotChatLogId: data.robotChatLogId,
            	// question: data.q
            }));
            

            html.one("div.time").text(Util.dateFormat(new Date(),"yy-mm-dd HH:MM:ss"));
            //如果是初始问题的答案
//            if($(document).hasData("isLoadFQ") && $(document).data("isLoadFQ") === false ){
//                html.one(".J_content").after('<div class="J_Contact contact-service">\
//                                                    若当前问题仍未解决，请点击<a target="_blank" href="//service.taobao.com/support/onlinecs/ocs.htm?source_id=1774213283"><img src="//img.alicdn.com/tps/i2/T1iGzQXbloXXaqj.77-120-34.png"></a>\
//                                                </div>');
//                $(document).data("isLoadFQ", true);
//            }
            //处理分页
            if(html.all('.paging-node').length != 0){
            	S.use('gallery/pagination/1.0/index', function(S, Pagination){
            		var pagingCfg = S.JSON.parse(html.all('.paging-node').attr('pagination')); 
            		var pageSize = pagingCfg.pageSize;
            		var totalPage = Math.ceil(html.all('.paging-item').length/pageSize);
                    //if(totalPage != 0 && totalPage != 1){
                    	var pagination = new Pagination({
                    		container: html.one('.paging-container'),
                    		pageSize: pageSize,
                    		totalPage: totalPage,
                    		template: self.tpl.defaultPaging,
                    		loadCurrentPage: true,
                    		callback: function(idx, pg, ready) {
                    			html.all('.paging-item').each(function(item, index){
                    				if(index >= (idx - 1) * pageSize && index < idx * pageSize)
                    					item.show();
                    				else
                    					item.hide();
                    			});
                    			ready(idx);

                    		}
                    	});
                    //}
                });;
            }

            //是否有反馈
            data.needFeedback = true;
            if(data.needFeedback && data.needFeedback==true){
            	html.one(".J_feedback").show();
            }else{
            	html.one(".J_feedback").hide();
            }

            //处理过大的图片
            html.all(".J_content img").each(function(img){
            	var maxWidth = 600;
            	img.on("load", function(){
            		var img = $(this);
            		if(this.width>maxWidth){
            			this.width=maxWidth;
            			$('<a href="'+img.attr("src")+'" target="_blank" title="查看大图"></a>').insertBefore(img).append(img);
            		}
            	});
            });
            
            // if(data.type==10){
            // 	html.all(".ajaxbutton").on("click", function(ev){
            // 		var btn = $(this);  
            // 		var zihao=btn.parent().one("#zihao");
            // 		btn.parent().all('.J_result').html(''); 
            // 		btn.parent().all('.J_result_extra').html(''); 
            // 		  Request.pluginExecute(
            // 		            {"zihao":Util.encode(zihao.val())
            // 		            }, function(d){
            // 		            	btn.parent().all('.J_result').append(d.data); 
            // 		            	btn.parent().all('.J_result_extra').append(d.extra); 
            
            // 		            }
            // 		        );

            //     });
            // }
            //插件型的知识
            if(data.type==10){
            	var node = html.all('.dynamic-node');
            	var code = node.attr('dynamic_code');
            	if(node.hasAttr('special')){
            		var interfaceType = node.attr('special');
            		S.use('robot/dynknowledge/' + interfaceType + '/', function(S, Mod){
            			new Mod(html, data, Request);
            		});
            	}else{
            		html.all(".ajaxtrigger").on("click", function(e){
            			e.halt();
            			var form = html.all('form');
            			var param = Util.extractFormData(form, true) ;
            			html.all('.J_result').html(''); 
            			html.all('.J_result_extra').html(''); 
            			Request.pluginExecute(S.merge({
            				'knowledgeId': data.answer.knowledgeId,
            				'dynamic_code': code,
            				'key': Util.keys(param).join(',')
            			}, param), function(d){
            				html.all('.J_result').html(d.data); 
            				html.all('.J_result_extra').html(d.extra);             
            			});                    
            		});
            	}                
            }
            


            //处理知识锚点问题
            html.all("a").each(function(a){
            	$(this).on("click", function(ev){
            		var link = $(this).attr("href");
            		if(/^\#(.+)/.test(link)){
            			ev.halt();
            			var el = html.all('a[name="'+link.substring(1,link.length)+'"]');
            			if(el.length>0){
            				Scroll.scrollToElement(el[0]);
            			}
            		}
            	})
            });



            //动画展示
            html.appendTo(this.parent).css({
            	"position": "relative",
            	"top":      "10px",
            	"opacity":  "0.5"
            });
            this.fire("scroll",{
            	el: html.prev()
            });
            html.animate(
            {
            	"top":      "0px",
            	"opacity":  "1"
            },
            .6,
            'easeBoth',
            function(){
            	html.css({
            		"position": "static"
            	});
            }
            );
            return html;
        },
        
        /**
         * 增加提示
         */
         addTips: function(html){
         	var self = this,
         	html = $(html);
         	html.all(".close").on("click", function(ev){
         		ev.halt();
         		var tg = $(this);
         		tg.parent().hide(.3, function(){
         			tg.parent().remove();
         			self.fire("scroll",{
         				el: null
         			});
         		});
         	});
         	this.parent.append(html);
         	this.fire("scroll",{
         		el: html
         	});
         },
        /**
         * 增加系统消息
         * @param info
         */
         addInfo: function(info){
         	this.parent.append($('<div class="sysinfo"><i class="icon"></i>'+info+'</div>'));
         	this.fire("scroll",{
         		el: null
         	});
         }

     });


return ChatPanel;

},{
	attach: false,
	requires:["../util","template","./scroll", "../request"]
});

/**
 * 聊天记录显示面板控制器.
 * User: satans17
 * Date: 11-12-30
 * Time: 下午2:20
 * To change this template use File | Settings | File Templates.
 */
 KISSY.add("robot/ui/extpanel", function(S, Util, Anim){
 	var $ = S.all,
 	subStr = function(str){
 		return str.replace(/<a[^>]*>(.*?)<\/a>/g,function(a,b){
 			return a.replace(/>(.*?)<\/a>/g,function(c){
 				return "title='"+b+"'>"+Util.subStr(b,12,"..")+"</a>";
 			});
 		});
 	};

    /**
     * 扩展面板各操作
     * @param config
     */
     function ExtPanel(config){
     	var el = config.el,
     	panel = $(el.extpanel),
     	box = panel.all("div.box"),
            tips = panel.all('.tipbox'),//$(box[2]),
            hot = $(box[0]),
            other = $(box[1]),
            HOT_BOX_HEIGHT = 200;


        /**
         * 滚动播放各条目
         */
         function scroll(p){
         	var ul = p.one('ul'),
         	firstli = ul.one('li:first'),
         	liHeight = firstli.height(),
         	marginTop = parseInt(ul.css('margin-top')),
         	LINE_HEIGHT = 23,
         	speed = (liHeight + marginTop) * 1.5 / LINE_HEIGHT;
            //console.log("speed:"+speed+" liHeight:"+liHeight+" marginTop:"+marginTop);
            ul.stop().animate({marginTop:-liHeight},speed,undefined,function(){
            	firstli.appendTo(ul);
            	ul.css('margin-top','0');
            	S.later(function(){
            		scroll(hot);
            	},0);
            });
        }

        function bindHotScrollMouseEvt(){
        	if(hot.one('ul').height() > HOT_BOX_HEIGHT){
        		hot.one('.exthot').on('mouseenter',function(){
        			hot.one('ul').stop();
        		}).on('mouseleave',function(){
        			scroll(hot);
        		});
        	}
        }


        function show(p){
        	box.all(".bd").hide(.3);
        	box.all(".hd").removeClass("hdext");
        	p.all(".bd").show(.3);
        	p.all(".hd").addClass("hdext");
        	if(p == hot){
        		S.later(function(){
        			if(hot.one('ul').height() > HOT_BOX_HEIGHT){
        				scroll(hot);
        			}
        		},500);
        	}else{
        		hot.one('ul').stop();
        	}
        }

        function hide(p){
        	p.all(".bd").hide();
        	p.all(".hd").removeClass("hdext");
        	if(p == hot){
        		hot.one('ul').stop();
        	}
        }

        //热点问题默认展示
        show(hot);

        //绑定鼠标进出滚动区的事件
        S.later(function(){
        	bindHotScrollMouseEvt();
        },500);

        //热点问题点击后刷新
        // hot.one("div.hd").on("click", function(){
        // 	show(hot);
        // });

        // 热点问题和相关内容切换
        // other.one("div.hd").on("click", function(){
        // 	show(other);
        // });



        this.addTips = function(html){
        	html = subStr(html);
        	tips.one("div.bd").html(html);
            //去掉最后一条线
            tips.all("div.item:last").css({
            	"border-width":"0px"
            });
        };

        this.addHot = function(html){
            //html = subStr(html);
            hot.one("div.bd").html(html);
        };

        this.addAbout = function(data){
            return;
        	if(!data.recommonedQuestionList.length>0 && !data.serviceRouteList.length>0){
        		return;
        	}
        	show(other);
        	var html = "";


            //相关问题
            if(!data.hideRecomm){
            	if(data.recommonedQuestionList && data.recommonedQuestionList.length>0){
            		html += '<div class="item" data-logid="'+data.logid+'"><h4>相关问题</h4><ul class="list">';
            		S.each(data.recommonedQuestionList, function(item){
            			html += '<li data-id="'+item.knowledgeId+'"><a class="J_TopKnowledge" href="#">'+item.title+'</a></li>';
            		});
            		html += '</ul></div>';
            	}
            }
            

            html = subStr(html);

            //其他渠道
            if(data.serviceRouteList){
            	var tel=[], selfhelp=[], otherservice=[], ocs=[],
            	slist = [],
            	tpl = '<div class="item"><h4>{title}</h4><ul class="list">{content}</ul></div>';
            	S.each(data.serviceRouteList, function(item){
                    //电话
                    if(item.routeType==1){
                    	tel.push('<li class="tel">'+item.content+'</li>');
                    }
                    //自助服务
                    else if(item.routeType==2){
                    	selfhelp.push('<li class="selfhelp"><a href="'+item.link+'" target="_blank">'+item.content+'</a></li>');
                    }
                    //其他
                    else if(item.routeType==3){
                    	otherservice.push('<li class="other"><a href="'+item.link+'" target="_blank">'+item.content+'</a></li>');
                    }
                    //在线客服
                    else if(item.routeType==4){
                    	if(item.link.indexOf('service.taobao.com')>-1){
                    		ocs.push('<li class="ocs"><a href="'+item.link+'" target="_blank">'+item.content+'</a></li>');
                    	}else{
                    		ocs.push('<li class="ocs"><a href="//service.taobao.com/support/onlinecs/ocs.htm?source_id='+item.link+'" target="_blank">'+item.content+'</a></li>');
                    	}

                    }
                });
            	if(tel.length>0){
            		slist.push(tpl.replace("{title}","客服电话").replace("{content}",tel.join("")));
            	}
            	if(selfhelp.length>0){
            		slist.push(tpl.replace("{title}","自助服务").replace("{content}",selfhelp.join("")));
            	}
            	if(otherservice.length>0){
            		slist.push(tpl.replace("{title}","其他").replace("{content}",otherservice.join("")));
            	}
            	if(ocs.length>0){
            		slist.push(tpl.replace("{title}","在线客服").replace("{content}",ocs.join("")));
            	}
            }

            if(html=="" && !data.hideRecomm){
            	other.one("div.bd").html("<div>没有相关问题！</div>");
            }else{
            	other.one("div.bd").html(html+slist.join(""));
            }


            //去掉最后一条线
            other.all("div.item:last").css({
            	"border-width":"0px"
            });

        };


        this.fire("resize");

    }

    S.augment(ExtPanel, S.EventTarget);

    return ExtPanel;

},{
	attach: false,
	requires:["../util","anim"]
});

/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-2-8
 * describe: 初始化页面上的数据
 */
 KISSY.add("robot/ui/filldata", function(S, Template, Config, Util){
 	var $ = S.all;

 	return {
 		init: function(chat,ext){
 			var tpl = Config.tpl,
 			data = Config.initData,
 			extTips = Template($(tpl["exttips"]).val()).render({
 				tips:data["extTips"]
 			}),
 			hot = Template($(tpl["exthot"]).val()).render({
 				list:data["extHot"]
 			});

            //系统提示信息
            if(data["sysTips"] && data["sysTips"].length>0){
            	var sysTips = Template($(tpl["systips"]).val()).render({
            		tips:data["sysTips"]
            	});
            	chat.addTips($(sysTips));
            }


            //扩展面板 相关小贴士
            ext.addTips(extTips);
            //热点问题
            ext.addHot(hot);

            //机器人信息
            var appinfo = $(Config.el.head).one(".appinfo");
            appinfo.html(Template($("#tpl-userinfo").val()).render(Config.appInfo));

        }
    }


},{
	attach: false,
	requires:["template", "../config", "../util"]
});

/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-2-7
 * describe: UI初始化，各种事件绑定
 */
 KISSY.add("robot/ui/index", function(S, Config, Layout, Scroll, ChatPanel, ExtPanel, FillData){
 	var $ = S.all,
 	cfg = Config,
 	el = cfg.el,
 	ie6 = S.UA.ie==6,
        //初始化布局
        layout = new Layout(cfg.el),

        //初始化scroll控件
        scroll = Scroll,//new Scroll($(el.chatlist),{prefix:"clear-"}),

        //初始化面板
        chatPanel = new ChatPanel(cfg),

        //扩展面板
        extPanel = new ExtPanel(cfg);

    //注册chatPanel scroll事件，主要为了同步scroll组件
    chatPanel.on("scroll", function(ev){
    	scroll.resize();
    	scroll.scrollToElement(ev.el);
    });

    //重置控件
    layout.resize();
    scroll.resize($(el.chatpanel).innerWidth(),$(el.chatpanel).innerHeight());

    //window resize
    S.all(window).on("resize",function(){
    	ie6&&scroll.get("container").hide();
    	layout.resize();
    	scroll.resize($(el.chatpanel).innerWidth(),$(el.chatpanel).innerHeight());
    	ie6&&scroll.get("container").show();
    });

    //填充页面数据
    FillData.init(chatPanel,extPanel);


    return {
        /**
          * 布局接口
          */
          layout: Layout,

         /**
          * 滚动条接口
          */
          scroll: Scroll,

         /**
          * 聊天面板接口
          */
          chatpanel: chatPanel,

         /**
          * 扩展面板接口
          */
          extpanel: extPanel
      }



  },{
  	attach :false,
  	requires:["../config", "./layout","./scroll","./chatpanel","./extpanel","./filldata"]
  });
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-30
 * Time: 下午2:20
 * To change this template use File | Settings | File Templates.
 */
 KISSY.add("robot/ui/layout", function(S, sizzle){
 	var $ = S.all, DOM = S.DOM;

 	return function(el){
 		var self = this;
 		S.mix(self,{
 			head: $(el.head),
 			body: $(el.body),
 			foot: $(el.foot),
 			main: $(el.main),
 			side: $(el.side),
 			chatpanel: $(el.chatpanel),
 			chatlist: $(el.chatlist),
 			chatinput: $(el.chatinput),
 			inputpanel: $(el.inputpanel),

			//重置窗口大小
			resize: function(){
				var docHeight = (DOM.viewportHeight()<500)?500:DOM.viewportHeight(),
				docWidth = (DOM.viewportWidth()<950)?950:DOM.viewportWidth(),
				margin = 10,
				h = docHeight - self.head.height();
				
				//宽度也得自适应
				self.head.width(docWidth);
				self.body.width(docWidth);
				
				//高度自适应
				self.side.height(h);
				self.main.height(h);
				//self.chatpanel.css({margin:10});
				self.chatpanel.height(h-self.inputpanel.height()-margin*2);

                //其他元素
                self.chatinput.width(self.chatpanel.width()-100);

            }
        });
 	}

 },{
 	attach:false,
 	requires:["sizzle"]
 });
 KISSY.add("robot/ui/placeholder",function(S){

 	var $ = S.all,
 	support = "placeholder" in document.createElement("input"),
 	defaultConfig = {
 		focusColor:"#ccc",
 		showColor:"#999",
 		left:0,
 		top:0
 	},
 	render = function(field,config){
 		var tg = $(field),
 		cfg = S.merge(defaultConfig,config||{})
 		tip = $("<span style='position:absolute;'>"+tg.attr('placeholder')+"</span>");

 		tip.css({
 			"top": cfg.top,
 			"left": cfg.left,
 			"color": cfg.showColor
 		}).on("click", function(){
 			tg["0"].focus();
 		});

			//wrap
			//$("<span style='position:relative;'></span>").insertBefore(tg).append(tg).append(tip);
			tg.parent().append(tip);
			
			tg.on("focus", function(){
				if($(this).val()==""){
					tip.css({color:cfg.focusColor});
				}else{
					tip.hide();
				}
			})
			.on("blur", function(){
				if($(this).val()==""){
					tip.css({color:cfg.showColor}).show();
				}else{
					tip.hide();
				}
			})
			.on("keydown keyup", function(){
				if($(this).val()==""){
					tip.show().css({color:cfg.focusColor});
				}else{
					tip.hide();
				}
			});
		};


		return function(target,config){

		//html5原生支持则直接退出
		if(support){
			return;
		}
		
		//是否有需要渲染的对象
		target = $(target);
		if(!target.length>0){
			return;
		}
		
		target.each(function(tg){
			$(tg).hasAttr("placeholder") && render(tg,config);
		});
		
	}
	
	
});
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-30
 * Time: 下午2:20
 * To change this template use File | Settings | File Templates.
 */
 KISSY.add("robot/ui/scroll", function(S, Config, Scroll){
 	var $=S.all;
 	return new Scroll($(Config.el.chatlist),{prefix:"clear-"})

 },{
 	attach:false,
 	requires:["../config", "gallery/kscroll/1.0/index"]
 });
/**
 * Created by IntelliJ IDEA.
 * User: changyin@taobao.com
 * Date: 12-2-9
 * describe: 常用工具
 */
 KISSY.add("robot/util", function(S, Node, Calendar, Overlay){
 	var $ = Node.all;
 	var rselectTextarea = /^(?:select|textarea)/i,
 	rCRLF = /\r?\n/g,
 	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;
 	var hasEnumBug = !({toString: 1}.propertyIsEnumerable('toString')),
 	enumProperties = [
 	'constructor',
 	'hasOwnProperty',
 	'isPrototypeOf',
 	'propertyIsEnumerable',
 	'toString',
 	'toLocaleString',
 	'valueOf'
 	];


 	return {
 		pad: function(str,len,sign) {
 			var l = len-str.length;
 			while(l>0){
 				str += sign;
 				l--;
 			}
 			return str;
 		},
 		dateFormat: Calendar.Date.format,
        //应开发要求，所有中文编码两次
        encode: function(str){
        	return encodeURIComponent(str);
        },
        /**
         * 截取指定长度字符串
         * @param str 要截取的字符串
         * @param len 指定长度
         * @param fill 要填充的字符
         */
         subStr: function(str,len,fill){
         	if(str.length<=len)return str;
         	var strs = str.split(""),
         	l = strs.length, arr = [], count=0;
         	for(var i=0;i<l;i++){
         		/\w/g.test(strs[i])?count+=0.5 : count++;
         		arr.push(strs[i]);
         		if(count>=len)break;
         	}
         	return arr.join("")+(fill?fill:"");
         },

        /**
         * 对话框
         */
         dialog: function(config) {
         	var d = {
         		bodyContent:"<div class='loading'></div>",
         		mask:true,
         		elCls:"clear-dialog",
         		width:550,
         		align:{
         			points:['cc', 'cc']
         		},
         		closable:true
         	};
         	return new Overlay.Dialog(S.mix(d, config || {}, true));
         },

        /**
         * 获取url参数
         */
         getUrlParam : function(name) {
         	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"),
         	r = window.location.search.substr(1).match(reg);
         	return (r!=null)?  decodeURIComponent(r[2]) : null;
         },
         extractFormData: function(form, encode){
         	var self = this;
         	var form = $(form)[0];
         	var elements = S.makeArray(form.elements);
         	var data = outputData = {};
            // 对表单元素进行过滤，具备有效值的才保留
            elements = S.filter(elements, function(el){
                //有名字
                return el.name &&
                    // 不被禁用
                    !el.disabled &&
                    (
                        // radio,checkbox 被选择了
                        el.checked ||
                            // select 或者 textarea
                            rselectTextarea.test(el.nodeName) ||
                            // input 类型
                            rinput.test(el.type)
                            );
                // 这样子才取值
            });
            S.each(elements, function(el){
            	var val = $(el).val(), vs;
            	vs = data[el.name];
            	if(!vs){
            		data[el.name] = val;
            		return;
            	}
            	if(vs && !S.isArray(vs)) {
                    //多个元素重名时搞成数组
                    vs = data[el.name] = [vs];
                }
                vs.push.apply(vs, S.makeArray(val));
            });
            S.each(data, function(v, k){
            	if(encode){
            		if(S.isArray(v)){
            			outputData[k] = self.encode(v.join(','));
            		}else{
            			outputData[k] = self.encode(v);
            		}
            	}else{
            		if(S.isArray(v)){
            			outputData[k] = v.join(',');
            		}else{
            			outputData[k] = v;
            		}
            	}
            });
            return outputData;

        },
        getTemplate: function(str){
        	return str.replace(/{{@/g,'{{#');
        },
        keys: function(obj){
        	var result = [], p, i;

        	for(p in obj){
        		result.push(p);
        	}

        	if(hasEnumBug){
        		for(i = enumProperties.length - 1; i >= 0; i--) {
        			p = enumProperties[i];
        			if (obj.hasOwnProperty(p)) {
        				result.push(p);
        			}
        		}
        	}

        	return result;
        }


    };

},{
	requires:["node","calendar","overlay"]
});
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-30
 * 云客服SDK接口
 */
 KISSY.add("sdk/robot/base", function(S, Utils, Config, Interfaces){
 	var sdk = {},
 	request = new Utils.request(Interfaces);


 	S.mix(sdk,
        /**
         * @lends sdk
         */
         {
            /**
             * 用户配置SDK
             * 1.配置log打印方式
             * @param cfg
             */
             config: function(cfg){
                //配置日志打印方式，方便调试
                if(cfg.log && S.isFunction(cfg.log)){
                	Utils.log = cfg.log;
                }
                //配置编码
                if(cfg.charset && (cfg.charset=="utf-8" || cfg.charset=="gbk")){
                	Config.charset = cfg.charset;
                }
                //全局入参
                if(cfg.globalParam){
                	Config.globalParam = cfg.globalParam;
                }
            },

            /**
             * 发送请求
             * @param config
             */
             request: request.start,

            /**
             * 监听接口
             * @param type 接口名称
             * @param fun 回调函数
             */
             addEventListener: function(type,fun){
             	request.on(type,function(ev){
             		fun(ev.response);
             	});
             },


            /**
             * 在线咨询接口
             * @param question 咨询问题（encodeURI编码两次？） @TODO
             * @param callback 回调函数
             */
             ask: function(question,callback){
             	request.start({
             		interfaceName:"ask",
             		data:question,
                    //回调参数同KISSY，http://docs.kissyui.com/docs/html/api/core/ajax/index.html#module-io
                    success:function(data , textStatus , xhrObj){
                    	callback({
                    		data: data,
                    		status: textStatus,
                    		xhr: xhrObj
                    	});
                    },
                    error: function(textStatus, xhrObj){
                    	callback({
                    		data: null,
                    		status: textStatus,
                    		xhr: xhrObj
                    	});
                    }
                });
             },

            /**
             * 评价答案
             * @param data
             * @param callback
             */
             feedback: function(data,callback){
             	request.start({
             		interfaceName:"feedback",
             		data:data,
             		success:function(data , textStatus , xhrObj){
             			callback(data);
             		},
             		error: function(textStatus, xhrObj){
             			callback(null);
             		}
             	});
             },


            /**
             * 插件执行
             * @param data
             * @param callback
             */
             pluginExecute: function(data,callback){
             	request.start({
             		interfaceName:"pluginExecute",
             		data:data,
             		success:function(data , textStatus , xhrObj){
             			callback(data);
             		},
             		error: function(textStatus, xhrObj){
             			callback(null);
             		}
             	});
             },


            /**
            * 检查用户名是否存在
            */
            checkUserName:function(data,callback){
            	request.start({
            		interfaceName:"checkUserName",
            		data:data,
            		success:function(data , textStatus , xhrObj){
            			if(data && data.success == true){
            				S.isFunction(callback) && callback({
            					status: true,
            					data: data,
            					textStatus: textStatus,
            					xhr: xhrObj
            				});
            			}else{
                        //回调
                        S.isFunction(callback) && callback({
                        	status: false,
                        	data: data,
                        	textStatus: textStatus,
                        	xhr: xhrObj
                        });
                    }
                },
                error: function(textStatus, xhrObj){
                	S.isFunction(callback) && callback({
                		status: false,
                		data: null,
                		textStatus: textStatus,
                		xhr: xhrObj
                	});
                }
            });
            },

            /**
             * 百度机器人弹出登录框前发的通知供开发做登录流失率的计算
             */
             notifyLogin: function(data,callback){
             	request.start({
             		interfaceName:"notifyLogin",
             		data:data,
             		success:function(data , textStatus , xhrObj){
             			callback(data);
             		},
             		error: function(textStatus, xhrObj){
             			callback(null);
             		}
             	});
             }

         }
         );



sdk.config({
	log:function(msg){

	}
})



return sdk;

},{
	requires:["../utils/base", "./config", "./interface"]
});
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-29
 * 机器人SDK配置信息
 */
 KISSY.add("sdk/robot/config", function(S){

 	var sdkConfig =  {

 		robotConfigMap : {
			//checkcs : true,
			//sourceId : 777
		},
		
		urlConfig : {
			
		},
		
		dailyConfig:{
			common_check_user_name_url : "//service.daily.taobao.net/support/minerva/sdk/minerva_login.do",
			robot_ask_url : "//robot.taobao.com/services/common/answer.json?robotCode=zhongguofawu&sessionUuid="+sessionUuid+"&sceneCode=wangshangfating",
			robot_feedback_url : "//service.daily.taobao.net/support/minerva/sdk/RobotSdkFeedback.do",
			notify_login_url : "//service.daily.taobao.net/support/minerva/sdk/RobotSdkBaiduLog.do"
			
		},
		onlineConfig:{
			common_check_user_name_url : "//service.taobao.com/support/minerva/sdk/minerva_login.do",
			robot_ask_url : "//robot.taobao.com/services/common/answer.json?robotCode=zhongguofawu&sessionUuid="+sessionUuid+"&sceneCode=wangshangfating",
			robot_feedback_url : "//service.taobao.com/support/minerva/sdk/RobotSdkFeedback.do",
			notify_login_url : "//service.taobao.com/support/minerva/sdk/RobotSdkBaiduLog.do"
		}

	};
	sdkConfig.urlConfig = sdkConfig.onlineConfig;
	try {
		if(env && env =="daily"){
			sdkConfig.urlConfig = sdkConfig.dailyConfig;
		}else{
			sdkConfig.urlConfig = sdkConfig.onlineConfig;
		}
	} catch (e) {
		S.log(e);
	}
	
	
	return sdkConfig;


});
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-29
 * 机器人SDK API配置信息
 */
 KISSY.add("sdk/robot/interface", function(S, Config, Utils){
 	var Interface = new Utils.requestStore({
 		jsonp: "callback",
 		dataType:'jsonp',
        queryName: 'question'
 	}),
 	cfg = Config;


    //机器人ask配置
    Interface.add("ask", {
    	url: Config.urlConfig.robot_ask_url,
        //url:"interface.php",
        data: {
        	version: "2"
        },
        jsonpCallback: "RobotAskCallback",
        before:function(){
        	Utils.log("ask before!");
        },
        success: function(result){
        	Utils.log("ask successed!");
        }
    });
    
    
    //评价配置
    Interface.add("feedback", {
        //url:"interface.php",
        url:Config.urlConfig.robot_feedback_url,
        data: {
        	version: "2"
        },
        jsonpCallback: "RobotFeedbackCallback",
        before:function(){
        	Utils.log("robot_feedback before");
        },
        success: function(result){
        	Utils.log("robot_feedback success");
        }
    });

    Interface.add("checkUserName", {
    	url:Config.urlConfig.common_check_user_name_url,
    	jsonpCallback: "MinervaLoginCallback",
    	data:{
    		version: "2"
    	}
    });

    Interface.add("notifyLogin", {
    	url:Config.urlConfig.notify_login_url,
    	jsonpCallback: "RobotBaiduNotifyLoginCallback",
    	data:{
    		version: "2"
    	}
    });
    
    
    Interface.add("pluginExecute", {
    	url:"ajax/PlugAjax.do",
    	jsonpCallback: "RobotPluginExecuteCallback",
    	data:{
    		version: "2"
    	}
    });
    return Interface;

},{
	requires:["./config", "../utils/base"]
});
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-29
 * SDK共用方法
 */
 KISSY.add("sdk/utils/base", function(S, Request){
 	var Utils = {};

 	S.mix(Utils,
        /**
         * @lends Utils
         */
         {
            /**
             * 日志打印
             * @param logs
             */
             log: function(logs){
             	S.log(logs);
             },

            /**
             *
             * @param def
             */
             requestStore: function(def){
             	var store = {},
             	cfg = {
             		dataType: "jsonp",
             		async: true,
             		type: "POST",
             		timeout: 100000
             	};

             	S.mix(cfg,def||{});

                /**
                 * 增加配置
                 * @param name
                 * @param config
                 */
                 this.add = function(name,config){
                 	store[name] = S.merge(cfg,config);
                 };

                /**
                 * 获取配置
                 * @param name
                 */
                 this.get = function(name){
                 	return store[name];
                 }
             },

            /**
             * 封装参数并且发送请求，用class的形式主要是为了使对象具有on/fire方法，通过注册事件的方式增加回调函数
             * @param apiconfig SDK中的interface对象
             */
             request: Request

         }
         )

 	return Utils;

 },{
 	requires:["./request"]
 });
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-29
 * 发送请求
 */
 KISSY.add("sdk/utils/request", function(S, IO){

    /**
     * 封装参数并且发送请求，用class的形式主要是为了使对象具有on/fire方法，通过注册事件的方式增加回调函数
     * @param apiconfig SDK中的interface对象
     */
     function Request(apiconfig){
     	this.API=apiconfig;
     }

     S.augment(Request, S.EventTarget, {

        /**
         * 发送请求
         * @param config
         */
         start: function(config){
         	var self = this,
         	interfaceName = config.interfaceName,
         	defcfg = self.API.get(interfaceName);


            //如果调用的接口名称不正确，则不往下操作
            if(!defcfg){
            	S.log({
            		code:"",
            		message:"你请求的接口'"+config.type+"'不存在"
            	});
            	return;
            }

			//构造jsonp请求对象
			var param = S.clone(defcfg);

			//S.mix方法有点变化
			S.mix(param.data,config.data);
			
			//发送JSONP请求，只允许用户修改的参数
			S.mix(param,config,true,['async','type','timeout','data',"jsonp","jsonpCallback","form","dataType"],true);
			
			
			param.error = function(textStatus, xhrObj){
				try {
					if(S.isFunction(defcfg.error)){
						defcfg.error(textStatus, xhrObj);
					}
					if(S.isFunction(config.error)){
						config.error(textStatus, xhrObj);
					}
				} catch (e) {
					// TODO: handle exception
				}
				//触发通过addEventListener注册的事件
				self.fire(interfaceName,{
					response: {
						data: null,
						textStatus: textStatus,
						xhr: xhrObj
					}
				});
			};
			
			param.success = function( data , textStatus , xhrObj){
				try {
					if(S.isFunction(defcfg.success)){
						defcfg.success(data,textStatus, xhrObj);
					}
					if(S.isFunction(config.success)){
						config.success(data,textStatus, xhrObj);
					}
				} catch (e) {
					// TODO: handle exception
				}
				
				//触发通过addEventListener注册的事件
				self.fire(interfaceName,{
					response: {
						data: data,
						textStatus: textStatus,
						xhr: xhrObj
					}
				});
			};

			param.complete = function( data , textStatus , xhrObj){
				self.fire("complete",{
					response: {
						data: param
					}
				});
			};
			
			//发送请求之前做的操作
			if(param.before && S.isFunction(param.before)){
				param.before(param.data);
			}

            //发送请求之前触发
            self.fire("before",{
            	response: {
            		data: param
            	}
            });

			//发送jsonp请求
			self.send(param);
		},

		send: function (param) {
			var url = param.url;

			if(!/^(http|https)/.test(url)){
				url = location.protocol + url;
			}

			var req = new IO({
				scriptCharset: "utf-8",
				url: url,
				dataType: param.dataType || "jsonp",
				form: param.form,
				jsonp: param.jsonp,
				jsonpCallback: param.jsonpCallback,
				async: true,
				data: param.data,
				timeout: 4000,
				cache: false,
				error: function (textStatus, xhrObj) {
					S.log("request error!", textStatus, xhrObj);
					if (param.error) {
						param.error(textStatus, xhrObj);
					}
				},
				success: function (data, textStatus, xhrObj) {
					if (param.success) {
						param.success(data, textStatus, xhrObj);
					}
				}
			});
		}

	});

     IO.on("error", function (xhr) {
     	try{
     		if (JSTracker) {
     			JSTracker.error(JSON.stringify({
     				url:xhr.ajaxConfig.url,
     				data:xhr.ajaxConfig.data,
     				status:xhr.xhr.status
     			}));
     		}
     	}catch(e){

     	}
     });

     return Request;

 },{
 	requires:["ajax"]
 });
/**
 * Created by IntelliJ IDEA.
 * User: satans17
 * Date: 11-12-30
 * 机器人SDK
 */
 KISSY.add("sdk/robot", function(S, Robot){

 	return Robot;

 },{
 	requires:["./robot/base"]
 });