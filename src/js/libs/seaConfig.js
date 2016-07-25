(function(){

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
            'handlebars'    : 'alinw/handlebars/1.3.0/handlebars',
            'widget'        : "arale/widget/1.1.1/widget",
            'limit'         : 'common/limit',
            'react'         : 'common/react',
            'reactDOM'      : 'common/react-dom',
            'reflux'        : 'common/reflux',
            '$'             : 'libs/jQuery',
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
    seajs.config(config);
     // 兼容cmd规范
    if (typeof define === 'function') {
        define(function(require, exports, module) {
            module.exports = config;
        });
    }

    return config;


})();