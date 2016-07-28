define(function(require,exports,module){
	
	//依赖
	var Reflux = require('reflux');

	 //创建Actions   
  var TableActions = Reflux.createActions(['getInit','deleteName','addName','editName']);
  //创建Store
  var TableStore = Reflux.createStore({
        listenables:[TableActions],
        store : {
            data:[{name:"wuxiaowen"},{name:"wukai"},{name:"一丙"},{name:"保健"}],
            key:""
        },
        init:function(){
            this.onGetInit();
        },
        onGetInit:function(){
            var me = this;
            window.setTimeout(function(){

                me.trigger(me.store)
            },0)
        },
        onDeleteName:function(event){
            var self = this,
                //react版本问题，这里不能用e.target否则找不到，只能用event.persist()方法来获取e.target
                target = $(event.target),
                index = target.data("index");
                self.store.data.splice(index-1,1)
                self.trigger(self.store);
        },
        onEditName:function(event,myInput){
            var self = this,
                index = $(event.target).data("index"),
                key = index -1,
                value = self.store.data[key].name,
                input = myInput;
                input.value = value;
                self.store.key = key;
                input.nextSibling.textContent = "保存";
                input.focus();
                self.trigger(self.store);
        },
        onAddName:function(event,myInput){
            var self = this,
                input = myInput,
                keys = self.store.key,
                targetName = $(event.target).text();
                console.log(targetName)
                if(targetName === "保存"){
                    self.store.data[keys].name = input.value;
                    input.value = "";
                    $(event.target).text("增加")
                }else if(targetName === "增加"){
                    self.store.data.push({name:input.value});
                    input = "";
                    self.trigger(self.store);
                }


              

        }
        
  })
  
   module.exports =  {Actions:TableActions,Store:TableStore,Reflux:Reflux}
})