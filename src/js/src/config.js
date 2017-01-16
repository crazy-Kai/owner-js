(function() {

    // 根据环境选择不同的资源服务器
    var isDaily = false;
    if (typeof document !== 'undefined') {
        var scripts = document.getElementsByTagName('script');
        isDaily = (scripts[scripts.length - 1].src || '').indexOf('//alinw.alicdn.com') == -1;
    }
    var cdnHost = isDaily ? '//g-assets.daily.taobao.net' : '//alinw.alicdn.com';

    var global = typeof window == 'undefined' ? {} : window;
    global.CONFIG = global.CONFIG || {};

    // seajs配置（打包和运行时共用）
    var config = {

        base: global.CONFIG.assetsLink,
        alias: {
            'seajs-debug'     : 'seajs/seajs-debug/1.1.1/seajs-debug',
            '$'               : 'common/jQuery',
            '$-debug'         : 'common/jQuery',
            'react'           : 'common/react',
            'reactDOM'        : 'common/react-dom',
            'reflux'          : 'common/reflux',
            //Base
            'base': "arale/base/1.1.1/base",
            //组件
            'widget': "arale/widget/1.1.1/widget",
            //验证
            "validator": "alinw/validator/3.1.4/validator",
            //弹出层
            "dialog": "alinw/dialog/2.0.6/dialog",
            //模板
            "handlebars": "alinw/handlebars/1.3.0/handlebars",
            //滚动条
            "scroller": "alinw/scroller/1.0.1/scroller.js",
            //日期
            "calendar": "alinw/calendar/1.1.17/calendar",
            //轮转
            "carousel": "alinw/switchable/1.0.1/carousel",
            //轮转
            "slide": "alinw/switchable/1.0.1/slide",            
            //提示
            "tip": "alinw/tip/2.2.1/tip",
            //批量转移
            "transfer": "alinw/transfer/1.0.0/transfer"
        },
        crossorigin: true,
        comboSyntax: ['??', ','],
        comboMaxLength: 1000,
        preload: [],
        charset: 'utf-8',
        timeout: 1000,
        debug: true,
        map: [
            [ '.js', '.js?buyaozaiyizhege' ] //防止简单匹配被劫持
        ]
    };

    // 仅限浏览器时使用
    if (typeof seajs !== 'undefined') {
        config.paths = {
            'gallery' : 'https://alinw.alipayobjects.com/gallery',
            'arale'   : 'https://alinw.alipayobjects.com/arale',
            'alipay'  : 'https://alinw.alipayobjects.com/alipay',
            'seajs'  : 'https://alinw.alipayobjects.com/seajs',
            'platform': cdnHost + '/platform',
            'alinw'   : cdnHost + '/alinw',
            'crystal' : cdnHost + '/crystal'
        };

        seajs.config(config);

        // 在浏览器下新增接口，确保异步加载，同步执行。
        ;(function(seajs, $){

            var useList = [],
                arrPro  = Array.prototype,
                concat  = arrPro.concat,
                slice   = arrPro.slice;
            // 暴露出增加的方法
            seajs.add = function(){
                return useList = concat.apply( useList, slice.call(arguments) );
            };

            // DOM加载完成
            $(function(){
                var $body = $('body'),
                    widgetMap = [],
                    widgetArr = [];
                // 遍历节点
                $('[widget]').each(function(){
                    var self = $(this);
                    widgetMap[ widgetArr.push( self.attr('widget') ) - 1 ] = self;
                });

                // 顺序: 
                // 1. <div widget="x"></div>; 配置 widget-trigger 就是用trigger入参
                // 2. sea.add('x');
                useList = concat.call(arrPro, widgetArr, useList);
                useList.length && seajs.use(useList, function(){
                    $.each(arguments, function(i){
                        var element = widgetMap[i],
                            config = {};
                        element && (config[ element.attr('widget-trigger') === undefined ? 'element' : 'trigger'] = element); 
                        typeof this === 'function' && new this(config);
                    });
                });
            });

        })(seajs, $);
    }

    // 兼容cmd规范
    if (typeof define === 'function') {
        define(function(require, exports, module) {
            module.exports = config;
        });
    }

    return config;
})();
