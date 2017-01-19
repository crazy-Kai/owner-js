function renderAll(url, option) {
    render(url, option).then(function(mainCount) {
        mainCount || $("#nomessage-div").show(), pop && pop.isShow && pop.close()
    })["catch"](function(err) {})
}

function render(url, params) {
    var status = params.status;
    return getData(url, params).then(function(rtv) {
        return mySession(rtv, status)
    }).then(function(rtv) {
        return renderList(rtv, params)
    })
}

function mySession(data, status) {
    return session("timeStamp", Date.now()), session(status, data)
}

function getData(url, params) {
    pop && !pop.isShow && pop.loading();
    var promise = new Promise(function(resolve, reject) {
        var obj = {
            filterMap: JSON.stringify(params)
        };
        $.ajax({
            type: "GET",
            url: url,
            data: obj,
            success: function(data) {
                resolve(JSON.parse(data))
            },
            error: function(xhr, status, err) {
                reject(err)
            },
            complete: function(xhr, status) {
                pop && pop.isShow && pop.close()
            }
        })
    });
    return promise
}

function session(key, value, concatAttrArr) {
    concatAttrArr = concatAttrArr || ["content", "data"];
    var old = sessionStorage.getItem(key);
    return 1 === arguments.length ? old : arguments.length >= 2 ? ($.isPlainObject(value) ? old ? (old = JSON.parse(old), old = concatObjAttr(old, value, concatAttrArr), old = JSON.stringify(old)) : old = JSON.stringify(value) : old = value, sessionStorage.setItem(key, old), value) : void 0
}

function concatObjAttr(oldData, newData, attrArr) {
    var curNew, curOld;
    if ("object" == typeof oldData && "object" == typeof newData) return Array.isArray(attrArr) || (attrArr = [attrArr]), curNew = reduceAttr(newData, attrArr), curOld = reduceAttr(oldData, attrArr), curOld = curOld.concat(curNew), reduceAttr(oldData, attrArr, curOld), oldData
}

function reduceAttr(obj, attrs, value) {
    var i = 0,
        len = attrs.length;
    return attrs.reduce(function(a, b) {
        return i === len - 1 && value && a && a[b] && (a[b] = value), i++, a && a[b] ? a[b] : a
    }, obj)
}

function renderList(data, options) {
    "string" == typeof data && (data = JSON.parse(data));
    var promise = new Promise(function(resolve, reject) {
        if (data && !data.hasError) {
            var content, list;
            if ((content = data.content) && (list = content.data), !list) return 0;
            var status = options.status,
                mainCount = 0,
                html = "",
                count = content.count,
                listUl = document.querySelector("#" + status + "-ul"),
                countSpan = document.querySelector("." + status + "-count"),
                listDiv = listUl.parentNode,
                loadMore = getLoadMore(listUl, options),
                thisNum = 0;
            count > 0 && (countSpan.innerText = count, mainCount++, Array.isArray(list) && list.forEach(function(item) {
                var filingTime = formatTime(item.submitTime);
                html += "<li><a href='/openservice/qiandun/detail.htm?securityCaseId=" + item.securityId + "&entityRole=accused'><div class='info'> <p class='title'>" + item.caseName + "</p><p class='mes'>" + item.courtName + "　" + filingTime + "</p></div><div class='arrow'><i class='right arrow basic icon'></i></div></a></li>", thisNum++
            })), thisNum && (options.begin += thisNum, listUl.insertAdjacentHTML("beforeend", html), options.begin < count ? listUl.appendChild(loadMore) : loadMore.parentNode && listUl.removeChild(loadMore), listDiv.style.display = "block"), resolve(mainCount)
        }
    });
    return promise
}

function formatTime(date, separator) {
    separator = separator || "-";
    var filingTime = new Date(date),
        year = filingTime.getFullYear(),
        month = filingTime.getMonth() + 1,
        day = filingTime.getDate(),
        timeStr = year + separator + month + separator + day;
    return timeStr
}

function getLoadMore(parent, options) {
    var ele = parent.querySelector(".js-load-more");
    options.status;
    return ele || (ele = document.createElement("li"), ele.innerText = "点击加载更多...", ele.classList.add("js-load-more")), ele.onclick = function() {
        render.call(null, url, options)
    }, ele
}! function(name, context, definition) {
    context[name] = context[name] || definition(), "undefined" != typeof module && module.exports ? module.exports = context[name] : "function" == typeof define && define.amd && define("src/bus/openservice/qd/index-debug", [], function() {
        return context[name]
    })
}("Promise", "undefined" != typeof global ? global : this, function() {
    "use strict";

    function schedule(fn, self) {
        scheduling_queue.add(fn, self), cycle || (cycle = timer(scheduling_queue.drain))
    }

    function isThenable(o) {
        var _then, o_type = typeof o;
        return null == o || "object" != o_type && "function" != o_type || (_then = o.then), "function" == typeof _then && _then
    }

    function notify() {
        for (var i = 0; i < this.chain.length; i++) notifyIsolated(this, 1 === this.state ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
        this.chain.length = 0
    }

    function notifyIsolated(self, cb, chain) {
        var ret, _then;
        try {
            cb === !1 ? chain.reject(self.msg) : (ret = cb === !0 ? self.msg : cb.call(void 0, self.msg), ret === chain.promise ? chain.reject(TypeError("Promise-chain cycle")) : (_then = isThenable(ret)) ? _then.call(ret, chain.resolve, chain.reject) : chain.resolve(ret))
        } catch (err) {
            chain.reject(err)
        }
    }

    function resolve(msg) {
        var _then, self = this;
        if (!self.triggered) {
            self.triggered = !0, self.def && (self = self.def);
            try {
                (_then = isThenable(msg)) ? schedule(function() {
                    var def_wrapper = new MakeDefWrapper(self);
                    try {
                        _then.call(msg, function() {
                            resolve.apply(def_wrapper, arguments)
                        }, function() {
                            reject.apply(def_wrapper, arguments)
                        })
                    } catch (err) {
                        reject.call(def_wrapper, err)
                    }
                }): (self.msg = msg, self.state = 1, self.chain.length > 0 && schedule(notify, self))
            } catch (err) {
                reject.call(new MakeDefWrapper(self), err)
            }
        }
    }

    function reject(msg) {
        var self = this;
        self.triggered || (self.triggered = !0, self.def && (self = self.def), self.msg = msg, self.state = 2, self.chain.length > 0 && schedule(notify, self))
    }

    function iteratePromises(Constructor, arr, resolver, rejecter) {
        for (var idx = 0; idx < arr.length; idx++) ! function(idx) {
            Constructor.resolve(arr[idx]).then(function(msg) {
                resolver(idx, msg)
            }, rejecter)
        }(idx)
    }

    function MakeDefWrapper(self) {
        this.def = self, this.triggered = !1
    }

    function MakeDef(self) {
        this.promise = self, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0
    }

    function Promise(executor) {
        if ("function" != typeof executor) throw TypeError("Not a function");
        if (0 !== this.__NPO__) throw TypeError("Not a promise");
        this.__NPO__ = 1;
        var def = new MakeDef(this);
        this.then = function(success, failure) {
            var o = {
                success: "function" != typeof success || success,
                failure: "function" == typeof failure && failure
            };
            return o.promise = new this.constructor(function(resolve, reject) {
                if ("function" != typeof resolve || "function" != typeof reject) throw TypeError("Not a function");
                o.resolve = resolve, o.reject = reject
            }), def.chain.push(o), 0 !== def.state && schedule(notify, def), o.promise
        }, this["catch"] = function(failure) {
            return this.then(void 0, failure)
        };
        try {
            executor.call(void 0, function(msg) {
                resolve.call(def, msg)
            }, function(msg) {
                reject.call(def, msg)
            })
        } catch (err) {
            reject.call(def, err)
        }
    }
    var builtInProp, cycle, scheduling_queue, ToString = Object.prototype.toString,
        timer = "undefined" != typeof setImmediate ? function(fn) {
            return setImmediate(fn)
        } : setTimeout;
    try {
        Object.defineProperty({}, "x", {}), builtInProp = function(obj, name, val, config) {
            return Object.defineProperty(obj, name, {
                value: val,
                writable: !0,
                configurable: config !== !1
            })
        }
    } catch (err) {
        builtInProp = function(obj, name, val) {
            return obj[name] = val, obj
        }
    }
    scheduling_queue = function() {
        function Item(fn, self) {
            this.fn = fn, this.self = self, this.next = void 0
        }
        var first, last, item;
        return {
            add: function(fn, self) {
                item = new Item(fn, self), last ? last.next = item : first = item, last = item, item = void 0
            },
            drain: function() {
                var f = first;
                for (first = last = cycle = void 0; f;) f.fn.call(f.self), f = f.next
            }
        }
    }();
    var PromisePrototype = builtInProp({}, "constructor", Promise, !1);
    return Promise.prototype = PromisePrototype, builtInProp(PromisePrototype, "__NPO__", 0, !1), builtInProp(Promise, "resolve", function(msg) {
        var Constructor = this;
        return msg && "object" == typeof msg && 1 === msg.__NPO__ ? msg : new Constructor(function(resolve, reject) {
            if ("function" != typeof resolve || "function" != typeof reject) throw TypeError("Not a function");
            resolve(msg)
        })
    }), builtInProp(Promise, "reject", function(msg) {
        return new this(function(resolve, reject) {
            if ("function" != typeof resolve || "function" != typeof reject) throw TypeError("Not a function");
            reject(msg)
        })
    }), builtInProp(Promise, "all", function(arr) {
        var Constructor = this;
        return "[object Array]" != ToString.call(arr) ? Constructor.reject(TypeError("Not an array")) : 0 === arr.length ? Constructor.resolve([]) : new Constructor(function(resolve, reject) {
            if ("function" != typeof resolve || "function" != typeof reject) throw TypeError("Not a function");
            var len = arr.length,
                msgs = Array(len),
                count = 0;
            iteratePromises(Constructor, arr, function(idx, msg) {
                msgs[idx] = msg, ++count === len && resolve(msgs)
            }, reject)
        })
    }), builtInProp(Promise, "race", function(arr) {
        var Constructor = this;
        return "[object Array]" != ToString.call(arr) ? Constructor.reject(TypeError("Not an array")) : new Constructor(function(resolve, reject) {
            if ("function" != typeof resolve || "function" != typeof reject) throw TypeError("Not a function");
            iteratePromises(Constructor, arr, function(idx, msg) {
                resolve(msg)
            }, reject)
        })
    }), Promise
});
var begin, url, pop, userId, status, expire, isExpired, timeStamp, unfinished, attrToMerge, unfinishedOptions;
url = "/openservice/qiandunRpc/queryLegalCaseDtoList.json", userId = session("userId"), timeStamp = session("timeStamp"), expire = 6e5, isExpired = !0, pop = window.PopWin && window.PopWin(), attrToMerge = ["content", "data"], unfinishedOptions = {
    paramName: "filterMap",
    status: "unfinished",
    length: 10,
    begin: 0
}, timeStamp && (isExpired = Date.now() - timeStamp > expire), userId ? (unfinishedOptions.havanaId = userId, isExpired ? renderAll(url, unfinishedOptions) : (unfinished = session("unfinished"), unfinished && renderList(JSON.parse(unfinished), unfinishedOptions))) : window.WindVane.call("WVNative", "get_user_info", {}, function(data) {
    pop && pop.loading(), userId = data.userId, unfinishedOptions.havanaId = userId, session("userId", userId), renderAll(url, unfinishedOptions)
}, function(err) {
    pop && pop.close()
});