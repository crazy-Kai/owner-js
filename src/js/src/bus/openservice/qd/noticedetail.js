define(function (require, exports, module) {
    var TEMPLATE = require('./noticedetail-hbs');
    var $ = require('common/jQuery');
    var calendar = require('common/calendar');
    var util = require('common/util');
    var DOWN_URL = '/aeolus/lassenPushDetailRpc/exportPushDetail.json';
    var Persearch = require('model/perSearch/main');
    var defaultStart = util.formatData("yyyy-MM-dd", Date.now() - 60 * 60 * 24 * 7 * 1000);
    var defaultEnd = util.formatData("yyyy-MM-dd", Date.now());
    var startDate = new calendar({
        trigger: $('#submit-date-fr')
    });
    var endDate = new calendar({
        trigger: $('#submit-date-to')
    });
    $('#submit-date-fr').val(defaultStart);
    $('#submit-date-to').val(defaultEnd);

    startDate.on('selectDate', function (date) {
        endDate.range([date, null]);
        date.hour(0);
        date.minute(0);
        date.second(0);
    });
    endDate.on('selectDate', function (date) {
        startDate.range([null, date]);
        date.hour(23);
        date.minute(59);
        date.second(59);
    });
    var perSearchExp = new Persearch({
        element: '.searchList',
        template: TEMPLATE.source
    });
    $('#generate-btn').on('click', function () {
        var param = perSearchExp.searchListParam;
        param.pushStartTime = $("#submit-date-fr").val();
        param.pushEndTime = $("#submit-date-to").val();
        param = JSON.stringify(param);
        window.open(DOWN_URL + '?filterMap=' + param);
    });
    $('#search').on('click', function () {
        perSearchExp.searchListReload();
    });
});