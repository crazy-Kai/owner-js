"use strict";
/**
 * 业务：首页[domain/index]
 * 2015,05,19 邵红亮
 */
define(function(require, exports, module) {

    //默认依赖一个全局都引用的业务模块
    require('bus/global/main');

    //依赖
    var $ = require('$'),
        delegate = require('common/delegate'),
        Carousel = require('carousel'),
        Slide = require('slide'),
        Cookie = require('common/cookie'),
        dialog = require('common/dialog'),
        PostMessage = require('model/postMessage/main');

    //事件联系我们
    delegate.on('click', '.JS-trigger-click-contactus-close', function() {
        $(this).closest('.JS-target-contactus').removeClass('st-open');
    });
    delegate.on('click', '.JS-trigger-click-contactus-open', function() {
        $(this).closest('.JS-target-contactus').addClass('st-open');
    });

    delegate.on('click', '[data-role="view-vedio"]', function() {
        var Dialog = dialog.show('/portal/main/domain/vedioView.htm', { width: 640, height: 460 }),
            postMessageExp = new PostMessage();
        Dialog.after('hide', function() {
            window.top.screenFull = null;
            window.top.screenSmall = null;
            postMessageExp.destroy();
        });
        var screenFull = window.top.screenFull = function() {
            Dialog.set('width', '99%');
            Dialog.set('height', '99%');
            Dialog._setPosition();
        };
        var screenSmall = window.top.screenSmall = function() {
            Dialog.set('width', 640);
            Dialog.set('height', 460);
            Dialog._setPosition();
        };
        postMessageExp.add(function(data){
            if(data.type === 'screenFull'){
                if(data.value){
                    screenFull();
                }else{
                    screenSmall();
                };
            };
        });
    });

    $("body").on('click', '#logoutbtn', function(event) {
        event.preventDefault();

        Cookie.remove('InvestigationPID');

        window.location.href = "/loginOut.do";
    })



    if ($('#Carousel-court-trail-case').length) {
        new Carousel({
            element: '#Carousel-court-trail-case',
            effect: 'scrollx',
            hasTriggers: false,
            autoplay: true,
            interval: 2000,
            viewSize: [1090],
        }).render();
    };

    if ($('#Slide-focus-notice').length) {
        new Slide({
            element: '#Slide-focus-notice',
            effect: 'fade',
            activeIndex: 0
        }).render();
    };
    if ($('#banner').length) {
        new Slide({
            element: '#banner',
            effect: 'fade',
            activeIndex: 0
        }).render();
    };

});
