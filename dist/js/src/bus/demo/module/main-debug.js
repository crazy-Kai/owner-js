define("src/bus/demo/module/main-debug", ["common/jquery-debug", "common/validator-debug", "model/paginator/main-debug", "model/searchList/main-debug"], function(require, exports, module) {
    function formValidation() {
        var valiVal = !1;
        return validatorExp.execute(function(flag, element) {
            valiVal = !flag
        }), valiVal
    }

    function getHeroInfo() {
        var name = $("#heroName").val(),
            power = $("#heroPower").val(),
            status = $("#heroStatus").val(),
            heroInfo = {
                name: name,
                power: power,
                status: status
            };
        return heroInfo
    }
    var $ = require("common/jquery-debug"),
        Validator = require("common/validator-debug"),
        Paginator = require("model/paginator/main-debug"),
        SearchList = require("model/searchList/main-debug"),
        heroSearchList = (new Paginator({
            element: "#paginator"
        }), new SearchList({
            element: "#searchList"
        })),
        addUrl = "test1Rpc/add.json",
        validatorExp = new Validator({
            element: "#hero-form",
            failSilently: !0
        });
    validatorExp.addItem({
        element: "[id=heroName]",
        required: !0
    }).addItem({
        element: "[id=heroPower]",
        required: !0
    }).addItem({
        element: "[id=heroStatus]",
        required: !0
    }), $("#addHeroBtn").click(function() {
        $.ajax({
            url: addUrl,
            data: {
                LassenSwardmanDo: JSON.stringify(getHeroInfo())
            },
            beforeSend: function(xhr) {
                return formValidation()
            },
            success: function(msg) {
                $("#heroModal").modal("hide"), heroSearchList.searchListReload()
            },
            error: function(msg) {
                alert(msg)
            }
        })
    }), $("#modal_add").click(function() {
        $("#heroName").val(""), $("#heroPower").val(""), $("#heroStatus").val(""), validatorExp.clearError(), $("#heroModal").modal("show")
    }), $("#searchBtn").click(function() {
        heroSearchList.searchListReload()
    })
});
"use strict";
define("common/jquery-debug", [], function(require, exports) {
    return jQuery
});