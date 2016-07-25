"use strict"
define(function(require, exports, module) {

    var obj = {};
    obj.parseElement = function(element, val) {
        var dataSet = {};
        if (element.dataSet) {
            //将其转换为原始的对象
            dataSet = $.extent({}, element.dataSet)
        } else {
            var attr = element.attributes;
            for (; i < attr.length; i++) {
                var name = attr[i].name;
                if (name.indexOf('data-') === 0) {
                    name = formateStr(name.substring(5))
                    dataSet[name] = attr[i].value
                }
            }

        }
        return val === true ? dataSet : normalizeValues(dataSet)
    };
    //help
    var strReg = /-([a-z])/g,
        jsonReg = /^\s*[\[{].*[\]}]\s*$/;

    function formateStr(str) {
        str.toLowerCase().replace(strReg, function(all, letter) {
            return letter.toUpperCase() + ""
        })
    }

    function normalizeValues(data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                var val = data[i];
                if (typeof val !== "string") continue
                if (jsonReg.test(data)) {
                    val = val.replace(/\'/g, '"');
                    //赋值！
                    data[i] = normalizeValues(JSON.parse(val))
                } else {
                    normalizeValue(data)
                }
            }
        }
        return data
    }

    //// 将 'false' 转换为 false
    // 'true' 转换为 true
    // '3253.34' 转换为 3253.34
    function normalizeValue(value) {
        if (value.toLowerCase() === "true") {
            value = true;
        } else if (value.toLowerCase() === "false") {
            value = false;
        } else if (/\d/.test(value) && /[^a-z]/i.test(value)) {
            var number = parseFloat(value);
            if ((number + "") === value) {
                value = number;
            }
        }
        return value;
    }
    return obj;
})
