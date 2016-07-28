;(function(){

    //配置
    var config = {
       
         //基础路径
        base: "/src/js/",
        //配置路径
        paths: {
            'github'        : 'http://wu-xiao-wen.github.io/src/js',
            //支付宝
            'arale'         : 'https://a.alipayobjects.com/arale'
        },
        //别名配置
        alias: {
            'class'         : 'common/class',
            'events'        : 'common/events',
            'aspect'        : 'common/aspect',
            'attrs'         : 'common/attrs',
            'base'          : 'common/base',
            'widget'        : 'common/widget',
            'limit'         : 'common/limit',
            'react'         : 'bus/common/react',
            'reactDOM'      : 'bus/common/react-dom',
            'reflux'        : 'common/reflux',
            '$'             : 'common/jquery',
              //弹出层
            "handlebars"    : "alinw/handlebars/1.3.0/handlebars", 
            "dialog"        : "alinw/dialog/2.0.6/dialog",
           //arale Base
            'araleBase'     : "arale/base/1.1.1/base",
            //arale widget
            'araleWidget'   : "arale/widget/1.1.1/widget"
        },
        charset: 'utf-8',
        debug: true
    };
   if (typeof seajs !== 'undefined') {
        config.paths = {
            'github'     : 'http://wu-xiao-wen.github.io/src/js',
            //支付宝
            'arale'       : 'https://a.alipayobjects.com/arale'
        }
        seajs.config(config);
   }
     // 兼容cmd规范
    if (typeof define === 'function') {
        define(function(require, exports, module) {
            module.exports = config;
        });
    }

    return config;


})();