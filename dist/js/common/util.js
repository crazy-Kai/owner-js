define(function(require, exports, module) {
    'use strict';
    //依赖
    var Promise = require('./promise');

    function formattingVal(val) {
        return ("00" + val).slice(-2);
    };
    module.exports = {
        formateDate: function(formate, timestamp) {
            var timeRag = /^(yyyy)(.MM)?(.dd)?(.HH)?(.mm)?(.ss)?$/,
                getTime = ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds'],
                data = arguments.length === 1 ? new Date() : new Date(timestamp),
                me = this;
            //+data 相当与data.getTime()方法，返回获取的number类型的毫秒数，+号将数据类型转换为number
            if (!isNaN(+data)) {
                return formate.replace(timeRag, function() {
                    var arr = [],
                        obj,
                        val;
                    for (var index = 1; index < arguments.length; index++) {
                        if (obj = arguments[index]) {
                            val = data[getTime[index - 1]]();
                            //年份处理
                            if (index === 1) {
                                arr.push("" + val)
                            } else {
                                //月份处理 加一个月
                                index === 2 && val++
                                    arr.push(obj.slice(0, 1) + me.formattingVal(val))
                            }
                        } else {
                            break;
                        }
                    };
                    return arr.join("");
                })
            } else {
                window.alert('时间戳解析错误')
            }

        },
        formattingVal:function(val){
            return ("00"+val).slice(-1)
        },
        mathRandom: function(form, to) {
            var form = ~~form,
            to = ~~to,
            max = Math.max(form, to),
            min = Math.min(form, to);
        //Math.random()取0-1之间的随机数
        return Math.floor(Math.random() * (max - min + 1) + min);
        },
        getInitData: function(url) {
            var promise =  new Promise(function(resolve, reject) {
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    success: resolve,
                    error: reject
                   
                });
            });
            return promise;
        }
    }
})
;
"use strict";
/**
 * 标题：工具类
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports) {

	var limit = require('common/limit');

	var WIN = window;

	// 原生返回
	if (WIN.Promise) {
		Promise.prototype.Catch = function (fn) {
			return this.then(null, fn);
		};
		return Promise;
	};

	// Promise

	var MyPromise = function () {
		function MyPromise() {
			var _this = this;

			_classCallCheck(this, MyPromise);

			// 状态值
			this.PromiseStatus = 'pedding';
			// 返回值
			this.PromiseValue = undefined;
			// 栈区
			this.Stack = [];
			if (limit.isFunction(arguments.length <= 0 ? undefined : arguments[0])) {
				this.promiseList = [];
				var fun = arguments.length <= 0 ? undefined : arguments[0];
				var resolve = function resolve(val) {
					limit.each([_this].concat(_this.promiseList), function (promise) {
						if (promise.PromiseStatus === 'pedding') {
							promise.PromiseStatus = 'resolved';
							promise.PromiseValue = val;
							promise._clean();
						};
					});
				};
				var reject = function reject(val) {
					limit.each([_this].concat(_this.promiseList), function (promise) {
						if (promise.PromiseStatus === 'pedding') {
							promise.PromiseStatus = 'rejected';
							promise.PromiseValue = val;
							promise._clean();
						};
					});
					setTimeout(function () {
						if (!_this.promiseList.length) {
							throw '(in promise) ' + val;
						};
					}, 0);
				};
				try {
					fun(resolve, reject);
				} catch (e) {
					this.PromiseStatus = 'rejected';
					this.PromiseValue = e;
				};
			} else {
				this.PromiseStatus = arguments.length <= 0 ? undefined : arguments[0];
				this.PromiseValue = arguments.length <= 1 ? undefined : arguments[1];
			};
		}

		_createClass(MyPromise, [{
			key: 'then',
			value: function then(suc, err) {
				suc = limit.cb(suc);
				err = limit.cb(err);
				var me = this;
				if (me.promiseList) {
					var originMe = me;
					me = new MyPromise(me.PromiseStatus, me.PromiseValue);
					originMe.promiseList.push(me);
				};
				me.Stack.push({ suc: suc, err: err });
				if (me.PromiseStatus !== 'pedding' && !me.cleanStatus) {
					me._clean();
				};
				return me;
			}
		}, {
			key: 'Catch',
			value: function Catch(err) {
				return this.then(null, err);
			}
		}, {
			key: '_clean',
			value: function _clean() {
				var me = this,
				    one = me.Stack.shift();
				me.cleanStatus = 'init';
				if (one) {
					setTimeout(function () {
						try {
							switch (me.PromiseStatus) {
								case 'resolved':
									me.PromiseValue = one.suc(me.PromiseValue);
									break;
								case 'rejected':
									me.PromiseValue = one.err(me.PromiseValue);
									break;
							};
							me.PromiseStatus = 'resolved';
						} catch (e) {
							me.PromiseStatus = 'rejected';
							me.PromiseValue = e;
							if (!me.Stack.length) {
								setTimeout(function () {
									throw '(in promise) ' + e;
								}, 0);
							};
						};
						me._clean();
					}, 0);
				} else {
					delete me.cleanStatus;
				};
				return me;
			}
		}], [{
			key: 'all',
			value: function all(list) {
				var guid = list.length,
				    back = void 0,
				    args = [];
				function main(arg, key) {
					args[key] = arg;
					if (! --guid) {
						back(args);
					};
				};
				return new MyPromise(function (resolve, reject) {
					back = resolve;
					limit.each(list, function (val, key) {
						// Promise对象
						if (val.PromiseStatus) {
							val.then(function (sucVal) {
								main(sucVal, key);
							}, function (errVal) {
								reject(errVal);
							});
						} else {
							main(val, key);
						};
					});
				});
			}
		}, {
			key: 'race',
			value: function race(list) {
				return new MyPromise(function (resolve, reject) {
					limit.each(list, function (val) {
						MyPromise.resolve(val).then(function (sucVal) {
							return resolve(sucVal);
						}, function (errVal) {
							return reject(errVal);
						});
					});
				});
			}
		}, {
			key: 'resolve',
			value: function resolve(val) {
				if (val && val.then) {
					return new MyPromise(function (resolve, reject) {
						val.then(resolve, reject);
					});
				};
				return new MyPromise(function (resolve, reject) {
					resolve(val);
				});
			}
		}, {
			key: 'reject',
			value: function reject(val) {
				return new MyPromise(function (resolve, reject) {
					reject(val);
				});
			}
		}]);

		return MyPromise;
	}();

	;

	return MyPromise;
});
"use strict";
/**
 * 标题：工具类
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports) {

	var limit = require('common/limit');

	var WIN = window;

	// 原生返回
	if (WIN.Promise) {
		Promise.prototype.Catch = function (fn) {
			return this.then(null, fn);
		};
		return Promise;
	};

	// Promise

	var MyPromise = function () {
		function MyPromise() {
			var _this = this;

			_classCallCheck(this, MyPromise);

			// 状态值
			this.PromiseStatus = 'pedding';
			// 返回值
			this.PromiseValue = undefined;
			// 栈区
			this.Stack = [];
			if (limit.isFunction(arguments.length <= 0 ? undefined : arguments[0])) {
				this.promiseList = [];
				var fun = arguments.length <= 0 ? undefined : arguments[0];
				var resolve = function resolve(val) {
					limit.each([_this].concat(_this.promiseList), function (promise) {
						if (promise.PromiseStatus === 'pedding') {
							promise.PromiseStatus = 'resolved';
							promise.PromiseValue = val;
							promise._clean();
						};
					});
				};
				var reject = function reject(val) {
					limit.each([_this].concat(_this.promiseList), function (promise) {
						if (promise.PromiseStatus === 'pedding') {
							promise.PromiseStatus = 'rejected';
							promise.PromiseValue = val;
							promise._clean();
						};
					});
					setTimeout(function () {
						if (!_this.promiseList.length) {
							throw '(in promise) ' + val;
						};
					}, 0);
				};
				try {
					fun(resolve, reject);
				} catch (e) {
					this.PromiseStatus = 'rejected';
					this.PromiseValue = e;
				};
			} else {
				this.PromiseStatus = arguments.length <= 0 ? undefined : arguments[0];
				this.PromiseValue = arguments.length <= 1 ? undefined : arguments[1];
			};
		}

		_createClass(MyPromise, [{
			key: 'then',
			value: function then(suc, err) {
				suc = limit.cb(suc);
				err = limit.cb(err);
				var me = this;
				if (me.promiseList) {
					var originMe = me;
					me = new MyPromise(me.PromiseStatus, me.PromiseValue);
					originMe.promiseList.push(me);
				};
				me.Stack.push({ suc: suc, err: err });
				if (me.PromiseStatus !== 'pedding' && !me.cleanStatus) {
					me._clean();
				};
				return me;
			}
		}, {
			key: 'Catch',
			value: function Catch(err) {
				return this.then(null, err);
			}
		}, {
			key: '_clean',
			value: function _clean() {
				var me = this,
				    one = me.Stack.shift();
				me.cleanStatus = 'init';
				if (one) {
					setTimeout(function () {
						try {
							switch (me.PromiseStatus) {
								case 'resolved':
									me.PromiseValue = one.suc(me.PromiseValue);
									break;
								case 'rejected':
									me.PromiseValue = one.err(me.PromiseValue);
									break;
							};
							me.PromiseStatus = 'resolved';
						} catch (e) {
							me.PromiseStatus = 'rejected';
							me.PromiseValue = e;
							if (!me.Stack.length) {
								setTimeout(function () {
									throw '(in promise) ' + e;
								}, 0);
							};
						};
						me._clean();
					}, 0);
				} else {
					delete me.cleanStatus;
				};
				return me;
			}
		}], [{
			key: 'all',
			value: function all(list) {
				var guid = list.length,
				    back = void 0,
				    args = [];
				function main(arg, key) {
					args[key] = arg;
					if (! --guid) {
						back(args);
					};
				};
				return new MyPromise(function (resolve, reject) {
					back = resolve;
					limit.each(list, function (val, key) {
						// Promise对象
						if (val.PromiseStatus) {
							val.then(function (sucVal) {
								main(sucVal, key);
							}, function (errVal) {
								reject(errVal);
							});
						} else {
							main(val, key);
						};
					});
				});
			}
		}, {
			key: 'race',
			value: function race(list) {
				return new MyPromise(function (resolve, reject) {
					limit.each(list, function (val) {
						MyPromise.resolve(val).then(function (sucVal) {
							return resolve(sucVal);
						}, function (errVal) {
							return reject(errVal);
						});
					});
				});
			}
		}, {
			key: 'resolve',
			value: function resolve(val) {
				if (val && val.then) {
					return new MyPromise(function (resolve, reject) {
						val.then(resolve, reject);
					});
				};
				return new MyPromise(function (resolve, reject) {
					resolve(val);
				});
			}
		}, {
			key: 'reject',
			value: function reject(val) {
				return new MyPromise(function (resolve, reject) {
					reject(val);
				});
			}
		}]);

		return MyPromise;
	}();

	;

	return MyPromise;
});