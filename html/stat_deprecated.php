<?php


//////////////////////////////////////////////////////////////////////
	function drowStat(&$data, $start_pos, $end_pos, $unic_id, $source_type, $source_name, $date_start, $date_end, $date_now){
		global $db_conn;
		$block="";
		$script="";   
		$op = $source_type.' '.$source_name;
		
		$bs="select oper_id,datez,datez d,n 
						order by d";
		$js_date_func="date_parse_hour";
		$width='one_day_msec/24';
		$min_tick_size="hour";
		$date_diff="one_day_msec/48";
		$markings='weekendAreasHour';
		
		$min_val=0;
		$max_val=0;
		
		$json_arr="";
		$firs_date=$date_start.' 00:00:00';		
		$last_date=$date_end.' 23:59:59';	
		$i=0;

		for ($i=$start_pos; $i < $end_pos; $i++) { 
			$row = &$data[$i];
			$json_arr .= "[".$js_date_func."('".$row[2]."').getTime(), ".$row[4]."],";
			$min_val= ( $row[4] < $min_val ) ? $row[4] : $min_val;
			$max_val= ( $row[4] > $max_val ) ? $row[4] : $max_val;    
		}
	
		
		$data1 = "var d1 = [".substr( $json_arr, 0, strlen($json_arr)-1)."];";
		$data2 =" var d2 = [ [".$js_date_func."('".$date_now ."').getTime(),0],[".$js_date_func."('".$date_now ."').getTime(),".$max_val."] ];"; 

		$placeholder_id='placeholder_'.$unic_id;
				
		$block.="
		<div id='container_".$unic_id."'  class='stat-comm-container'><div class='stat-button'>";
			
		$block.="</div><div class='stat-label'>".$op."</div>";
		$block.="	<div id='".$placeholder_id."' class='demo-placeholder'></div>
		</div>"; 
							
							$script='
							
							var win_width=self.innerWidth-550;
							if(win_width<400)
								win_width=400;
							document.getElementById(\'container_'.$unic_id.'\').style.width=win_width;
							
							var one_day_msec = 86400000;
							placeholder = $("#'.$placeholder_id.'");
							'.$data1.$data2.'
							console.log(d2)
							var plot = $.plot(placeholder, [ {
									data : d1,
									bars: {
										show: true,
										barWidth: '.$width.',
										align: "center",
									},
									shadowSize: 0
								}, {
									data: d2,
									lines: {show: true, lineWidth: 1},
									color: \'gray\'
								}], {
								xaxis: {
									mode: "time" ,
									timezone: "browser",
									monthNames: ["���","���","���","���","���","���","���","���","���","���","���","���",],
									minTickSize:[1,"'.$min_tick_size.'"],
									tickLength:0,
									zoomRange: ['.$width.'*6, '.$js_date_func.'(\''.$last_date.'\').getTime()],
									min:'.$js_date_func.'(\''.$firs_date.'\').getTime()-'.$date_diff.',
									max:'.$js_date_func.'(\''.$last_date.'\').getTime()+'.$date_diff.',
									panRange: ['.$js_date_func.'(\''.$firs_date.'\').getTime()-'.$date_diff.', '.$js_date_func.'(\''.$last_date.'\').getTime()+'.$date_diff.']
								},
								yaxis: {
									min:'.$min_val.',
									max:'.($max_val+3).',
									zoomRange: ['.($max_val).', '.($max_val).'],
									panRange: ['.$min_val.', '.($max_val+3).'],
									tickFormatter:suffixFormatter
								},
								grid: {
									hoverable: true,
									clickable: true,
									markings: '.$markings.'
								},
								zoom: {
									interactive: true
								},
								pan: {
									interactive: true
								}
							});
							$("<div id=\'tooltip\'></div>").css({
								position: "absolute",
								display: "none",
								border: "1px solid #fdd",
								padding: "2px",
								"background-color": "#fee",
								opacity: 1
							}).appendTo("body");
							$("#'.$placeholder_id.'").bind("plothover", function (event, pos, item) {

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

							'; 
		

		$block.='<script>'.$script.'</script>';
		return $block;
	}



	if (!isset ($_REQUEST['level'])) $level=1;
	if (!isset ($_REQUEST['oper'])) $oper='all';

	$display .= '
	<link rel="stylesheet" type="text/css" href="./graph.css" />
	<script type="text/javascript" src="./graph.js"></script>
	<script type="text/javascript" src="../lib/flot/jquery.js"></script>
	<script type="text/javascript" src="../lib/flot/jquery.flot.js"></script>
	<script type="text/javascript" src="../lib/flot/jquery.flot.navigate.js"></script>
	<script type="text/javascript" src="../lib/flot/jquery.flot.time.js"></script>
	<script type="text/javascript" src="./jquery.maskedinput.js"></script>';    
	$sel = "select to_char(sysdate-7,'dd.mm.yyyy') as date_start,to_char(sysdate,'dd.mm.yyyy') as date_end, to_char(sysdate,'dd.mm.yyyy HH24:MI:SS') as date_now  from dual";
	$date = db_exec_select($sel);
	$date_start = (!isset ($_GET['date_start']) ) ? $date[0][0] : $_GET['date_start'];
	$date_end = (!isset ($_GET['date_end']) ) ? $date[0][1] : $_GET['date_end'];
	$date_now = $date[0][2];
	

	$unic_id=0;
	$display .="
	<div class='modern_input'>
		<table>
			<tr>
				<td width='900px'>";
	
    

	$sel = "SELECT source_type, source_name,datez,datez d,n from(
			select source_type, source_name, to_char(t.datez,'dd.mm.yyyy HH24:MI:SS') datez, sum(t.num_) n from  stat t
				where  datez >= to_date('".$date_start."','DD.MM.YYYY') and datez <= to_date('".$date_end." 23:59:59','DD.MM.YYYY hh24:mi:ss') 
			group by source_type, source_name, to_char(datez,'dd.mm.yyyy HH24:MI:SS')
		)
		order by source_type, source_name, d";

	$result = db_exec_select($sel);
	// $display .= '<pre>'.print_r($result, true).'</pre>';
	$key_prev='';
	$start_pos = 0;
	$end_pos = 0;
	$source_type='';
	$source_name='';

	for ($i=0; $i < count($result); $i++) { 
		$row = &$result[$i];
		$key_current = $row[0].'_'.$row[1];
		if ( $i == count($result) - 1 || ($key_prev != '' && $key_current != $key_prev)) {
			if ($source_type=='') {
				$source_type=$row[0];
				$source_name=$row[1];
			}
			$display .= drowStat($result, $start_pos, $end_pos, $unic_id, $source_type, $source_name, $date_start, $date_end, $date_now);
			$unic_id++;
			$start_pos = $i;
		}
		$key_prev = $key_current;
		$source_type=$row[0];
		$source_name=$row[1];
		$end_pos++;
	}
	

	
    $display .="</td>";
	$display .="<td width=200px  valign=top>
					������ <br>�<br>
					<input class='input_date'  type='text' value='".$date_start."'  id='stat_date_start'  /><br>��<br>
					<input class='input_date' type='text' value='".$date_end."'  id='stat_date_end'  /><br>";
	$display .= "	<input style='margin-top:10px' class='sphere'  type=button value=\"��������\" onclick='windowRefresh();'>
				</td>
			</tr>
		</table>
	</div>";
	
    print_footer(); 
?>