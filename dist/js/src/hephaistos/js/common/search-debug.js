define("src/hephaistos/js/common/search-debug", ["bui/common-debug", "bui/grid-debug", "bui/form-debug", "bui/data-debug", "bui/overlay-debug"], function(require) {
    function Search(config) {
        Search.superclass.constructor.call(this, config), this._init()
    }
    var BUI = require("bui/common-debug"),
        Grid = require("bui/grid-debug"),
        Data = require("bui/data-debug"),
        Form = (require("bui/overlay-debug"), require("bui/form-debug"));
    return Search.ATTRS = {
        autoSearch: {
            value: !0
        },
        gridId: {
            value: "grid"
        },
        formId: {
            value: "searchForm"
        },
        btnId: {
            value: "btnSearch"
        },
        formCfg: {
            value: {}
        },
        gridCfg: {},
        form: {},
        grid: {},
        store: {}
    }, BUI.extend(Search, BUI.Base), BUI.augment(Search, {
        _init: function() {
            var _self = this;
            _self._initForm(), _self._initStoreEvent(), _self._initGrid(), _self._initEvent(), _self._initData()
        },
        _initEvent: function() {
            this._initDomEvent(), this._initFormEvent(), this._initGridEvent()
        },
        _initDomEvent: function() {
            var _self = this,
                btnId = _self.get("btnId"),
                form = (_self.get("store"), _self.get("form"));
            $("#" + btnId).on("click", function(ev) {
                ev.preventDefault(), form.valid(), form.isValid() && _self.load(!0)
            })
        },
        _initForm: function() {
            var _self = this,
                form = _self.get("form");
            if (!form) {
                var formCfg = BUI.merge(_self.get("formCfg"), {
                    srcNode: "#" + _self.get("formId")
                });
                form = new Form.HForm(formCfg), form.render(), _self.set("form", form)
            }
        },
        _initFormEvent: function() {},
        _initGrid: function() {
            var _self = this,
                grid = _self.get("grid");
            if (!grid) {
                var gridCfg = _self.get("gridCfg"),
                    store = _self.get("store");
                gridCfg.store = store, gridCfg.render = "#" + _self.get("gridId"), grid = new Grid.Grid(gridCfg), grid.render(), _self.set("grid", grid)
            }
        },
        _initGridEvent: function() {},
        _initData: function() {
            var _self = this,
                autoSearch = _self.get("autoSearch");
            autoSearch && _self.load(!0)
        },
        _initStoreEvent: function() {
            var _self = this,
                store = _self.get("store");
            store.on("exception", function(ev) {
                BUI.Message.Alert(ev.error)
            })
        },
        load: function(reset) {
            var _self = this,
                form = _self.get("form"),
                store = _self.get("store"),
                param = form.serializeToObject();
            reset && (param.start = 0, param.pageIndex = 0), store.load(param)
        }
    }), Search.createStore = function(url, cfg) {
        return cfg = BUI.merge({
            autoLoad: !1,
            url: url,
            pageSize: 30
        }, cfg), new Data.Store(cfg)
    }, Search.createGridCfg = function(columns, cfg) {
        return cfg = BUI.merge({
            columns: columns,
            loadMask: !0,
            bbar: {
                pagingBar: !0
            }
        }, cfg)
    }, Search.createLink = function(cfg) {
        var temp = '<span class="page-action grid-command" data-id="{id}" data-href="{href}" title="{title}">{text}</span>';
        return BUI.substitute(temp, cfg)
    }, Search
});