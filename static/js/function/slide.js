/*
bug:
1.需要检查 maincell 跟  titlecell 的 size 是否对应的上
*/

var css3swf=require("css3swf");
var $=require("$");
var C=require("C");

/**
 * [randomstr 生成随机字符串]
 * @param  {[type]} len [description]
 * @return {[type]}     [description]
 */
var randomstr=function(len){
	var cc_str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		cc_randomstr="",
		cc_str_len=cc_str.length;

	len=len || 6;
	for(var i=0;i<len;i++){
		cc_randomstr+=cc_str.charAt(Math.floor(Math.random()*cc_str_len));
	}
	return cc_randomstr;
};

var slide=function(opt){
	this.opt=opt;
	this.last=0;
	this.index=0;

	this.init();
};
slide.prototype={
	//初始化状态记录
	status:[],
	//初始化
	init:function(){
		var _this=this;
		_this.getOpt();
		_this.initDom();
		_this.bindEvent();

	},
	//初始化 dom
	initDom:function(){
		var _this=this;

		_this.$_wrap=$(_this.opt.wrap);
		_this.$_mainCell=_this.$_wrap.find(_this.opt.mainCell);
		_this.$_titleCell=_this.$_wrap.find(_this.opt.titleCell);
		_this.$_prev=_this.$_wrap.find(_this.opt.prev);
		_this.$_next=_this.$_wrap.find(_this.opt.next);



		//这里 对内容 以及 指定按钮 绑定对于的 index，考虑到之后加上循环的时候需要 对内容进行clone
		_this.$_mainCell.each(function(index,item){
			var $_item=$(item);
			$_item.attr(_this.opt.prefix.main,index);
		});
		_this.$_titleCell.each(function(index,item){
			var $_item=$(item);
			$_item.attr(_this.opt.prefix.title,index);
		});
		//初始前
		_this.opt && _this.opt.init_before && _this.opt.init_before.call && _this.opt.init_before.call(_this);
		//初始化
		_this.swf[_this.opt.effect].init.call(_this);
		//初始后
		if(_this.index==0 && !_this.opt.loop && _this.$_prev.size){
			_this.$_prev.css({display:"none"});
		}
		_this.opt &&　_this.opt.init_after &&　_this.opt.init_after.call && _this.opt.init_after.call(_this);
	},
	//对于 1 屏显示多个的情况  进行 宽度计算
	competer_visit:function(){
		var _this=this,
			cc_width=0;
		if(_this.opt.visit>1){
			cc_width=(_this.$_s_wrap_main.parent().width())/_this.opt.visit-(_this.$_s_wrap_main.outerWidth(true)-_this.$_s_wrap_main.width());
			_this.$_mainCell.css({
				width:cc_width+'px'
			});
		}
	},
	//初始化 配置
	getOpt:function(){
		var _this=this;
		var default_obj={
			wrap:'.slide',
			mainCell:'.bd li',
			titleCell:'.hd li',
			title_class:'on',
			effect:'left',
			time:500,
			prev:'',
			next:'',
			differ:1,
			visit:1,
			has_loop:false,
			no_maopao:false,
			prefix:{
				title:"title_index"+randomstr(),
				main:"main_index"+randomstr()
			},
			has_touch:false,
			touch_obj:{
				sen:60,
				fn_list:{
					touch_left:function(){
						_this.$_wrap.trigger("event_slide_next");
					},
					touch_right:function(){
						_this.$_wrap.trigger("event_slide_prev");

					}
				}
			},
			init_bafore:function(){},
			init_after:function(){},
			custom_event:{},
			custom_swf:{}
		};
		if(_this.opt && _this.opt.time && isNaN(parseInt(_this.opt.time))){
			_this.opt.time=500;
		}
		_this.opt=C.objAssign(default_obj,_this.opt);
		//每次移动的 item 数不能超过 可视个数
		if(_this.opt.differ > _this.opt.visit){
			_this.opt.differ = _this.opt.visit;
		}

	},
	//轮播图效果切换
	show:function(){
		var _this=this;
		if(_this.opt.custom_swf && C.isFunction(_this.opt.custom_swf["init"]) && _this.opt.custom_swf["show"]){
			_this.opt.custom_swf.show.apply(this,arguments);
		}
		else if(_this.opt.visit>1){
			_this.swf["left"] && _this.swf["left"].show &&_this.swf["left"].show.apply(_this,arguments);
		}
		else{
			_this.swf[_this.opt.effect] && _this.swf[_this.opt.effect].show &&_this.swf[_this.opt.effect].show.apply(_this,arguments);
		}
		_this.opt.show_before && _this.opt.show_before.call(_this);

		//console.log("_this.last:",_this.last,"_this.index:",_this.index);
	},
	//添加自定义事件
	addCustomEvent:function(){
		var _this=this;
		if(_this.opt.custom_event && C.isObject(_this.opt.custom_event)){
			for(var k in _this.opt.custom_event){
				if(C.isObject(_this.opt.custom_event[k])){
					for(var kk in _this.opt.custom_event[k]){
						_this.opt.custom_event[k][kk].call &&_this.$_wrap.on(kk,k,_this.opt.custom_event[k][kk].bind(_this));
					}
				}
			}
		}
	},
	//绑定事件
	bindEvent:function(){ //只定义基本 事件
		var _this=this;
		_this.opt.no_maopao && _this.$_wrap.bind({
			"touchstart":function(e){
				e.stopPropagation();
			},
			"touchmove":function(e){
				e.stopPropagation();
			}
		});
		//上一个
		_this.$_wrap.on("event_slide_prev",function(e){
			e.stopPropagation();
			if(_this.$_wrap.data('is_lock') || _this.$_mainCell.size()==1) return false;

			_this.last=_this.index;

			if(_this.index==0){
				if(!_this.opt.has_loop) return false;
				_this.index=_this.$_mainCell.size()-_this.opt.visit;
			}else{
				if(_this.index-_this.opt.differ<0){
					_this.index=0;
				}else{
					_this.index-=_this.opt.differ;
				}
			}

			if(!_this.opt.has_loop){
				if(_this.index==0){
					_this.$_prev.size && _this.$_prev.css({display:"none"});
				}
				if(_this.index+_this.opt.visit<_this.$_mainCell.size()){
					_this.$_next.size && _this.$_next.css({display:"block"});
				}
			}


			_this.show(_this.$_wrap.find("["+_this.opt.prefix.main+"="+_this.index+"]"));
			_this.$_wrap.data("is_lock",true);
		});
		//下一个
		_this.$_wrap.on("event_slide_next",function(e){
			e.stopPropagation();
			if(_this.$_wrap.data('is_lock') || _this.$_mainCell.size()==1) return false;

			_this.last=_this.index;
			if(_this.index>=_this.$_mainCell.size()-_this.opt.visit){
				if(!_this.opt.has_loop) return false;
				_this.index=0;
			}else{
				if(_this.index+_this.opt.differ>_this.$_mainCell.size()-_this.opt.differ){
					_this.index=_this.$_mainCell.size()-_this.opt.differ;
				}else{
					_this.index+=_this.opt.differ;
				}
			}
			if(!_this.opt.has_loop){
				if(_this.index==_this.$_mainCell.size()-_this.opt.visit){
					_this.$_next.size && _this.$_next.css({display:"none"});
				}
				if(_this.index>0){
					_this.$_prev.size && _this.$_prev.css({display:"block"});
				}
			}

			_this.show(_this.$_wrap.find("["+_this.opt.prefix.main+"="+_this.index+"]"));
			_this.$_wrap.data("is_lock",true);
		});

		_this.opt.prev && _this.$_wrap.on("click",_this.opt.prev,function(){
			_this.$_wrap.trigger("event_slide_prev");
		});

		_this.opt.next && _this.$_wrap.on("click",_this.opt.next,function(){
			_this.$_wrap.trigger("event_slide_next");
		});

		//索引点击触发
		_this.opt.titleCell && _this.$_wrap.on("click",_this.opt.titleCell,function(e){
			var $_this=$(e.currentTarget);
			_this.last=_this.index;
			_this.index=$_this.attr(_this.opt.prefix.title);

			if(_this.index > _this.$_mainCell.size()-1 || $_this.hasClass(_this.opt.title_class)) return false;
			_this.show(_this.$_wrap.find("["+_this.opt.prefix.main+"="+_this.index+"]"));
			_this.$_wrap.data("is_lock",true);

		});
		//添加自定义事件
		_this.addCustomEvent();

		//添加滑动监听
		_this.opt.has_touch && _this.drag_init();


	},
	//获取 整体的宽，高
	get_cell_info:function(ele){
		var cc_obj={count_w:0,max_h:0,max_w:0};
		$(ele).each(function(index,item){
			var $_item=$(item);
			cc_obj.count_w+=$_item.outerWidth(true);
			if(cc_obj.max_h<$_item.height()){
				cc_obj.max_h=$_item.height();
				cc_obj.max_outer_h=$_item.outerHeight(true);
			}
			if(cc_obj.max_w<$_item.width()){
				cc_obj.max_w=$_item.width();
				cc_obj.max_outer_w=$_item.outerWidth(true);
			}
		});
		return cc_obj;
	},
	//动画对象
	swf:{
		left_card:{//只适合满盒子宽高切换
			init:function(){
				var _this=this,
					m_wrap_info,
					$_maincell_parent=_this.$_mainCell.parent();
				m_wrap_info=_this.get_cell_info(_this.$_mainCell);
				_this.$_mainCell.css({
					position:"absolute",
					left:0,
					top:0,
					display:"none",
					zIndex:2
				});
				if($_maincell_parent.css("position") =="static"){
					$_maincell_parent.css({
						position:"relative",
						height:m_wrap_info.max_h+"px"
					});
				}
				console.log(m_wrap_info);
				$_maincell_parent.css({
					height:m_wrap_info.height+"px"
				}).data("cache_w",m_wrap_info.max_outer_w);
				if(C.testCss3Attr("transform")){
					css3swf
						.Translate(_this.$_mainCell.eq(0),0,m_wrap_info.max_outer_w,0,function(){
							_this.$_mainCell.eq(0).css({
								display:"block",
								zIndex:3
							})
						},{
							threed:true
						})
						.Translate(_this.$_mainCell.eq(0),300,0,0,function(){
							_this.$_mainCell.eq(0).addClass("_thisClass");
						},{threed:true});
				}else{
					_this.$_mainCell.eq(0).css({left:m_wrap_info.max_outer_w,display:"blick"}).animate({
						left:0
					},300,function() {
						_this.$_mainCell.eq(0).addClass("_thisClass");
					})
				}


			},
			show:function(ele){
				var _this=this,
					$_last=_this.$_mainCell.eq(_this.last),
					$_ele=$(ele),
					cc_last_x={
						before:0
					},
					cc_index_x= {
						after:0
					},
					cc_outer_w=$_ele.parent().data("cache_w");

				_this.$_mainCell.css({display:"none",zIndex:2}).removeClass("_thisClass");
				css3swf.Translate(_this.$_mainCell,0,0,0);
				$_ele.css({display:"block",zIndex:3});
				$_last.css({display:"block",zIndex:3});
				//next
				if((_this.index==_this.$_mainCell.size()-1 && _this.last==0) || _this.index>_this.last){
					cc_last_x.after=0-cc_outer_w;
					cc_index_x.before=cc_outer_w;
				}
				//prev
				else if((_this.index==0 && _this.last==_this.$_mainCell.size()-1) || _this.index<_this.last){
					cc_last_x.after=cc_outer_w;
					cc_index_x.before=0-cc_outer_w;
				}

				if(C.testCss3Attr("transform")){
					css3swf
						.Translate($_last,0,cc_last_x.before+"px",0,function(){},{threed:true})
						.Translate($_last,300,cc_last_x.after+"px",0,function(){},{threed:true});
					css3swf
						.Translate($_ele,0,cc_index_x.before+"px",0,function(){},{threed:true})
						.Translate($_ele,300,cc_index_x.after+"px",0,function(){
							$_ele.addClass("_thisClass");
							_this.$_wrap.data("is_lock",false);
						},{threed:true});
				}else{
					$_last.css({left:cc_last_x.before}).animate({
						left:cc_last_x.after
					},300);
					$_ele.css({left:cc_index_x.before}).animate({
						left:cc_index_x.after
					},300,function(){
						$_ele.addClass("_thisClass");
						_this.$_wrap.data("is_lock",false);
					});
				}
			}
		},
		//滚动
		left:{
			init:function(){
				var _this=this;  //这里的 this 会通过 call 指向 slide
				var m_wrap_info,t_wrap_info;

				//获取 整体的宽，高

				if(!_this){
					return false;
				}
				_this.$_mainCell.wrapAll("<div class='s_wrap_main'></div>");
				_this.$_s_wrap_main=_this.$_wrap.find(".s_wrap_main");

				m_wrap_info=_this.get_cell_info(_this.$_mainCell);
				t_wrap_info=_this.get_cell_info(_this.$_titleCell);
				_this.$_mainCell.css({
					float:"left"
				});
				_this.$_s_wrap_main.css({
					width:m_wrap_info.count_w+'px',
					height:m_wrap_info.max_h+'px',
					position:'absolute',
					left:'0px',
					top:'0px'
				});
				_this.$_s_wrap_main.parent().css({
					height:m_wrap_info.max_h+'px'
				})
				_this.$_mainCell.css({
					width:m_wrap_info.max_w+"px",
					height:m_wrap_info.max_h+"px"
				});
				//一屏多个的情况 执行 competer visit
				_this.competer_visit();

				
				if(_this.$_s_wrap_main.parent().css("position") =="static"){
					_this.$_s_wrap_main.parent().css("position","relative");
				}
				
				if(t_wrap_info.count_w>_this.$_titleCell.parent().width()){
					_this.$_titleCell.wrapAll("<div class='s_wrap_title'></div>");
					_this.$_s_wrap_title=_this.$_wrap.find(".s_wrap_title");

					_this.$_s_wrap_title.css({
						width:t_wrap_info.count_w+'px',
						height:t_wrap_info.max_h+'px',
						position:'absolute',
						left:'0px',
						top:'0px'
					});
					if(_this.$_s_wrap_title.parent().css("position") == "static"){
						_this.$_s_wrap_title.parent().css("position","relative");
					}
				};
				_this.show(_this.$_wrap.find("["+_this.opt.prefix.main+"=0]"));

			},
			show:function(ele,is_title){
				var _this=this,
					$_ele=$(ele),
					dx=0-$_ele.outerWidth(true)*_this.index+'px';
				if(!_this.$_wrap.data('is_lock') && !$_ele.hasClass("_thisClass")){
					_this.$_s_wrap_main.data('is_animate_on','true');
					_this.$_wrap.find("["+_this.opt.prefix.title+"="+_this.index+"]").addClass(_this.opt.title_class).siblings().removeClass(_this.opt.title_class);
					css3swf.Translate(_this.$_s_wrap_main,300,dx,0,function(){
						_this.$_mainCell.filter("._thisClass").removeClass("_thisClass");
						$_ele.addClass("_thisClass");
						_this.$_wrap.data('is_lock',false);
						_this.opt.callback && _this.opt.callback.call(_this);
					},{
						threed:true
					})
				}
			}
		},
		//渐变
		fade:{
			init:function(){
				var _this=this,
					$_mainCell_parent=_this.$_mainCell.parent(),
					t_wrap_info,
					cc_height=0;
				t_wrap_info=_this.get_cell_info(_this.$_titleCell);
				_this.$_mainCell.each(function(index,item){
					var $_item=$(item);
					cc_height=$_item.height()<cc_height?cc_height:$_item.height();
				});
				_this.$_mainCell.css({
					display:"none",
					position:"absolute",
					left:"0px",
					top:"0px",
					width:$_mainCell_parent.width()+"px",
					height:cc_height+"px"
				});
				$_mainCell_parent.css({height:cc_height});
				if($_mainCell_parent.css("position") =="static"){
					$_mainCell_parent.css("position","relative");
				}
				if(t_wrap_info.count_w>_this.$_titleCell.parent().width()){
					_this.$_titleCell.wrapAll("<div class='s_wrap_title'></div>");
					_this.$_s_wrap_title=_this.$_wrap.find(".s_wrap_title");

					_this.$_s_wrap_title.css({
						width:t_wrap_info.count_w+'px',
						height:t_wrap_info.max_h+'px',
						position:'absolute',
						left:'0px',
						top:'0px'
					});
					if(_this.$_s_wrap_title.parent().css("position") == "static"){
						_this.$_s_wrap_title.parent().css("position","relative");
					}
				};
				_this.show(_this.$_wrap.find("["+_this.opt.prefix.main+"=0]"));
			},
			show:function(ele){

				var _this=this,
				    $_ele=$(ele);
				if(!_this.$_wrap.data('is_lock')){
					_this.$_mainCell.fadeOut(_this.opt.time);
					_this.$_mainCell.filter("._thisClass").removeClass("_thisClass");
					
					_this.$_wrap.find("["+_this.opt.prefix.title+"="+_this.index+"]").addClass(_this.opt.title_class).siblings().removeClass(_this.opt.title_class);
					$_ele.fadeIn(_this.opt.time,function(){
						$_ele.addClass("_thisClass");
						_this.$_wrap.data('is_lock',false);
						_this.opt.callback && _this.opt.callback.call(_this);
					});
				}
			}
		},
		"card":{
			init:function(){
				var _this=this;
				_this.$_mainCell.css({
					position:"absolute",
					left:"0px",
					top:"0px",
					zIndex:"8"
				});
				if(_this.$_mainCell.parent().css("position") == "static"){
					_this.$_mainCell.parent().css({
						position:'relative',
						height:_this.$_mainCell.eq(0).height()+"px"
					});
				}
				_this.show(_this.$_wrap.find("["+_this.opt.prefix.main+"=0]"));
			},
			show:function(ele){
				var _this=this,
					$_show=$(ele),
					$_last=_this.$_mainCell.filter("._thisClass"),
					cc_mainCell_length=_this.$_mainCell.length,
					cc_show_index=$_show.index(),
					cc_last_index=$_last.index();
				$_show.siblings().css({zIndex:8});
				$_last.css({zIndex:9});
				var direction={
					left_to_right:function(){
						$_show.css({
							left:"-100%",
							zIndex:10
						});
					},
					right_to_left:function(){
						$_show.css({
							left:"100%",
							zIndex:10
						});
					}
				};
				if(cc_show_index==0 && cc_last_index==cc_mainCell_length-1){
					direction.right_to_left();
				}
				else if(cc_show_index==cc_mainCell_length-1 && cc_last_index==0){
					direction.left_to_right();
				}
				else if(cc_last_index<cc_show_index){
					direction.right_to_left();
				}
				else{
					direction.left_to_right();
				}
				$_show.stop().animate({
					left:"0px"
				},_this.opt.time,function(){
					$_show.addClass("_thisClass").siblings().removeClass("_thisClass");
					_this.$_wrap.data('is_lock',false);
				});
			}
		}
	},
	drag_init:function(){
		var _this=this;
		var fn_drag_bindEvent=function(){
			var	cc_start_point={},
				cc_end_point={};
			var compter_direction=function(start,end,sen){
				if(!C.isObject(start) || !C.isObject(end)){
					return false;
				}
				var cc_distance={
					x:end.x-start.x,
					y:end.y-start.y
				};
				sen =sen || 50;
				if(Math.abs(cc_distance.x)>sen || Math.abs(cc_distance.y)>sen){
					if(Math.abs(cc_distance.x) >= Math.abs(cc_distance.y)){
						if(cc_distance.x<0){
							_this.opt.touch_obj.fn_list.touch_left && _this.opt.touch_obj.fn_list.touch_left.call && _this.opt.touch_obj.fn_list.touch_left.call(_this);
						}else{
							_this.opt.touch_obj.fn_list.touch_right && _this.opt.touch_obj.fn_list.touch_right.call && _this.opt.touch_obj.fn_list.touch_right.call(_this);
						}
					}
					else{
						if(cc_distance.y<0){
							_this.opt.touch_obj.fn_list.touch_top && _this.opt.touch_obj.fn_list.touch_top.call && _this.opt.touch_obj.fn_list.touch_top.call(_this);
						}else{
							_this.opt.touch_obj.fn_list.touch_bottom && _this.opt.touch_obj.fn_list.touch_bottom.call && _this.opt.touch_obj.fn_list.touch_bottom.call(_this);

						}
					}
				}
			};
			_this.$_wrap.on("touchstart",function(e){
				//e.stopPropagation();
				//e.preventDefault();
				if(e.originalEvent.changedTouches.length==1){
					cc_start_point={
						x: e.originalEvent.changedTouches[0].pageX,
						y: e.originalEvent.changedTouches[0].pageY
					};
				}else{
					console.log("touches 不等于 1");
				}
			});
			_this.$_wrap.on("touchmove",function(e){
				e.preventDefault();
			});
			_this.$_wrap.on("touchend",function(e){
				//e.stopPropagation();
				//e.preventDefault();
				if(e.originalEvent.changedTouches.length==1){
					cc_end_point={
						x: e.originalEvent.changedTouches[0].pageX,
						y: e.originalEvent.changedTouches[0].pageY
					};
					compter_direction(cc_start_point,cc_end_point,_this.opt.touch_obj.sen);
				}else{
					console.log("touches 不等于 1");
				}
			});
		};
		fn_drag_bindEvent();
	}
};
/*
{
	wrap:".wrap"  								//slide 盒子
	mainCell:".bd a"   							// 轮播内容 选择器
	titleCell:".hd a"  							// 索引 选择器
	title_class:"on" 							//  索引当前class
	effect:"left"  								//动画  例如  left || fade
	time:500    								//动画时间  norml:500
	prev:'.btn_prev'   							//上一个按钮  选择器
	next:'.btn_next'  							//下一个按钮选择器
	differ:1  									//切换的 内容 个数
	visit:2   									//可视的 内容 个数
	init_bafore:function(){}  					//初始化前  执行函数
	init_after:function(){} 					//初始化后 执行函数
	has_touch									//是否可以 触碰
	has_loop                                    //切换是否循环
    no_maopao                                   //touchstart 不冒泡
	touch_opt:{
		 sen									//触碰大于多少距离触发
		 fn_lsit:{
			 touch_left:function(){},
			 touch_right:function(){},
			 touch_top:function(){},
			 touch_bottom:function(){}
		 }
	}

	custom_event:{//自定义 事件
		".bd a":{
			"click":function(e){
				console.log(e.target);
			}
		}
	}
};
*/
exports.slide=function(opt){
	if(!opt || !C.isObject(opt)){
		return false;
	}
	return new slide(opt);
};
