/*! Native Promise Only
    v0.8.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/

(function UMD(name,context,definition){
  // special form of UMD for polyfilling across evironments
  context[name] = context[name] || definition();
  if (typeof module != "undefined" && module.exports) { module.exports = context[name]; }
  else if (typeof define == "function" && define.amd) { define(function $AMD$(){ return context[name]; }); }
})("Promise",typeof global != "undefined" ? global : this,function DEF(){
  /*jshint validthis:true */
  "use strict";

  var builtInProp, cycle, scheduling_queue,
    ToString = Object.prototype.toString,
    timer = (typeof setImmediate != "undefined") ?
      function timer(fn) { return setImmediate(fn); } :
      setTimeout
  ;

  // dammit, IE8.
  try {
    Object.defineProperty({},"x",{});
    builtInProp = function builtInProp(obj,name,val,config) {
      return Object.defineProperty(obj,name,{
        value: val,
        writable: true,
        configurable: config !== false
      });
    };
  }
  catch (err) {
    builtInProp = function builtInProp(obj,name,val) {
      obj[name] = val;
      return obj;
    };
  }

  // Note: using a queue instead of array for efficiency
  scheduling_queue = (function Queue() {
    var first, last, item;

    function Item(fn,self) {
      this.fn = fn;
      this.self = self;
      this.next = void 0;
    }

    return {
      add: function add(fn,self) {
        item = new Item(fn,self);
        if (last) {
          last.next = item;
        }
        else {
          first = item;
        }
        last = item;
        item = void 0;
      },
      drain: function drain() {
        var f = first;
        first = last = cycle = void 0;

        while (f) {
          f.fn.call(f.self);
          f = f.next;
        }
      }
    };
  })();

  function schedule(fn,self) {
    scheduling_queue.add(fn,self);
    if (!cycle) {
      cycle = timer(scheduling_queue.drain);
    }
  }

  // promise duck typing
  function isThenable(o) {
    var _then, o_type = typeof o;

    if (o != null &&
      (
        o_type == "object" || o_type == "function"
      )
    ) {
      _then = o.then;
    }
    return typeof _then == "function" ? _then : false;
  }

  function notify() {
    for (var i=0; i<this.chain.length; i++) {
      notifyIsolated(
        this,
        (this.state === 1) ? this.chain[i].success : this.chain[i].failure,
        this.chain[i]
      );
    }
    this.chain.length = 0;
  }

  // NOTE: This is a separate function to isolate
  // the `try..catch` so that other code can be
  // optimized better
  function notifyIsolated(self,cb,chain) {
    var ret, _then;
    try {
      if (cb === false) {
        chain.reject(self.msg);
      }
      else {
        if (cb === true) {
          ret = self.msg;
        }
        else {
          ret = cb.call(void 0,self.msg);
        }

        if (ret === chain.promise) {
          chain.reject(TypeError("Promise-chain cycle"));
        }
        else if (_then = isThenable(ret)) {
          _then.call(ret,chain.resolve,chain.reject);
        }
        else {
          chain.resolve(ret);
        }
      }
    }
    catch (err) {
      chain.reject(err);
    }
  }

  function resolve(msg) {
    var _then, self = this;

    // already triggered?
    if (self.triggered) { return; }

    self.triggered = true;

    // unwrap
    if (self.def) {
      self = self.def;
    }

    try {
      if (_then = isThenable(msg)) {
        schedule(function(){
          var def_wrapper = new MakeDefWrapper(self);
          try {
            _then.call(msg,
              function $resolve$(){ resolve.apply(def_wrapper,arguments); },
              function $reject$(){ reject.apply(def_wrapper,arguments); }
            );
          }
          catch (err) {
            reject.call(def_wrapper,err);
          }
        })
      }
      else {
        self.msg = msg;
        self.state = 1;
        if (self.chain.length > 0) {
          schedule(notify,self);
        }
      }
    }
    catch (err) {
      reject.call(new MakeDefWrapper(self),err);
    }
  }

  function reject(msg) {
    var self = this;

    // already triggered?
    if (self.triggered) { return; }

    self.triggered = true;

    // unwrap
    if (self.def) {
      self = self.def;
    }

    self.msg = msg;
    self.state = 2;
    if (self.chain.length > 0) {
      schedule(notify,self);
    }
  }

  function iteratePromises(Constructor,arr,resolver,rejecter) {
    for (var idx=0; idx<arr.length; idx++) {
      (function IIFE(idx){
        Constructor.resolve(arr[idx])
        .then(
          function $resolver$(msg){
            resolver(idx,msg);
          },
          rejecter
        );
      })(idx);
    }
  }

  function MakeDefWrapper(self) {
    this.def = self;
    this.triggered = false;
  }

  function MakeDef(self) {
    this.promise = self;
    this.state = 0;
    this.triggered = false;
    this.chain = [];
    this.msg = void 0;
  }

  function Promise(executor) {
    if (typeof executor != "function") {
      throw TypeError("Not a function");
    }

    if (this.__NPO__ !== 0) {
      throw TypeError("Not a promise");
    }

    // instance shadowing the inherited "brand"
    // to signal an already "initialized" promise
    this.__NPO__ = 1;

    var def = new MakeDef(this);

    this["then"] = function then(success,failure) {
      var o = {
        success: typeof success == "function" ? success : true,
        failure: typeof failure == "function" ? failure : false
      };
      // Note: `then(..)` itself can be borrowed to be used against
      // a different promise constructor for making the chained promise,
      // by substituting a different `this` binding.
      o.promise = new this.constructor(function extractChain(resolve,reject) {
        if (typeof resolve != "function" || typeof reject != "function") {
          throw TypeError("Not a function");
        }

        o.resolve = resolve;
        o.reject = reject;
      });
      def.chain.push(o);

      if (def.state !== 0) {
        schedule(notify,def);
      }

      return o.promise;
    };
    this["catch"] = function $catch$(failure) {
      return this.then(void 0,failure);
    };

    try {
      executor.call(
        void 0,
        function publicResolve(msg){
          resolve.call(def,msg);
        },
        function publicReject(msg) {
          reject.call(def,msg);
        }
      );
    }
    catch (err) {
      reject.call(def,err);
    }
  }

  var PromisePrototype = builtInProp({},"constructor",Promise,
    /*configurable=*/false
  );

  // Note: Android 4 cannot use `Object.defineProperty(..)` here
  Promise.prototype = PromisePrototype;

  // built-in "brand" to signal an "uninitialized" promise
  builtInProp(PromisePrototype,"__NPO__",0,
    /*configurable=*/false
  );

  builtInProp(Promise,"resolve",function Promise$resolve(msg) {
    var Constructor = this;

    // spec mandated checks
    // note: best "isPromise" check that's practical for now
    if (msg && typeof msg == "object" && msg.__NPO__ === 1) {
      return msg;
    }

    return new Constructor(function executor(resolve,reject){
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      resolve(msg);
    });
  });

  builtInProp(Promise,"reject",function Promise$reject(msg) {
    return new this(function executor(resolve,reject){
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      reject(msg);
    });
  });

  builtInProp(Promise,"all",function Promise$all(arr) {
    var Constructor = this;

    // spec mandated checks
    if (ToString.call(arr) != "[object Array]") {
      return Constructor.reject(TypeError("Not an array"));
    }
    if (arr.length === 0) {
      return Constructor.resolve([]);
    }

    return new Constructor(function executor(resolve,reject){
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      var len = arr.length, msgs = Array(len), count = 0;

      iteratePromises(Constructor,arr,function resolver(idx,msg) {
        msgs[idx] = msg;
        if (++count === len) {
          resolve(msgs);
        }
      },reject);
    });
  });

  builtInProp(Promise,"race",function Promise$race(arr) {
    var Constructor = this;

    // spec mandated checks
    if (ToString.call(arr) != "[object Array]") {
      return Constructor.reject(TypeError("Not an array"));
    }

    return new Constructor(function executor(resolve,reject){
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      iteratePromises(Constructor,arr,function resolver(idx,msg){
        resolve(msg);
      },reject);
    });
  });

  return Promise;
});

var begin,
    url,
    pop,
    userId,
    status,
    expire,
    isExpired,
    timeStamp,
    unfinished,
    attrToMerge,
    unfinishedOptions;
url = "/openservice/qiandunRpc/queryLegalCaseDtoList.json";
userId = session("userId") || "3680010221";
timeStamp = session("timeStamp");
expire = 1000 * 60 * 10;
isExpired = true;
pop = window.PopWin && window.PopWin();
attrToMerge = ["content", "data"]; //要合并的JSON字段
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
    //如果本地有存储userId,则不需要再调用接口去获取userId\
    unfinishedOptions.havanaId = userId;
    renderAll(url, unfinishedOptions);
    // unfinishedOptions.havanaId = userId;
    // if (!isExpired) {
    //     //如果页面存储未过期,渲染本地存储数据
    //     unfinished = session("unfinished");
    //     unfinished && renderList(JSON.parse(unfinished), unfinishedOptions);

    // } else {
    //     //根据userId发送ajax请求,并渲染页面
    //     renderAll(url, unfinishedOptions);
    // }

} else {
    // 如果本地没有userId,说明是第一次进入,调用接口获取userId,并发送ajax获取数据,渲染页面
    window.WindVane.call("WVNative", "get_user_info", {}, function (data) {
        if (pop) {
            pop.loading();
        }
        userId = data.userId;
        unfinishedOptions.havanaId = userId;
        session("userId", userId);
        renderAll(url, unfinishedOptions);
    }, function (err) {
        console.error(JSON.stringify(err));
        if (pop) {
            pop.close();
        }
    });
}
function renderAll(url, option) {
    render(url, option).then(function (mainCount) {
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
            return rtv;
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