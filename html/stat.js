function drowStat(rootDOM, data, start_pos, end_pos, unic_id, source_type, source_name, date_start, date_end, date_now){
	let script="";   
	let op = source_type+' '+source_name;
	

	let width='one_day_msec/24';
	let min_tick_size="hour";
	let date_diff="one_day_msec/48";
	let markings='weekendAreasHour';
	
	let min_val=0;
	let max_val=0;
	
	const data_arr= [];
	let firs_date=date_start+' 00:00:00';		
	let last_date=date_end+' 23:59:59';	
	
	for (let i = start_pos; i < end_pos; i++) { 
		row = data[i];
		data_arr.push([date_parse_hour(row[2]), row[4]]);
		min_val= ( row[4] < min_val ) ? row[4] : min_val;
		max_val= ( row[4] > max_val ) ? row[4] : max_val;    
	}
	let d1 = data_arr;
	let d2 = [[new Date().getTime(),0],[new Date().getTime(),max_val]];
	
	let placeholder_id='placeholder_'+unic_id;
			
	let containerHTML = "<div id='container_"+unic_id+"' class='stat-comm-container'>\
		<div class='stat-button'></div>\
		<div class='stat-label'>"+op+"</div>\
		<div id='"+placeholder_id+"' class='demo-placeholder'></div>\
	</div>"; 
	rootDOM.insertHTML(containerHTML, '');
	
	let win_width=self.innerWidth-550;
	if(win_width<400)
		win_width=400;
	document.getElementById('container_'+unic_id).style.width=win_width;					
	
	var one_day_msec = 86400000;
	let placeholder = $("#"+placeholder_id);
	
	var plot = $.plot(placeholder, [ {
			data : d1,
			bars: {
				show: true,
				barWidth: width,
				align: "center",
			},
			shadowSize: 0
		}, {
			data: d2,
			lines: {show: true, lineWidth: 1},
			color: 'gray'
		}], {
		xaxis: {
			mode: "time" ,
			timezone: "browser",
			monthNames: ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек",],
			minTickSize:[1,min_tick_size],
			tickLength:0,
			zoomRange: [width*6, date_parse_hour(last_date).getTime()],
			min: date_parse_hour(firs_date).getTime() - date_diff,
			max:date_parse_hour(last_date).getTime() + date_diff,
			panRange: [date_parse_hour(firs_date).getTime() - date_diff, date_parse_hour(last_date).getTime() + date_diff]
		},
		yaxis: {
			min: min_val,
			max: max_val + 3,
			zoomRange: [max_val, max_val],
			panRange: [min_val, max_val + 3],
			tickFormatter:suffixFormatter
		},
		grid: {
			hoverable: true,
			clickable: true,
			markings: markings
		},
		zoom: {
			interactive: true
		},
		pan: {
			interactive: true
		}
	});
	$("<div id='tooltip'></div>").css({
		position: "absolute",
		display: "none",
		border: "1px solid #fdd",
		padding: "2px",
		"background-color": "#fee",
		opacity: 1
	}).appendTo("body");
	$("#"+placeholder_id).bind("plothover", function (event, pos, item) {

			var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
			$("#hoverdata").text(str);
			if (item) {
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);

				$("#tooltip").html(timestamp_to_hour_char(Number(x)) +" - "+suffixFormatter(Number(y)))
					.css({top: item.pageY+5, left: item.pageX+5})
					.fadeIn(0);
			} else {
				$("#tooltip").hide();
			}
	});
	
	return plot;
}
