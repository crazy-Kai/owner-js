define("src/hephaistos/js/extensions/treegrid-min-debug", ["bui/common-debug", "bui/grid-debug", "bui/tree-debug"], function(e) {
    "use strict";
    var t = e("bui/tree-debug"),
        n = e("bui/grid-debug"),
        r = n.Grid.extend([t.Mixin], {}, {
            ATTRS: {
                iconContainer: {
                    value: ".bui-grid-cell-inner"
                }
            }
        }, {
            xclass: "tree-grid"
        });
    return r
});