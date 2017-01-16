"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    require('../common/main');

    var $ = require('$'),
        Validator = require('common/validator');


    var ValidatorExp = Validator.use('#simCaseForm', '[data-widget="validator"]', {
        events: {
            'click #reset': function() {
                var me = this;
                this.element[0].reset();
                me.$('[type="text"],textarea,select').val('');
            }
        }
    });

    
    



    

});
