"use strict";
/**
 * 标题：工具类
 */
define(function(require, exports) {

	var limit = require('common/limit');

	var WIN = window;

	// 原生返回
	if(WIN.Promise){
		Promise.prototype.Catch = function(fn){
			return this.then(null, fn);
		};
		return Promise;
	};

	// Promise
	class MyPromise {
		constructor(...args){
			// 状态值
			this.PromiseStatus = 'pedding';
			// 返回值
			this.PromiseValue = undefined;
			// 栈区
			this.Stack = [];
			if( limit.isFunction(args[0]) ){
				this.promiseList = [];
				let fun = args[0];
				let resolve = (val) => {
					limit.each([this].concat(this.promiseList), promise => {
						if(promise.PromiseStatus === 'pedding'){
							promise.PromiseStatus = 'resolved';
							promise.PromiseValue = val;
							promise._clean();
						};
					});
				};
				let reject = (val) => {
					limit.each([this].concat(this.promiseList), promise => {
						if(promise.PromiseStatus === 'pedding'){
							promise.PromiseStatus = 'rejected';
							promise.PromiseValue = val;
							promise._clean();
						};
					});
					setTimeout(() => {
						if(!this.promiseList.length){
							throw '(in promise) ' + val; 
						};
					}, 0);
				};
				try{
					fun(resolve, reject);
				}catch(e){
					this.PromiseStatus = 'rejected';
					this.PromiseValue = e;
				};
			}else{
				this.PromiseStatus = args[0];
				this.PromiseValue = args[1];
			};
		}
		then(suc, err){
			suc = limit.cb(suc);
			err = limit.cb(err);
			let me = this;
			if(me.promiseList){
				let originMe = me;
				me = new MyPromise(me.PromiseStatus, me.PromiseValue);
				originMe.promiseList.push(me);
			};
			me.Stack.push({suc, err});
			if(me.PromiseStatus !== 'pedding' && !me.cleanStatus){
				me._clean();	
			};
			return me;
		}
		Catch(err){
			return this.then(null, err);
		}
		_clean(){
			let me = this,
				one = me.Stack.shift();
			me.cleanStatus = 'init';
			if(one){
				setTimeout(() => {
					try{
						switch(me.PromiseStatus){
							case 'resolved':
								me.PromiseValue = one.suc(me.PromiseValue);
							break;
							case 'rejected':
								me.PromiseValue = one.err(me.PromiseValue);
							break;
						};
						me.PromiseStatus = 'resolved';
					}catch(e){
						me.PromiseStatus = 'rejected';
						me.PromiseValue = e;
						if(!me.Stack.length){
							setTimeout(() => {
								throw '(in promise) ' + e;
							}, 0);
						};
					};
					me._clean();
				}, 0);
			}else{
				delete me.cleanStatus;
			};
			return me;
		}
		static all(list){
			let guid = list.length,
				back,
				args = [];
			function main(arg, key){
				args[key] = arg;
				if(!--guid){
					back(args);
				};
			};
			return new MyPromise((resolve, reject) => {
				back = resolve;
				limit.each(list, (val, key) => {
					// Promise对象
					if(val.PromiseStatus){
						val.then(sucVal => {
							main(sucVal, key);
						}, errVal => {
							reject(errVal);
						});
					}else{
						main(val, key);
					};
				});
			});
		}
		static race(list){
			return new MyPromise((resolve, reject) => {
				limit.each(list, val => {
					MyPromise.resolve(val).then( sucVal => resolve(sucVal), errVal => reject(errVal) );
				});
			});
		}
		static resolve(val){
			if(val && val.then){
				return new MyPromise((resolve, reject) => {
					val.then(resolve, reject);
				});
			};
			return new MyPromise((resolve, reject) => {
				resolve(val);
			});
		}
		static reject(val){
			return new MyPromise((resolve, reject) => {
				reject(val);
			});
		}
	};

	return MyPromise;

});
