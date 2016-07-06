define(function(require,exports,module){
//es6定义类的方法
  class Point {
  	//这里的constructor 相当与ES5的构造函数
  	constructor(x,y){
  		// this.x = x;
  		// this.y = y;
  		Object.assign(this,{x,y})
  	}
  	toString(){
  		return '('+this.x+','+this.y+')';
  	}
  }
  //类的数据类型就是函数！而类本身指向构造函数！

//es5 定义构造数方法
 function Points(x,y){
 	this.x = x;
 	this.y = y;
 };
 Point.prototype.toString = function(){
 	return '('+this.x+','+this.y+')';
 }
class view {}
 let v = new view();
 v.constructor === view.prototype.constructor // true 因为实例化的对象的constructor 方法就等于 view 类原型的constructor方法
 let [head, ...tail] = [1, 2, 3, 4];


})