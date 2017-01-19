"use strict";
define("src/model/cascadeSelect/main-debug", ["common/myWidget-debug", "model/ajax/main-debug", "common/handlerbars-debug"], function(require, exports, module) {
    function getOptionHandler(id, name, defaultValue) {
        var options = Handlerbars.compile(['<option value=""></option>', "{{#each this}}", "<option value={{", id ? id : "id", "}}", generateSelected(id ? id : "id", defaultValue), ">", "{{", name ? name : "name", "}}", "</option>", "{{/each}}"].join(""));
        return options
    }

    function generateSelected(id, defaultValue) {
        return defaultValue ? isNaN(defaultValue) ? ["{{#isEqual ", id, ' "', defaultValue, '"}} selected {{/isEqual}}'].join("") : ["{{#isEqual ", id, " ", defaultValue, "}} selected {{/isEqual}}"].join("") : ""
    }

    function generateSelector(name) {
        return ["select[name='", name, "']"].join("")
    }
    var MyWidget = require("common/myWidget-debug"),
        Handlerbars = (require("model/ajax/main-debug"), require("common/handlerbars-debug")),
        CascadeSelect = MyWidget.extend({
            clssName: "CascadeSelect",
            attrs: {
                element: ".cascadeSelect",
                deptUserJson: null,
                needInit: !1
            },
            events: {
                "change select[data-child]": function(e) {
                    e.preventDefault();
                    var me = this,
                        target = me.jQuery(e.target),
                        child = target.data("child"),
                        parent = target.data("parent"),
                        currentChild = child,
                        childList = currentChild.split(" ");
                    if (target.val()) {
                        var regions = new Array;
                        for (regions.push({
                                name: target.prop("name"),
                                value: target.val()
                            }); parent;) {
                            var parentNode = me.jQuery("select[name='" + parent + "']");
                            parentNode.val() && regions.push({
                                name: parent,
                                value: parentNode.val()
                            }), parent = parentNode.data("parent")
                        }
                        for (var i in childList) {
                            for (var aChild = childList[i], currentRegion = regions.concat(), code = currentRegion.pop(), list = me.get("deptUserJson"); code;) {
                                var current = me.jQuery("select[name='" + code.name + "']"),
                                    id = current.data("id"),
                                    cld = current.data("child"),
                                    cldList = cld ? cld.split(" ") : "",
                                    ChildJson = cldList.length > 1 ? aChild : cld,
                                    ChildJsonListName = me.jQuery(generateSelector(ChildJson)).data("listName");
                                ChildJson = ChildJsonListName ? ChildJsonListName : ChildJson, $.each(list, function(i, item) {
                                    item[id] == code.value && (list = item[ChildJson])
                                }), code = currentRegion.pop()
                            }
                            var childT = me.jQuery(generateSelector(aChild)),
                                id = childT.data("id");
                            childT.html(getOptionHandler(id, "", me.get("isInit") ? childT.data("defaultValue") : "")(list))
                        }
                    } else
                        for (var i in childList) {
                            var aChild = childList[i];
                            me.jQuery("select[name='" + aChild + "']").html('<option value=""></option>')
                        }
                    for (child = me.jQuery("select[name='" + currentChild + "']").data("child"); child;) {
                        var childList = child.split(" "),
                            childNode = me.jQuery("select[name='" + child + "']");
                        childNode && (childNode.val(), childNode.html('<option value=""></option>')), child = childNode.data("child")
                    }
                }
            },
            setup: function() {
                var me = this;
                if (me.get("needInit")) {
                    me.set("isInit", !0);
                    var firstSelect = me.element.find("select").eq(0);
                    firstSelect.html(getOptionHandler(firstSelect.data("id"), "", firstSelect.data("defaultValue"))(me.get("deptUserJson"))), me.element.find("select").trigger("change"), me.set("isInit", !1)
                }
            }
        });
    return CascadeSelect
});
define("common/handlerbars-debug", [], function(require, exports, module) {});