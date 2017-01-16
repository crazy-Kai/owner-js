// 庭审公用方法
define(function(require, exports, module) {

    // 依赖
    var limit = require('common/limit'),
        trialConstant = require('./trialConstant');

    // 变量
    var trialTool = {},
        leaveUser = {},
        userInfo,
        userList,
        dataSoure,
        lawCase;

    // 解析参数的
    trialTool.getUrlParam = function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2]; return null;
    };

    // 初始化用户信息的数据源
    trialTool.initUserInfoAndList = function(info, list, val, law){
        userInfo = info;
        userList = list;
        dataSoure = val;
        lawCase = law;
    };

    // 通过离开ID获取用户ID
    trialTool.getUserIdByVid = function(vid){
        var userId = leaveUser[vid];
        if(!userId){
            limit.breakEach(userList, function(val){
                if(val.vid === vid){
                    return userId = leaveUser[vid] = val.userId, false;
                };
            });
        };
        return userId;
    };

     // 通过角色是否为原被告或者代理人
    var isLitigantByRole = trialTool.isLitigantByRole = function(role){
        return limit.contains(['ac', 'al', 'de', 'dl'], role);
    };

    // 通过角色判断是否是代理人
    var isAgentByRole = trialTool.isAgentByRole = function(role){
        return limit.contains(['al', 'dl'], role);
    };

    // 获取本地存储的数据
    trialTool.getLocalStorageByName = function(key, defultValue){
        var val = localStorage[key + lawCase.id];
        return val ? JSON.parse(val) : defultValue;
    };

    // 设置本地存储的数据
    trialTool.setLocalStorageByName = function(key, val){
        localStorage[key + lawCase.id] = JSON.stringify(val);
    };


    // 第三方需求的方法

        // 第三方[ae]进入的时候更改为法官
        trialTool.updateJuWhenAeEnter = function(role){
            return  role === 'ae' ? 'ju' : role;
        };

        // 第三方测试[ae]的数据处理
        trialTool.updateResultForAe = function(retValue){
            if(retValue.ae){
                retValue.ju = retValue.ae;
                limit.forEach(retValue.ju, function(val){
                    val.role = 'ju';
                });
                delete retValue.ae;
            };
        };

    // 原被告代理人方法

        // 获取视频窗口节点
        var getVideoWrapByNode = trialTool.getVideoWrapByNode = function(node){
            return node.closest('[data-target="video"]');
        };

        // 显示视频窗口节点
        trialTool.showVideoWrapByRoleAndNode = function(role, node){
            var wraoNode = getVideoWrapByNode(node);
            clearTimeout( wraoNode.data('timeIdForVideoWrap') );
            isAgentByRole(role) && wraoNode.removeClass('fn-hide');
        };

        // 隐藏视频窗口节点
        trialTool.hideVideoWrapByRoleAndNode = function(role, node){
            var wraoNode = getVideoWrapByNode(node);
            wraoNode.data('timeIdForVideoWrap', setTimeout(function(){
                isAgentByRole(role) && wraoNode.addClass('fn-hide');
            }, 3000));
        };

        // 有暂停视频按钮
        trialTool.hasStopViewBtnByUserId = function(userId){
            // 角色正确，且不是自己
            return isLitigantByRole(userInfo.role) && userInfo.userId !== userId;
        };

        // 纠正原被告代理人的顺序[order]保证正确
        trialTool.updateOrderForALAndDl = function(retValue, resConteVal){
            var arr = ['al', 'dl'];
            arr.forEach(function(val){
                retValue[val] && retValue[val].forEach(function(val, key){
                    val.oldOrder = val.order;
                    val.order = ++key;
                    // 纠正当前用户的顺序
                    if(resConteVal.userId === val.userId){
                        resConteVal.order = val.order;
                    };
                });
            });
        };

        // 通过角色过滤出中文
        trialTool.getRoleNameByRole = function getRoleNameByRole(item, flag){
            var rightMap = {al: 'ac', dl: 'de'},
                role = rightMap[item.role] ? rightMap[item.role] : item.role,
                list = dataSoure[ role ],
                firstName = trialConstant.roleNameMap[role] + ( (!flag && list.length <= 1) ? '' : trialConstant.numArr[item.oldOrder ? item.oldOrder : item.order] );
            // 如果是原被告的代理律师
            if( isAgentByRole(item.role) ){
                return firstName + '代理人';
            };
            return firstName;
        };

    // 初始化信息

        // 获取总数
        trialTool.getAllCount = function(){
            return getAllLitigantList.apply(undefined, arguments).length;
        };

        function pushRightOrder(arr, origin, target){
            limit.each(origin, function(valAc){
                arr.push(valAc);
                limit.each(target, function(valAl){
                    if(valAc.order === valAl.oldOrder){
                        arr.push(valAl);
                    };    
                });
            });
        };

        // 获取集合
        var getAllLitigantList = trialTool.getAllLitigantList = function(ac, al, de, dl){
            var arr = [];
            // 原告
            pushRightOrder(arr, ac, al);
            // 被告
            pushRightOrder(arr, de, dl);
            return arr;

        };

        // 获取计算出来的宽高
        trialTool.getComputeLayout = function(){
            var winWidth = window.innerWidth, // 视窗的宽度
                layoutConfig = {};
            // 主体宽度
            var mainWidth = layoutConfig.mainWidth = winWidth - 200; 
            // 大视窗的宽度
            var bigVideoWidth = layoutConfig.bigVideoWidth =  (mainWidth - 30) * 2/3;
            // 大视频的高度
            var bigVideoHeight = layoutConfig.bigVideoHeight = bigVideoWidth * 3/4;
            // 小视频的高度
            var smallVideoHeight = layoutConfig.smallVideoHeight = (bigVideoHeight - 5) / 2;
            // 小视屏的宽度
            var smallVideoWitch = layoutConfig.smallVideoWitch = smallVideoHeight * 4/3
            
            return layoutConfig;
        };

    // 获取编辑器的内容
    trialTool.getRecord = function(){
        var record = tinymce.get("record");
        return record ? record.getContent() : '';
    };

    // 设置编辑器的内容
    trialTool.setRecord = function(val){
        var recordDom = $('#record');
        if(userInfo.role === 're'){
            var record = tinymce.get("record");
            if( record ){
                record.setContent(val);
            }else{
                recordDom.val(val);
            };
        }else{
            var DOC = recordDom[0].contentWindow.document;
            DOC.open();
            DOC.write(val);
            DOC.close();
            recordDom.css('height', 'auto');
            // 7像素的偏差?
            recordDom.height(DOC.documentElement.scrollHeight + 7);
        };
        
    };




    return trialTool;

});