/**
 * Created by Bosco on 2015/5/14.
 */

var C = require("common");

exports.Q = function () {
    var ret = {};
    ret.queue = [];
    ret.isqueue = true;
    var addqueue = function (key) {

        ret[key] = function () {
            var _arguments = arguments;
            ret.queue.push(function () {

                exports[key].apply(ret, _arguments)
            });
            return ret;
        }
    }
    addqueue("Translate");
    addqueue("Rotate");
    addqueue("Scale");
    ret.next = function () {
        var queue = ret.queue;
        if (queue.length > 0) {
            var _next = queue.splice(0, 1)[0];

            if (C.isFunction(_next)) {
                _next.call();
            }
        }
    }
    return ret;
}

exports.Rotate = function (o, t, deg, callback, opt) {
    if (!this.isqueue) {
        var ret = exports.Q();
    }
    else {
        ret = this;
    }
    if (!o || !o.css) {
        return ret;
    }
    t = parseFloat(t);
    if (isNaN(t))t = 0;
    var baset = t;
    opt = opt || {};
    //t = (t / 1000) + "s";

    deg = parseFloat(deg);

    if (isNaN(deg)) {
        return ret;
    }

    opt.duration = baset;
    if (baset != 0) {
        exports.Transition(o, opt);
    }


    if (opt["goon"]) {
        var _deg = o.data("rotate") || 0;
        deg = deg + _deg;
    }
    o.data("rotate", deg);
    deg = deg + "deg";

    var str=" rotate(" + deg + ")";
    if(!opt.clear){
        str=gettransform(o,"rotate",str);
    }

    o.css({
        "transform": str,
        "-webkit-transform": str,
        "-moz-transform": str
    });



    setTimeout(function () {
        callback && callback.call && callback.call();
        ret.next();
    }, baset);

    return ret;
};


exports.Scale = function (o, t, dx, dy, callback, opt) {
    if (!this.isqueue) {
        var ret = exports.Q();
    }
    else {
        ret = this;
    }
    if (!o || !o.css) {
        return ret;
    }
    t = parseFloat(t);
    if (isNaN(t))t = 0;
    var baset = t;
    opt = opt || {};
    //t = (t / 1000) + "s";


    dx = parseFloat(dx);
    dy = parseFloat(dy);

    if (isNaN(dx) && isNaN(dy)){
        return ret;
    }

    opt.duration = baset;
    if (baset != 0) {
        exports.Transition(o, opt);
    }

    var distance=false;
    if(!isNaN(dx) && !isNaN(dy)){
        distance=dx+","+dy
    }
    else if(!isNaN(dx)){
        distance=dx;
    }
    else{
        distance="1,"+dy;
    }

    var str=" scale(" + distance + ")";
    if(!opt.clear){
        str=gettransform(o,"scale",str);
    }

    o.css({
        "transform": str,
        "-webkit-transform": str,
        "-moz-transform": str
    });

    if(opt.css){
        o.css(opt.css);
    }

    o.data("scale_x", dx);
    o.data("scale_y", dy);


    setTimeout(function () {
        callback && callback.call && callback.call();
        ret.next();
    }, baset);

    return ret;
};

/**
 * 2D位移
 * @param o 位移对象
 * @param t 位移时间（毫秒）
 * @param dx 位移X
 * @param dy 位移Y
 * @param callback 返回函数
 * @param opt 选项[TRANSITION]
 * @returns {*}
 * @constructor
 */
exports.Translate = function (o, t, dx, dy, callback, opt) {
    if (!this.isqueue) {
        var ret = exports.Q();
    }
    else {
        ret = this;
    }
    if (!o || !o.css) {
        return ret;
    }
    t = parseFloat(t);
    if (isNaN(t))t = 0;
    var baset = t;
    opt = opt || {};
    //t = (t / 1000) + "s";

    dx = getpx(dx);
    dy = getpx(dy);
    var distance = false;
    if (dx && dy) {
        distance = dx + "," + dy;
    }
    else if (dx) {
        distance = dx;
    }
    else if (dy) {
        distance = "0px," + dy;
    }

    opt.duration = baset;
    if (baset != 0) {
        exports.Transition(o, opt);
    }

    if (distance) {
        var str=" translate(" + distance + ")";
        if(opt.threed){
            str=" translate3d(" + distance + ",0)";
        }
        if(!opt.clear){
            str=gettransform(o,"translate",str);
        }
        o.css({
            "transform": str,
            "-webkit-transform": str,
            "-moz-transform": str
        });
        if(opt.css){
            o.css(opt.css);
        }
        if (dx && dx.indexOf("%") > -1) {
            dx = parseInt(dx) / 100 * o.width();
            console.log(dx);
        }
        else {
            dx = parseInt(dx);
        }
        if (dy && dy.indexOf("%") > -1) {
            dy = parseInt(dy) / 100 * o.height();
        }
        else {
            dy = parseInt(dy);
        }
        dx = isNaN(dx) ? 0 : dx;
        dy = isNaN(dy) ? 0 : dy;
        o.data("translate_x", dx);
        o.data("translate_y", dy);
    }


    setTimeout(function () {
        callback && callback.call && callback.call();
        ret.next();
    }, baset);

    return ret;
};

exports.Clear=function(o){
    o.css({
        "transform": "none",
        "-webkit-transform": "none",
        "-moz-transform": "none"
    });
    exports.Transition(o,0);
};

exports.Transition = function (o, opt, callback) {
    if (!isNaN(opt)) {
        var __t = opt;
        opt = {};
        opt.duration = __t;

    }
    if(opt==0){

    }
    opt = opt || {};
    setTimeout(function () {
        C.isFunction(callback) && callback();
    }, opt.duration)

    var t = (parseInt(opt.duration) / 1000) + "s";
    var delay = opt["delay"] ? ((parseInt(opt["delay"]) / 1000) + "s") : false;
    var _str = "";
    if (opt["property"]) {
        _str += opt["property"]
    }
    else {
        _str += "all"
    }
    _str += " " + t;
    if (opt["timing-function"]) {
        _str += " " + opt["timing-function"];
    }
    else {
        _str += " linear";
    }
    if (delay) {
        _str += " " + delay;
    }
    o.css({
        "transition": _str,
        "-webkit-transition": _str,
        "-moztransition": _str
    });
}



var getpx = function (x) {
    x = (typeof x == "number" ? x + "px" : x);

    return x;
}

var gettransform=function(obj,type,str){
    var ret="";
    var _rotate=obj.data("rotate")||"";
    _rotate=_rotate?_rotate+"deg":"";
    var _scale_x=obj.data("scale_x");
    var _scale_y=obj.data("scale_y");
    var _translate_x=obj.data("translate_x");
    var _translate_y=obj.data("translate_y");
    var _translate=false;
    if(_translate_x && _translate_y){
        _translate=_translate_x+"px,"+_translate_y+"px";
    }
    else if(_translate_x){
        _translate=_translate_x+"px";
    }
    else if(_translate_y){
        _translate="0px,"+_translate_y+"px";
    }
    var _scale=false;
    if(_scale_x && _scale_y){
        _scale=_scale_x+","+_scale_y;
    }
    else if(_scale_x){
        _scale=_scale_x;
    }
    else if(_scale_y){
        _scale="1,"+_scale_y;
    }
    switch (type){
        case "scale":
            ret+=(_translate?"translate("+_translate+") ":" ");
            //ret+=(_scale?"scale("+_scale+") ":" ");
            if(str)ret+=str+" ";
            ret+=(_rotate?"rotate("+_rotate+") ":" ");
            break;
        case "rotate":
            ret+=(_translate?"translate("+_translate+") ":" ");
            ret+=(_scale?"scale("+_scale+") ":" ");
            if(str)ret+=str+" ";
            break;
        case "translate":
            if(str)ret+=str+" ";
            ret+=(_scale?"scale("+_scale+") ":" ");
            ret+=(_rotate?"rotate("+_rotate+") ":" ");
            break;
    }
    return ret;
}