"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
  //object.assign方法
  var target = { a: 1 };
  var source1 = { a: 2, b: 1, c: 4 };
  var source2 = { b: 3 };
  console.log(Object.assign(target, source1, source2));
  //此方法是将source源对象的所有可枚举的属性复制到目标对象（target）,
  //要注意的是如果源对象中的属性和目标对象有重复的属性，或者多个源对象中有重复的属性，
  //那么后面的对象属性会覆盖前面的属性，当然属性值也会被修改！
  console.log(Object.assign(2)); //object;Number {[[PrimitiveValue]]: 2};primitiveValue原始值
  //如果第一个参数不是对象则此方法会先将参数转换成object
  // console.log(Object.assign(null));//报错
  // console.log(Object.assign(undefined));//报错
  //undefined 和 null 无法转换为 object 所以会报错
  var object = { a: 1 };
  console.log(Object.assign(object, null));
  console.log(Object.assign(object, undefined));
  //如果非对象参数不再目标对象，而在源对象的位置，则不会报错，则返回目标对象！
  var v1 = "abc";
  var v2 = false;
  var v3 = 12;
  var result = Object.assign({}, v1, v2, v3);
  console.log(result);
  //如果非对象参数不是首参（不在目标对象），而是在源对象位置，则只有字符串类型的参数会以数组形式覆盖到目标对象！
  var obj = {};
  //添加属性到指定的对象中或者改变现有属性的特性！
  Object.defineProperty(obj, "name", {
    value: "2",
    writable: true, //只读特性，值为fasle，表示只读不能再做任何修改！
    enumerable: false, //是否是可枚举的属性，true是可枚举，mfasle是不可枚举！
    configurable: true //总开关，如果设为fasle那么久再也不能对此属性进行任何操作！如下如果为fasle则无法删除该属性！
  });
  //delete obj.name
  console.log(obj.name);
  console.log(Object.assign({}, obj)); //如果源对象的属性是不可扩展的则无法覆盖到目标对象上！
  console.log(Object.assign([0, 1, 2], [4, 5, 6])); //这里把源对象的数组转换为了属性分别是0，1，3的对象然后进行属性属该目标对象的操作！
  //常见用途
  //1:为对象添加属性！

  var Options = function Options(x, y) {
    _classCallCheck(this, Options);

    Object.assign(this, { x: x, y: y });
  };
  //将x,y的属性添加到option这个类的实例，相当于this.x=x;this.y=y！
  //2：为对象添加方法！


  var SomeClasee = function SomeClasee(x, y) {
    _classCallCheck(this, SomeClasee);

    Object.assign(this, { x: x, y: y });
  };

  ;

  Object.assign(SomeClasee.prototype, {
    someMethod: function someMethod(arg1, arg2) {
      return arg1;
    },
    another: function another(arg3, arg4) {
      return arg3;
    }
  });
  //用对象的getPrototypeOf()方法获取对象的原型，赋值给一个变量并修改原型的属性,Object.setPrototypeOf()设置对象的原型

  var Pasta = function Pasta(grain, width) {
    _classCallCheck(this, Pasta);

    this.grain = grain;
    this.width = width;
  };

  var spaghetti = new Pasta("wheat", 0.2);
  var proto = Object.getPrototypeOf(spaghetti);
  proto.foodgroup = "carbohydrates";
  console.log(spaghetti.foodgroup, Object.keys(spaghetti)); //Object.keys()方法遍历某个对象的所有可枚举的属性或方法
  //Object.values()方法只适用于火狐浏览器
  //    var objects = { 0: 'a', 1: 'b', 2: 'c' };
  // window.alert(Object.values(objects));

  // Object.is方法 判断两个值是否相同！相当于 a1 === a2!返回boolean值 true or false
  var a1 = "1";
  var a2 = 1;
  console.log(Object.is(a1, a2));
  //Object.entries()方法只适合用于火狐浏览器
  // var an_obj = { 100: 'a', 2: 'b', 7: 'c' }
  // console.log(Object.entries(an_obj))
  //Object.creat()方法：继承某个对象的原型，并可以增加属性，和修改现有属性的特性！
  function Item(x, y) {
    this.name = x;
    this.old = this.name + y;
  };
  Item.prototype.toString = function () {
    console.log("888888888");
  };
  var item = new Item("wukai", "27");
  var items = {};
  items = Object.create(item, {
    test1: {
      value: "w",
      enumerable: true,
      writable: true,
      configurable: true
    },
    test2: {
      configurable: false, //无法删除和修改
      get: function get() {
        return test2;
      },
      set: function set(value) {
        test2 = value;
      }
    }
  });
  items.toString(); //这里Object items 继承了对象item的原型！所以也有了item 的a的方法！
  console.log(Object.prototype.toString.call(items), Object.keys(items), items.old);
  //这里的Object.keys方法只能列举可枚举的并且是私有的不是原型连继承过来的属性和方法！
});