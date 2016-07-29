'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(function (require, exports, module) {
  //es6定义类的方法

  var Point = function () {
    //这里的constructor 相当与ES5的构造函数

    function Point(x, y) {
      _classCallCheck(this, Point);

      // this.x = x;
      // this.y = y;
      Object.assign(this, { x: x, y: y });
    }

    _createClass(Point, [{
      key: 'toString',
      value: function toString() {
        return '(' + this.x + ',' + this.y + ')';
      }
    }]);

    return Point;
  }();
  //类的数据类型就是函数！而类本身指向构造函数！

  //es5 定义构造数方法


  function Points(x, y) {
    this.x = x;
    this.y = y;
  };
  Point.prototype.toString = function () {
    return '(' + this.x + ',' + this.y + ')';
  };

  var view = function view() {
    _classCallCheck(this, view);
  };

  var v = new view();
  v.constructor === view.prototype.constructor; // true 因为实例化的对象的constructor 方法就等于 view 类原型的constructor方法
  var head = 1;
  var tail = [2, 3, 4];
});