"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    require('../common/main');

    // 业务类
    new(require('./page'))();

    // 意见反馈
    new(require('../common/feedback'))();

});
