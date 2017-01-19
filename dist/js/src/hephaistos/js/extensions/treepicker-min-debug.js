define("src/hephaistos/js/extensions/treepicker-min-debug", ["bui/common-debug", "bui/picker-debug", "bui/tree-debug"], function(e) {
    "use strict";
    var t = e("bui/common-debug"),
        n = e("bui/picker-debug").ListPicker,
        i = (e("bui/tree-debug"), n.extend({
            setSelectedValue: function(e) {
                e = e || "";
                var r = this,
                    i = r.get("tree");
                if ("selected" === r.get("selectStatus")) e && i.expandNode(e), n.prototype.setSelectedValue.call(r, e);
                else {
                    i.clearAllChecked();
                    var s = e.split(",");
                    t.each(s, function(e) {
                        i.setChecked(e)
                    })
                }
            },
            getSelectedValue: function() {
                var e = this,
                    r = e.get("tree");
                if ("selected" === e.get("selectStatus")) return n.prototype.getSelectedValue.call(e);
                var i = r.getCheckedNodes();
                return i = e._getFilterNodes(i), t.Array.map(i, function(e) {
                    return e.id
                }).join(",")
            },
            getSelectedText: function() {
                var e = this,
                    r = e.get("tree");
                if ("selected" === e.get("selectStatus")) return n.prototype.getSelectedText.call(e);
                var i = r.getCheckedNodes();
                return i = e._getFilterNodes(i), t.Array.map(i, function(e) {
                    return e.text
                }).join(",")
            },
            _getFilterNodes: function(e) {
                var n = this,
                    r = n.get("filter");
                return r && (e = t.Array.filter(e, r)), e
            }
        }, {
            ATTRS: {
                defaultChildClass: {
                    value: "tree-list"
                },
                selectStatus: {
                    value: "selected"
                },
                changeEvent: {
                    getter: function() {
                        return this.get("selectStatus") + "change"
                    }
                },
                hideEvent: {
                    getter: function(e) {
                        return "checked" === this.get("selectStatus") ? null : e
                    }
                },
                filter: {},
                tree: {
                    getter: function() {
                        return this.get("children")[0]
                    }
                }
            }
        }, {
            xclass: "tree-picker"
        }));
    return i
});