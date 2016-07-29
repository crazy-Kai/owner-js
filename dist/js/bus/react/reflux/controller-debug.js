define("js/bus/react/reflux/controller-debug", ["reflux-debug"], function(require, exports, module) {
    var Reflux = require("reflux-debug"),
        TableActions = Reflux.createActions(["deleteName", "addName", "editName"]),
        TableStore = Reflux.createStore({
            listenables: [TableActions],
            getInitialState: function() {
                return this.store
            },
            store: {
                data: [{
                    name: "wuxiaowen"
                }, {
                    name: "wukai"
                }, {
                    name: "一丙"
                }, {
                    name: "保健"
                }],
                key: ""
            },
            onDeleteName: function(event) {
                var self = this,
                    target = $(event.target),
                    index = target.data("index");
                self.store.data.splice(index - 1, 1), self.trigger(self.store)
            },
            onEditName: function(event, myInput) {
                var self = this,
                    index = $(event.target).data("index"),
                    key = index - 1,
                    value = self.store.data[key].name,
                    input = myInput;
                input.value = value, self.store.key = key, input.nextSibling.textContent = "保存", input.focus(), self.trigger(self.store)
            },
            onAddName: function(event, myInput) {
                var self = this,
                    input = myInput,
                    keys = self.store.key,
                    targetName = $(event.target).text();
                "保存" === targetName ? (self.store.data[keys].name = input.value, input.value = "", $(event.target).text("增加")) : "增加" === targetName && (self.store.data.push({
                    name: input.value
                }), input = "", self.trigger(self.store))
            }
        });
    module.exports = {
        Actions: TableActions,
        Store: TableStore,
        Reflux: Reflux
    }
});