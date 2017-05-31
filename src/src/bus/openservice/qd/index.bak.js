var begin,
    url,
    pop,
    userId,
    status,
    expire,
    isExpired,
    timeStamp,
    finish,
    attrToMerge,
    unfinished,
    finishOptions,
    unfinishedOptions;
url = "/openservice/qiandunRpc/queryLegalCaseDtoList.json";
userId = session("userId");
timeStamp = session("timeStamp");
expire = 1000 * 60 * 10;
isExpired = true;
pop = window.PopWin && window.PopWin();
attrToMerge = ["content", "data"]; //要合并的JSON字段
finishOptions = {
    paramName: "filterMap",
    status: "finish",
    length: 10,
    begin: 0
};
unfinishedOptions = {
    paramName: "filterMap",
    status: "unfinished",
    length: 10,
    begin: 0
};
if (timeStamp) {
    isExpired = (Date.now() - timeStamp) > expire;
}

if (userId) {
    //如果本地有存储userId,则不需要再调用接口去获取userId
    finishOptions.havanaId = userId;
    unfinishedOptions.havanaId = userId;
    if (!isExpired) {
        //如果页面存储未过期,渲染本地存储数据
        finish = session("finish");
        unfinished = session("unfinished");
        finish && renderList(JSON.parse(finish), finishOptions);
        unfinished && renderList(JSON.parse(unfinished), unfinishedOptions);

    } else {
        //根据userId发送ajax请求,并渲染页面
        renderAll(url, finishOptions, unfinishedOptions);
    }

} else {
    // 如果本地没有userId,说明是第一次进入,调用接口获取userId,并发送ajax获取数据,渲染页面
    window.WindVane.call("WVNative", "get_user_info", {}, function (data) {
        if (pop) {
            pop.loading();
        }
        userId = data.userId;
        finishOptions.havanaId = userId;
        unfinishedOptions.havanaId = userId;
        session("userId", userId);
        renderAll(url, finishOptions, unfinishedOptions);
    }, function (err) {
        console.error(JSON.stringify(err));
        if (pop) {
            pop.close();
        }
    });
}
function renderAll(url, option1, option2) {
    var promise = Promise.all([render(url, option1), render(url, option2)]);
    promise.then(function (arr) {
        var mainCount = arr.reduce(function (a, b) {
            return a + b;
        });
        if (!mainCount) {
            $("#nomessage-div").show();
        }
        if (pop && pop.isShow) {
            pop.close();
        }
    }).catch(function (err) {
        console.error(err);
    });
}
function render(url, params) {
    var status = params.status;
    return getData(url, params)
        .then(function (rtv) {
            return mySession(rtv, status);
        }).then(function (rtv) {
            return renderList(rtv, params);
        });
}
//Do not use the function below in any other files,it's custom made
function mySession(data, status) {
    session("timeStamp", Date.now());
    return session(status, data);
}
/**
 * @param  {string} url
 * @param  {object} params
 * @return {promise} promise
 */
function getData(url, params) {
    if (pop && !pop.isShow) {
        pop.loading();
    }
    var promise = new Promise(function (resolve, reject) {
        var obj = {
            filterMap: JSON.stringify(params)
        };
        $.ajax({
            type: "GET",
            url: url,
            data: obj,
            success: function (data) {
                resolve(JSON.parse(data));

            },
            error: function (xhr, status, err) {
                reject(err);
            },
            complete: function (xhr, status) {
                if (pop && pop.isShow) pop.close();
            }
        });
    });
    return promise;
}
/**
 * @param  {any} key
 * @param  {any} value
 * @param  {any} concatAttrArr
 * @return {string} value||old
 */
function session(key, value, concatAttrArr) {
    concatAttrArr = concatAttrArr || ["content", "data"];
    var old = sessionStorage.getItem(key),
        curNew, curOld;
    if (arguments.length === 1) {
        return old;
    } else if (arguments.length >= 2) {
        if ($.isPlainObject(value)) {
            if (old) {
                old = JSON.parse(old);
                old = concatObjAttr(old, value, concatAttrArr);
                old = JSON.stringify(old);
            } else {
                old = JSON.stringify(value);
            }
        } else {
            old = value;
        }

        sessionStorage.setItem(key, old);
        return value;
    }
}
/**
 * @param  {object} oldData
 * @param  {object} newData
 * @param  {array|string} attrArr
 * @return {object} oldData
 */
function concatObjAttr(oldData, newData, attrArr) {
    var curNew, curOld;
    if (typeof oldData !== "object" || typeof newData !== "object") {
        return console.log("arguments must be type of object");
    }
    if (!Array.isArray(attrArr)) {
        attrArr = [attrArr];
    }
    curNew = reduceAttr(newData, attrArr);
    curOld = reduceAttr(oldData, attrArr);
    curOld = curOld.concat(curNew);
    reduceAttr(oldData, attrArr, curOld);
    return oldData;
}
/**
 * @param  {object} obj
 * @param  {array} attrs
 * @param  {any} value
 * @return {object} obj[a][b][...]
 */
function reduceAttr(obj, attrs, value) {
    var i = 0,
        len = attrs.length;
    return attrs.reduce(function (a, b) {
        if ((i === len - 1) && value) {
            a && a[b] && (a[b] = value);
        }
        i++;
        if (a && a[b]) {
            return a[b];
        } else {
            console.log("err: key does not match");
            return a;
        }
    }, obj);
}
/**
 * @param {object} data
 * @param {object} options
 * @return {number} mainCount
 */
function renderList(data, options) {
    if(typeof data === "string") data=JSON.parse(data);
    var promise = new Promise(function(resolve,reject){
        if (!data) return console.log("no data");
        if (data.hasError) return console.log(data.errMsg);

        var content, list;
        (content = data.content) && (list = content.data);
        if (!list) {
            return 0;
        }
        var status = options.status,
            mainCount = 0,
            html = "",
            count = content.count,
            listUl = document.querySelector("#" + status + "-ul"),
            countSpan = document.querySelector("." + status + "-count"),
            listDiv = listUl.parentNode,
            loadMore = getLoadMore(listUl, options),
            thisNum = 0;
        if (count > 0) {
            countSpan.innerText = count;
            mainCount++;
            Array.isArray(list) && list.forEach(function (item) {
                var filingTime = formatTime(item.submitTime);
                html += "<li><a href='/openservice/qiandun/detail.htm?securityCaseId=" + item.securityId + "&entityRole=accused'><div class='info'> <p class='title'>" + item.caseName + "</p>" +
                    "<p class='mes'>" + item.courtName + "　" + filingTime + "</p></div><div class='arrow'><i class='right arrow basic icon'></i></div></a></li>";
                thisNum++;
            });
        }
        if (thisNum) {
            options.begin += thisNum;
            listUl.insertAdjacentHTML("beforeend", html);
            console.log(options.begin, count);
            if (options.begin < count) {
                listUl.appendChild(loadMore);
            } else {
                loadMore.parentNode && listUl.removeChild(loadMore);
            }
            // console.log(listDiv);
            listDiv.style.display = "block";
        }
        resolve(mainCount);
    });
    return promise;
}
/**
 * @param {date} date
 * @param {string} separator
 * @return {string} timeStr
 */
function formatTime(date, separator) {
    separator = separator || "-";
    var filingTime = new Date(date),
        year = filingTime.getFullYear(),
        month = filingTime.getMonth() + 1,
        day = filingTime.getDate(),
        timeStr = year + separator + month + separator + day;
    return timeStr;
}
//custom made
function getLoadMore(parent, options) {
    var ele = parent.querySelector(".js-load-more"),
        status = options.status;
    if (!ele) {
        ele = document.createElement("li");
        ele.innerText = "点击加载更多...";
        ele.classList.add("js-load-more");
    }
    ele.onclick = function () {
        render.call(null, url, options);
    };
    return ele;
}