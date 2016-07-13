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
        mathRandom: function(max, min) {
            var max = ~max,
                min = ~min,
                maxNum = Math.max(max, min),
                minNum = Math.min(max, min);
            return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
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
