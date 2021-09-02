



function date_parse_short(date1_str){
	var date1_left=date1_str;
	var date1_left_pre=date1_left.split(".");
	var date1_year=Number(date1_left_pre[2]);
	var date1_month=Number(date1_left_pre[1])-1;
	var date1_day=Number(date1_left_pre[0]);
	
	var date1= new Date(date1_year,date1_month,date1_day,0,0,0);
	return date1;
}
function date_parse_mm(date1_str){  
	
	var date1_left_pre=date1_str.split(".");
	var date1_year=Number(date1_left_pre[1]);
	var date1_month=Number(date1_left_pre[0])-1;
	
	var date1= new Date(date1_year,date1_month,1,0,0,0);
	return date1;
}
function date_parse_hour(date1_str){
	var date1_pre=date1_str.split(" ");
	
	var date1_left=date1_pre[0];
	var date1_right=date1_pre[1];
	
	var date1_left_pre=date1_left.split(".");
	var date1_year=Number(date1_left_pre[2]);
	var date1_month=Number(date1_left_pre[1])-1;
	var date1_day=Number(date1_left_pre[0]);
	
	var date1_right_pre=date1_right.split(":");
	var date1_hour=Number(date1_right_pre[0]);
	var date1_min=Number(date1_right_pre[1]);
	var date1_sec=Number(date1_right_pre[2]);
	
	var date1= new Date(date1_year,date1_month,date1_day,date1_hour,date1_min,date1_sec);
	return date1;
}


function timestamp_to_char(l) {
	var date1=new Date(l);
	var date1_str=("0"+date1.getDate()).slice(-2)+"."+("0"+(1+date1.getMonth())).slice(-2)+"."+("000"+date1.getFullYear()).slice(-4);
	return date1_str;
}
function timestamp_to_hour_char(l) {
	var date1=new Date(l);
	var date1_str=("0"+date1.getDate()).slice(-2)+"."+("0"+(1+date1.getMonth())).slice(-2)+"."+("000"+date1.getFullYear()).slice(-4)+" "+("0"+date1.getHours()).slice(-2)+":"+("0"+date1.getMinutes()).slice(-2);
				
	return date1_str;
}
function weekendAreas(axes) {

	var markings = [],
		d = new Date(axes.xaxis.min);

	// go to the first Saturday

	d.setDate(d.getDate() - ((d.getDay() + 1) % 7))
	d.setSeconds(0);
	d.setMinutes(0);
	d.setHours(0);

	var i = d.getTime()-43200000;

	// when we don't set yaxis, the rectangle automatically
	// extends to infinity upwards and downwards

	do {
		markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
		i += 7 * 24 * 60 * 60 * 1000;
	} while (i < axes.xaxis.max);

	return markings;
}
function weekendAreasHour(axes) {

	var markings = [],
		d = new Date(axes.xaxis.min);

	// go to the first Saturday

	d.setDate(d.getDate() - ((d.getDay() + 1) % 7))
	d.setSeconds(0);
	d.setMinutes(0);
	d.setHours(0);

	var i = d.getTime()-1800000;

	// when we don't set yaxis, the rectangle automatically
	// extends to infinity upwards and downwards

	do {
		markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
		i += 7 * 24 * 60 * 60 * 1000;
	} while (i < axes.xaxis.max);

	return markings;
}
function monthsAreas(axes) {

	var markings = [],
		d = new Date(axes.xaxis.min);

	// go to the first Saturday
	
	
	var i = d.getTime();

	// when we don't set yaxis, the rectangle automatically
	// extends to infinity upwards and downwards
	var days_count=0;
	do {
		markings.push({ xaxis: { from: i, to: i + 1 * 28 * 24 * 60 * 60 * 1000 } });
		days_count=days_in_mounth(Date(i));
		i += ( days_count - 28 )+ 1 * days_count * 24 * 60 * 60 * 1000;
	} while (i < axes.xaxis.max);

	return markings;
}
function days_in_mounth(date_){
	var regular_year=[31,28,31,30,31,30,31,31,30,31,30,31];
	var leap_year=[31,29,31,30,31,30,31,31,30,31,30,31];
	var date2=new Date(date_);
	
	if(isLeapYear(date2))
		return leap_year[date2.getMonth()];
	else
		return regular_year[date2.getMonth()];
	

}
function isLeapYear(date1){
	var date2=new Date(date1);
	var y=date2.getFullYear();
	return y%4==0 && y%100!=0 ||y%400==0;
}
function suffixFormatter(val){
	var str=val.toString();
	var res='';
	
	var str_len=str.length;
	var i=0;
	var split_len=3;
	while(i < str_len){
		
		if(split_len>str_len-i)
			split_len=str_len-i;
		i+=3;	
			
		res =  str.substr(-i,split_len) + ' ' + res;
		
	}
	
	return res;
}
function container_show_hide( cont_class,id,checked ){
	var display="none";
	if(checked)
		display="block";
	
	var subblocks_all = document.getElementsByClassName(cont_class);
	var subblocks_all_count = subblocks_all.length;
	
	for(var i = 0; i < subblocks_all_count; i++){
			if(subblocks_all[ i ].getAttribute('oper_id')==id){
					subblocks_all[ i ].style.display = display;
			}
	}


}
function window_refresh(){
	var date_start = document.getElementById('stat_date_start').value;
	var date_end = document.getElementById('stat_date_end').value;
	var checked='';
	var ul_block=document.getElementById('oper_ul_spisok');
	
	var inputs=ul_block.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++){
			if(inputs[ i ].checked){
					checked+=','+inputs[ i ].getAttribute('oper_id');
			}
	}
	checked += ',';
	window.location='bill_stat_day.php?date_start='+date_start+'&date_end='+date_end+'&checked='+checked;


}
function refresh_containers_visibility(cont_class,opers){
	var subblocks_all = document.getElementsByClassName(cont_class);
	var subblocks_all_count = subblocks_all.length;
	var opers_explode = opers.split(',');
	
	
	for(var i = 0; i < subblocks_all_count; i++){
		
		var checked=0;		
		for(var opers_i = 0; opers_i < opers_explode.length; opers_i++){
			if(opers_explode[opers_i]!='' && opers_explode[opers_i] == subblocks_all[ i ].getAttribute('oper_id') ){
				checked=1;
				break;
			}
		}
		
		if(checked){
			subblocks_all[ i ].style.display = 'block';	
			//document.getElementById('oper_ul'+subblocks_all[ i ].getAttribute('oper_id')).checked=true;
			
		}else{
			subblocks_all[ i ].style.display = 'none';		
			//document.getElementById('oper_ul'+subblocks_all[ i ].getAttribute('oper_id')).checked=false;
		}
	}
}
