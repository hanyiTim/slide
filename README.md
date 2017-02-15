# slide
//2017-02-15
调用方式
require slide之后，调用slide方法，例如
```
slide.slide(opt);
//opt
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
```
