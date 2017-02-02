function renderAll(url,option1,option2){var promise=Promise.all([render(url,option1),render(url,option2)]);promise.then(function(arr){var mainCount=arr.reduce(function(a,b){return a+b});mainCount||$("#nomessage-div").show(),pop&&pop.isShow&&pop.close()})["catch"](function(err){})}function render(url,params){var status=params.status;return getData(url,params).then(function(rtv){return mySession(rtv,status)}).then(function(rtv){return renderList(rtv,params)})}function mySession(data,status){return session("timeStamp",Date.now()),session(status,data)}function getData(url,params){pop&&!pop.isShow&&pop.loading();var promise=new Promise(function(resolve,reject){var obj={filterMap:JSON.stringify(params)};$.ajax({type:"GET",url:url,data:obj,success:function(data){resolve(JSON.parse(data))},error:function(xhr,status,err){reject(err)},complete:function(xhr,status){pop&&pop.isShow&&pop.close()}})});return promise}function session(key,value,concatAttrArr){concatAttrArr=concatAttrArr||["content","data"];var old=sessionStorage.getItem(key);return 1===arguments.length?old:arguments.length>=2?($.isPlainObject(value)?old?(old=JSON.parse(old),old=concatObjAttr(old,value,concatAttrArr),old=JSON.stringify(old)):old=JSON.stringify(value):old=value,sessionStorage.setItem(key,old),value):void 0}function concatObjAttr(oldData,newData,attrArr){var curNew,curOld;if("object"==typeof oldData&&"object"==typeof newData)return Array.isArray(attrArr)||(attrArr=[attrArr]),curNew=reduceAttr(newData,attrArr),curOld=reduceAttr(oldData,attrArr),curOld=curOld.concat(curNew),reduceAttr(oldData,attrArr,curOld),oldData}function reduceAttr(obj,attrs,value){var i=0,len=attrs.length;return attrs.reduce(function(a,b){return i===len-1&&value&&a&&a[b]&&(a[b]=value),i++,a&&a[b]?a[b]:a},obj)}function renderList(data,options){"string"==typeof data&&(data=JSON.parse(data));var promise=new Promise(function(resolve,reject){if(data&&!data.hasError){var content,list;if((content=data.content)&&(list=content.data),!list)return 0;var status=options.status,mainCount=0,html="",count=content.count,listUl=document.querySelector("#"+status+"-ul"),countSpan=document.querySelector("."+status+"-count"),listDiv=listUl.parentNode,loadMore=getLoadMore(listUl,options),thisNum=0;count>0&&(countSpan.innerText=count,mainCount++,Array.isArray(list)&&list.forEach(function(item){var filingTime=formatTime(item.submitTime);html+="<li><a href='/openservice/qiandun/detail.htm?securityCaseId="+item.securityId+"&entityRole=accused'><div class='info'> <p class='title'>"+item.caseName+"</p><p class='mes'>"+item.courtName+"　"+filingTime+"</p></div><div class='arrow'><i class='right arrow basic icon'></i></div></a></li>",thisNum++})),thisNum&&(options.begin+=thisNum,listUl.insertAdjacentHTML("beforeend",html),options.begin<count?listUl.appendChild(loadMore):loadMore.parentNode&&listUl.removeChild(loadMore),listDiv.style.display="block"),resolve(mainCount)}});return promise}function formatTime(date,separator){separator=separator||"-";var filingTime=new Date(date),year=filingTime.getFullYear(),month=filingTime.getMonth()+1,day=filingTime.getDate(),timeStr=year+separator+month+separator+day;return timeStr}function getLoadMore(parent,options){var ele=parent.querySelector(".js-load-more");options.status;return ele||(ele=document.createElement("li"),ele.innerText="点击加载更多...",ele.classList.add("js-load-more")),ele.onclick=function(){render.call(null,url,options)},ele}var begin,url,pop,userId,status,expire,isExpired,timeStamp,finish,attrToMerge,unfinished,finishOptions,unfinishedOptions;url="/openservice/qiandunRpc/queryLegalCaseDtoList.json",userId=session("userId"),timeStamp=session("timeStamp"),expire=6e5,isExpired=!0,pop=window.PopWin&&window.PopWin(),attrToMerge=["content","data"],finishOptions={paramName:"filterMap",status:"finish",length:10,begin:0},unfinishedOptions={paramName:"filterMap",status:"unfinished",length:10,begin:0},timeStamp&&(isExpired=Date.now()-timeStamp>expire),userId?(finishOptions.havanaId=userId,unfinishedOptions.havanaId=userId,isExpired?renderAll(url,finishOptions,unfinishedOptions):(finish=session("finish"),unfinished=session("unfinished"),finish&&renderList(JSON.parse(finish),finishOptions),unfinished&&renderList(JSON.parse(unfinished),unfinishedOptions))):window.WindVane.call("WVNative","get_user_info",{},function(data){pop&&pop.loading(),userId=data.userId,finishOptions.havanaId=userId,unfinishedOptions.havanaId=userId,session("userId",userId),renderAll(url,finishOptions,unfinishedOptions)},function(err){pop&&pop.close()});