# slide
//2017-02-15
���÷�ʽ
require slide֮�󣬵���slide����������
slide.slide(opt);
//opt
{
	wrap:".wrap"  								//slide ����
	mainCell:".bd a"   							// �ֲ����� ѡ����
	titleCell:".hd a"  							// ���� ѡ����
	title_class:"on" 							//  ������ǰclass
	effect:"left"  								//����  ����  left || fade
	time:500    								//����ʱ��  norml:500
	prev:'.btn_prev'   							//��һ����ť  ѡ����
	next:'.btn_next'  							//��һ����ťѡ����
	differ:1  									//�л��� ���� ����
	visit:2   									//���ӵ� ���� ����
	init_bafore:function(){}  					//��ʼ��ǰ  ִ�к���
	init_after:function(){} 					//��ʼ���� ִ�к���
	has_touch									//�Ƿ���� ����
	has_loop                                    //�л��Ƿ�ѭ��
    no_maopao                                   //touchstart ��ð��
	touch_opt:{
		 sen									//�������ڶ��پ��봥��
		 fn_lsit:{
			 touch_left:function(){},
			 touch_right:function(){},
			 touch_top:function(){},
			 touch_bottom:function(){}
		 }
	}

	custom_event:{//�Զ��� �¼�
		".bd a":{
			"click":function(e){
				console.log(e.target);
			}
		}
	}
};


