function parseSemesters(xml){
	$("select#semesterid").html('<option value="">Select Semester</option>');
	$(xml).find('semester').each(function(){
		//alert($(this).attr("id"));
		$("select#semesterid").append('<option value="'+$(this).attr("dbid")+'">'+$(this).text()+'</option>');
	});
}
function parseSubjects(xml){
	$("select#majorid").html('<option value="">Select Major</option>');
	$(xml).find('subject').each(function(){
		//alert($(this).attr("id"));
		$("select#majorid").append('<option value="'+$(this).attr("id")+'">'+$(this).text()+'</option>');
	});
}
function parseCourses(xml){
	$("select#courseid").html('<option value="">Select Course</option>');
	$(xml).find('course').each(function(){
		//alert($(this).attr("id"));
		$("select#courseid").append('<option value="'+$(this).attr("id")+'">'+$(this).text()+'</option>');
	});
}
function parseSections(xml){
	var table = $("<table width='100%'/>").attr({id: 'courselist', class: 'tablesorter'}).append(
			$("<tr />").append(
				$("<th width='20px' />").html(""),
				$("<th width='40px' />").html("CRN"),
				$("<th width='60px' />").html("Major"),
				$("<th width='50px' />").html("Course"),
				$("<th width='50px' />").html("Section"),
				$("<th width='45px' />").html("Days"),
				$("<th />").html("Times"),
				$("<th />").html("Duration"),
				$("<th width='120px' />").html("Room"),
				$("<th width='65px' />").html("Status"),
				$("<th width='60px' />").html("Current"),
				$("<th width='40px' />").html("Max"),
				$("<th />").html("Instructor"),
				$("<th width='50px' />").html("Credit")
			)
		);
	$(xml).find('section').each(function(){
		var day='';
		$(this).find('day').each(function(){
			day += $(this).attr('id')+'<br />';
		});
		var durationIndx = [];
		var duration = '';
		$(this).find('duration').each(function(index){
			if($(this).text() != '0'){
				durationIndx[index] = $(this).text();
				var hr=Math.floor(durationIndx[index]/60);
				var min= (durationIndx[index]%60);
				if(hr > 1) hr+= ' hrs'; else if(hr = 1) hr+= ' hr'; else hr = '';
				if(min > 1) min+= ' mins'; else min+= ' min';
				duration += hr+'  '+ min + '<br/>';
			}else duration = '-';
		});
		var time='';
		$(this).find('time').each(function(index){
			var start_r = $(this).text();
			var t_str = $(this).text().split(':');
			if(t_str[0]){
				if(t_str[0] != '08') hr1 = parseInt(t_str[0]);
				else hr1 = parseInt('8');
				//alert(hr1);
				hrm1 = parseInt(t_str[1]);
				var hr = Math.floor(parseInt(durationIndx[index])/60);
				hr = (hr + hr1);
				var mins = parseInt(durationIndx[index])%60;
				mins = (mins + hrm1);
				if(mins > 60){
					//alert('over');
					var mins = (mins - 60);
					hr += 1;
				}
				if(parseInt(mins.length) == 1)
					mins = '0'+ mins+"";
				//alert(mins.length);
				time += start_r+' - '+ hr +':'+ mins +'<br />';
				//time += start_r+' - '+ (min2time(start_r,durationIndx[index])) +'<br />';
				//time += t_str[0]+''+t_str[1]+':'+t_str[2]+''+t_str[3]+' - <br />';
			}else time = '-';
		});
		var oldtime = " ";
		if($(this).find('old_time').text())
			oldtime = $(this).find('old_time').text();
		var room='';
		$(this).find('room').each(function(){		
			room += '<span id="mapTooltip">'+$(this).text()+'</span><br />';
		});
		table.append($("<tr />").append(
			//$("<td />").html('<input id=section type=radio name=select_section value="'+$(this).find('call').text()+'" />'),
			$("<td />").html("<input type=\"radio\" name=\"selection_radio\" " + ( $(this).find('status').text() == "Cancelled" ? "disabled" : "") + " />"),
			$("<td id='call' />").html($(this).find('call').text()),
			$("<td id='subjectid' />").html($(this).find('subject').text()),
			$("<td id='courseid' />").html($(this).find('course').attr('id')),
			$("<td id='sectionid' />").html($(this).attr("id")),
			$("<td id='days' />").html(day),
			$("<td id='time' class=\""+ oldtime +"\" />").html(time),
			$("<td id='duration' />").html(duration),
			$("<td id='room' title='Click to View this Building' />").html(room),
			$("<td id='status' />").html($(this).find('status').text()),
			$("<td id='cur' />").html($(this).find('enrollment').attr('cur')),
			$("<td id='max' />").html($(this).find('enrollment').attr('max')),
			$("<td id='instructor' />").html($(this).find('instructor').text()),
			$("<td id='credits' />").html($(this).find('credits').text()+'.00')
		));
	});
	
	$("div#list form").html("<strong>Click on \"Show Schedule\" upper right corner to view added courses.</strong>");
	$("div#list form").append(table.css({'margin': '5px 0 0 0'})).css({'margin': '5px 0 10px 0'});
	tableStyle('courselist');
}

function min2time(s,m){
	var e='';
	//alert(s+' '+m);
	$.ajax({
		type: "POST",
		data: "r=min2time&start_time="+s+"&mins="+m,
		url: "./include/cproxy.php",
		dataType: "xml",
		success: function(xml) {
			e = $(xml).find('endtime').text();
			alert(e);
		}
	});
	return e;
}
function tableStyle(id) {
	$('table#'+id).styleTable({
		th_bgcolor: '#a8171c',  
		th_color: '#ffffff',  
		th_border_color: '#333333',  
		tr_odd_bgcolor: '#ECF6FC',  
		tr_even_bgcolor: '#ffffff',  
		tr_border_color: '#95BCE2',  
		tr_hover_bgcolor: '#BCD4EC',
		font_size: '10px'
	});
}