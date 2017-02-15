/**
 *
 *
 *
 * 2017-02-08
 */

//测试数据类型工厂
var testType=function(type){
	type=type.toLowerCase(type).replace(/^\w/,function(str){
		return str.toUpperCase();
	});
	var fn=function(arg){
		return Object.prototype.toString.call(arg) == "[object "+type+"]";
	};
	return fn;
};
//测试css3属性是否支持
exports.testCss3Attr=(function(){
	var cc_div=document.createElement("div"),
		vendors = 'ms Khtml O Moz Webkit'.split(' '),
		len=vendors.length;
	return function(prop){
		var cc_status=0;
		if(prop in cc_div.style){
			cc_status=1;
			return cc_status;
		}
		for (var i = 0; i < len; i++) {
			if("-"+vendors[i]+"-"+prop in cc_div.style){
				cc_status=1;
				break;
			}
		}
		return cc_status;
	};
})();
exports.isObject=testType("Object");

exports.isArray=testType("Array");

exports.isFunction=testType("Function");


exports.objAssign=function(obj1,obj2){
	var init_obj=function(arg){
		if(!arg || !exports.isObject(arg)){
			return {};
		}else{
			return arg;
		}
	};

	obj1=init_obj(obj1);
	obj2=init_obj(obj2);

	for(k in obj2){
		if(exports.isObject(obj2[k])){
			obj1[k]=exports.objAssign({},obj2[k]);
		}else{
			obj1[k]=obj2[k];
		}
	}
	return obj1;
};

exports.imgPrevLoad=function(src,opt){
	var cc_img=new Image();
	if(!src){
		console.log("src 不存在");
		return false;
	}
	cc_img.src=src;

	opt &&　opt.before && opt.before.call && opt.before.call();

	cc_img.onload=function(){
		opt && opt.callback && opt.callback.call && opt.callback.call(cc_img);
	};

	cc_img.onerror=function(){
		opt && opt.error && opt.error.call && opt.error.call();
	};
};
