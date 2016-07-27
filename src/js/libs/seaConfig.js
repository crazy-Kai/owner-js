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
            'class'         : 'myWidget/class',
            'events'        : 'myWidget/events',
            'aspect'        : 'myWidget/aspect',
            'attrs'         : 'myWidget/attrs',
            'base'          : 'myWidget/base',
            'widget'        : 'myWidget/widget',
            'limit'         : 'common/limit',
            'react'         : 'common/react',
            'reactDOM'      : 'common/react-dom',
            'reflux'        : 'common/reflux',
            '$'             : 'common/jquery',
            '_'             : 'common/underscore1.8',
              //弹出层
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