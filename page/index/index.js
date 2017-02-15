/**
 *
 *
 *
 * 
 */
var C=require("C");
var $=require("$");
var slide=require("slide");
exports.init=function(){
	var vw=new Vue({
		el:"#page_index",
	});
	slide.slide({
		wrap:".vw_slide_1",
		mainCell:".vw_bd .vw_item",
		titleCell:".vw_hd a"
	});
	slide.slide({
		wrap:".vw_slide_2",
		mainCell:".vw_bd .vw_item",
		titleCell:".vw_hd a",
		effect:"fade"
	});
	slide.slide({
		wrap:".vw_slide_3",
		mainCell:".vw_bd .vw_item",
		titleCell:".vw_hd a",
		effect:"card"
	});
	slide.slide({
		wrap:".vw_slide_4",
		mainCell:".vw_bd .vw_item",
		titleCell:".vw_hd a",
		effect:"left_card"
	});


};
