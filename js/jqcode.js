if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,"");
  };
}
jQuery.fn.repeat = function(times, string) {
    this.each(function(){  
        var buff = string;  
        for(var i=1; i < times; i++){  
            buff += string;  
        }  
        jQuery(this).append(buff);  
    });  
    return this;  
};
$(document).ready(function(){
	$('div#searchby').hide();
	$('div#filters').hide();
	$("div#schedule").hide();
	$("div#cart_details").hide();
	
	var currentSchedule = {}, 
	history = [];
	var div_contents = $("div#contents").html();
	$('span a.selection').live("click",function(){
		$('div#selection').next().hide().next().hide();
		$('div#selection').show();
	});
	$('span a.searchby').live("click",function(){
		$('div#selection').hide().next().next().hide();
		$('div#searchby').show();
	});
	$('span a.filters').live("click",function(){
		$('div#selection').hide().next().hide();
		$('div#filters').show();
	});
	
	//onLoad Semesters....
	$.ajax({type: "POST",data: "r=semesters",url: "./include/mproxy.php",dataType: "xml",success: parseSemesters });
	
	//on Semester change
	$("select#semesterid").change(function(){
	$("div#contents").html(div_contents);
		if(parseInt($('span.totalcr').html()) != 0)
		{
			if( !confirm("Are you sure you want to remove all courses?") ) return;
			for( course in currentSchedule ){
				if( !currentSchedule.hasOwnProperty(course) ) continue;
				removeCourse(course);
			}
			return false;
		}
	$('div#map-canvas').css({left: '-2000px', display: 'none'}).html('');
	if('block' == $("div#selection").css('display')){
		$.ajax({
			type: "POST",
			data: "r=subjects&semester="+$(this).val(),
			url: "./include/mproxy.php",
			dataType: "xml",
			success: parseSubjects
		});
	}
		if($(this).val())
			$(this).parent().removeClass('active-step').addClass('completed-step')
			.next().removeClass().addClass('active-step')
			.find("select").removeAttr('disabled');
		else 
			$(this).parent().removeClass().addClass('active-step')
			.next().removeClass().find("select").attr('disabled', '')
			.parent().next().removeClass().find("select").attr('disabled', '');
	});
	$("select#majorid").change(function(){
		$("div#contents").html(div_contents);
		$('div#map-canvas').css({left: '-2000px', display: 'none'}).html('');
		//$('div#list form').empty();
		$.ajax({
			type: "POST",
			data: "r=courses&semester="+$("select#semesterid").val()+"&subject="+$(this).val(),
			url: "./include/mproxy.php",
			dataType: "xml",
			success: parseCourses
		});
		if($(this).val())
			$(this).parent().removeClass('active-step').addClass('completed-step')
			.next().removeClass().addClass('active-step')
			.find("select").removeAttr('disabled');
		else 
			$(this).parent().removeClass().addClass('active-step')
			.next().removeClass()
			.find("select").attr('disabled', '');
	});
	$("select#courseid").change(function(){
		//$('div#list form').html();
		$('div#map-canvas').css({left: '-2000px', display: 'none'}).html('');
		$("div#contents").html($("<div id='list' />").append($("<form />").css('text-align', 'center').html("<img src='http://njitplanner.maheshdev.us/img/loader.gif' width='auto' height='auto'>")
		));
		$.ajax({
			type: "POST",
			data: "r=sections&semester="+$("select#semesterid").val()+"&subject="+$("select#majorid").val()+"&course="+$(this).val(),
			url: "./include/mproxy.php",
			dataType: "xml",
			success: parseSections
		});
		if($(this).val() != '')
			$(this).parent().removeClass('active-step').addClass('completed-step');
		else 
			$(this).parent().removeClass().addClass('active-step');
		if($("div#contents").css('display') == 'none'){
			$("div#schedule").hide();
			$("div#contents").show();
			$("a.hideschedule").attr("class","viewschedule").html("View Schedule");
		}
	});
	//Search Type Dropdown box
	var qt;
	$("select#qtype").change(function(){
		$("div#contents").html(div_contents);
		$('div#map-canvas').css({left: '-2000px', display: 'none'}).html('');
		qt= $(this).val();
		//$('div#list form').empty();
		if($(this).val() != '')
			$(this).parent().removeClass('active-step').addClass('completed-step')
			.next().removeClass().addClass('active-step')
			.find("select").removeAttr('disabled');
		else 
			$(this).parent().removeClass().addClass('active-step')
			.next().removeClass()
			.find("select").attr('disabled', '');
	});
	//Send Search Query to Backend
	$("input#searchq").keyup(function() {
		$('div#map-canvas').css({left: '-2000px', display: 'none'}).html('');
		var q = $(this).val();
		if( !q || q.length <= 1 && !isNaN($("select#qtype").val())) return;
		$("div#contents").html($("<div id='list' />").append($("<form />").css('text-align', 'center').html("<img src='http://njitplanner.maheshdev.us/img/loader.gif' width='auto' height='auto'>")
		));
		if(qt=='profq'){var qtype='instructor'; var r='courses';}else if(qt=='call'){var qtype='call'; var r='info';}else{}
		$.ajax({
			type: "POST",
			data: "r="+r+"&semester="+$("#searchby select#semesterid").val()+"&"+qtype+"="+q,
			url: "./include/mproxy.php",
			dataType: "xml",
			success: parseSections
		});
		
	});
	//Filter Options
	$(".time input.sortbytime").live("click", function() {
		//$('fieldset input[type=checkbox]').each(function () {
			var val = $(this).val(),
				query = / /ig;
			switch( val ){
				case "am":
					query = /AM/ig;
				break;
				case "pm":
					query = /PM/ig;
				break;
			}
			$("#courselist tr").each(function(i, e){
				var daytime = $(this).find("#time").attr("class");
				//alert(daytime);
				if( i == 0 ) return true;
				$(this).show();
				if( daytime.search(query) == -1 )
					$(this).hide();
			});
		//});
	});
	
	//Filter Days
	$(".days input.sortbyday").live("click", function() {
		var val = $(this).val(),
				query = / /ig;
			switch( val ){
				case "m":
					query = /M/ig;
				break;
				case "t":
					query = /T/ig;
				break;
				case "w":
					query = /W/ig;
				break;
				case "r":
					query = /R/ig;
				break;
				case "f":
					query = /F/ig;
				break;
				case "s":
					query = /S/ig;
				break;
			}
		if ($(this).is(':checked') == true) {
			//alert("Checked");
			$("#courselist tr").each(function(i, e){
				var daytime = $(this).find("#time").attr("class");
				if( i == 0 ) return true;
				$(this).show();
				if( daytime.search(query) == 0 )
					$(this).show(1000);
			});
		}
		else {
			//alert("Unchecked");
			$("#courselist tr").each(function(i, e){
				var daytime = $(this).find("#time").attr("class");
				if( i == 0 ) return true;
				$(this).show();
				if( daytime.search(query) == 0 )
					$(this).hide(1000);
			});
		}
	});
	//Mouseover Room for tooltip GoogleMap
	$("span#mapTooltip").live("mouseenter",function(){
		//var bld_name; var geoLat; var geoLong;
		toThis = $(this); value= $(this).html();
		$.ajax({
			type: "POST",
			data: "r=getMapInfo&room="+value,
			url: "./include/mproxy.php",
			dataType: "xml",
			success: function(xml){
				$(xml).find('location').each(function(){
					bld_name = $(this).find('name').text();
					toThis.attr('name',bld_name);
					geoLat = $(this).find('lat').text();
					toThis.attr('lat',geoLat);
					geoLong = $(this).find('long').text();
					toThis.attr('long',geoLong);
				});		
			}
		});
		// GoogleMap Script ////////
		///////////////////////////////////////////////////////////////////////
		if((geoLat != '') && (geoLat != ''))
		{
			var locations = [
					[bld_name,geoLat,geoLong]
			];

			var map = new google.maps.Map(document.getElementById('map-canvas'), {
			  zoom: 16,
			  center: new google.maps.LatLng(40.742423, -74.178440),
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			var infowindow = new google.maps.InfoWindow();

			var marker, i;

			for (i = 0; i < locations.length; i++) {  
			  marker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
				map: map
			  });

			  google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
				return function() {
				  infowindow.setContent(locations[i][0]);
				  infowindow.open(map, marker);
				}
			  })(marker, i));
			  google.maps.event.addListener(marker, 'mouseout', function(marker, i) {
				infoWindow.close();
			  });
			}
			$("span#mapTooltip").toggle(function(){
					$('div#map-canvas').css({left: '670px', display: 'block'});
				},function(){
					$('div#map-canvas').css({left: '-2000px', display: 'none'}).html('');
			});
		}else {$('div#map-canvas').css({left: '-2000px', display: 'none'}).html('');}
		
	//////////////////////////////////////////////////////////////////
	});
	//input radio button for Sections List
	$("#courselist input[type=radio]").live("click", function() {
		$("#courselist input[type=radio]").removeClass("selected");
		$(this).addClass("selected");

		var array = $(this).parent().siblings();
		if( getArrData(array, 8) != "Open" ) {
			$(this).removeAttr("checked");
			$(this).removeClass("selected");
			return alert("Cannot add a closed section.");
		}
		var id = addCourse(array);
		if( (collide = checkCollision(getArrData(array, 5), id)) !== false ) {
			if( !confirm("Conflicting courses detected:\n\nClick \"Ok\" to remove " + collide + "\nor Click \"Cancel\" to remove " + id) ){
				$(this).removeAttr("checked");
				$(this).removeClass("selected");
				return removeCourse(id);
			}
			removeCourse(collide);
		}
		
		if( parseFloat($(".courses_cart span.totalcr").text()) > 19 ){
			alert("Maximum credits reached!!");
		}
	});
	
	
	//Schedule Grid & Display Sections Switcher
	$("a.viewschedule").live("click",function(){
		$("div#contents").hide();
		$("div#schedule").show();
		$(this).attr("class","hideschedule").html("Hide Schedule");
	});
	$("a.hideschedule").live("click",function(){
		$("div#schedule").hide();
		$("div#contents").show();
		$(this).attr("class","viewschedule").html("View Schedule");
	});
	
	//Show details of Added Courses
	$("header div#courses_cart span a").live('click',function(){
		if(parseInt($("span.totalcr").html()) != 0)
		{
			$("div#cart_details").show().bPopup({
				follow: [true, true], //x, y
				position: [150, 150], //x, y
				fadeSpeed: 'slow', //can be a string ('slow'/'fast') or int
				followSpeed: 1500 //can be a string ('slow'/'fast') or int
			});
		}
	});
	//Remove Course from Cart
	$("div#added_courses li").live("click",function() {
		if( !confirm("Are you sure you want to remove \"" +$(this).attr("class") + "\"?") ) return false;
		removeCourse($(this).attr("class"));
	});
	//Clear all added courses from cart & schedule view
	$("#clearall button").live('click',function(){
		if( !confirm("Are you sure you want to remove all courses?") ) return;
		for( course in currentSchedule ){
			if( !currentSchedule.hasOwnProperty(course) ) continue;
			removeCourse(course);
		}
	});
	//Excute js function to build time into schedule grid
	buildAgenda($("#table_agenda"));
	//FUNCTIONS/////////////////////////////////////////////////////////////////
	//Build the Schedule Grid
	function buildAgenda(o){
		for( i = 8; i < 24; i += 0.5 ){
			//var dtime = i * 100 + (i * 2 % 2 == 1 ? -20 : 0);
			o.append(
				$("<div />").addClass(function(){ return "row" + (i * 2 % 2 == 1 ? " alt" : ""); }).append(
					$("<div />").html(intToTime(i)).addClass("time bradius")
				)
			)
		}
	}
	//Convert 24hr time format to 12hr format
	function intToTime(i){
		var result = ":" + ( i * 2 % 2 == 1 ? "30" : "00") + " ";
		i = ~~i;
		return (i > 12 ? i - 12 : i) + result + (i > 11 ? "PM" : "AM");
	}
	function addCourse(array){
		var id = "";
		if( typeof array["Dept"] == "undefined") {
			id = getArrData(array, 1) + getArrData(array, 2);
			currentSchedule[id] = {
				"Dept" : getArrData(array, 1),
				"Course" : getArrData(array, 2),
				"Section" : getArrData(array, 3),
				"Call" : getArrData(array, 0),
				"Time" : getArrData(array, 5),
				"Room" : getArrData(array, 7),
				"Status" : getArrData(array, 8),
				"Max" : getArrData(array, 10),
				"Cur" : getArrData(array, 9),
				"Professor" : getArrData(array, 11),
				"Credits" : getArrData(array, 12)
			};
			//Recent Added Course history
			/*if( history.length > 8 )
				history.shift();
			history.push(currentSchedule[id]); */
		} else {
			id = array["Dept"] + array["Course"];
			currentSchedule[id] = array;
		}
		$("div#added_courses li." + id).remove();
		$("div#added_courses").append(
			$("<li />").addClass(id).html(
				currentSchedule[id]["Call"] + " " +
				currentSchedule[id]["Dept"] + " " +
				currentSchedule[id]["Course"] + " " +
				currentSchedule[id]["Section"] + " " +
				currentSchedule[id]["Professor"] + " " +
				"<span>" + currentSchedule[id]["Credits"] + "</span>"
			)
		);
		updateTable();
		return id;
	}
	function getArrData(array, index){
		if( typeof array["jquery"] != "undefined" )
		{ 	if(index !=5)
				return array.eq(index).html().replace("<br>", "\n").replace("<br />", "\n").trim();
			else 
				return array.eq(5).attr("class").replace("<br>", "\n").replace("<br />", "\n").trim();
		}
		return array[index];
	}
	function updateTable(){
		var c = 0,
			days = {
				"M" : 0,
				"T" : 1,
				"W" : 2,
				"R" : 3,
				"F" : 4,
				"S" : 5
			};
		var t_cs;
		$("div#added_courses span").each(function(i, e){
			c += parseInt($(this).html());
			t_cs=i;
		});
		if(!isNaN(t_cs)){t_cs=t_cs+1;}else{t_cs=0;}
		$(".courses_cart span.totalcr").html(c+'.00');
		$(".courses_cart span.totalcs").html('('+t_cs+')');

		$("#table td:not(.time, .day)").empty();
		for( course in currentSchedule ){
			if( !currentSchedule.hasOwnProperty(course) ) continue;
			$("#" + course).remove();
			var r = $("<div />");
			$(".overlays").append(
				r.attr("id", course)
							.addClass("courseParent")
							.append.apply(r, buildCourseOverlays(currentSchedule[course], days))
			)
		}

		// History
		/*$("#history ul").empty();
		for( i = history.length - 1; i >= 0; i-- ){
			var course = history[i];
			$("#history ul").append(
				$("<li />")
					.html(course["Dept"] + " " + course["Course"] + "-" + course["Section"])
					.data("schedule", history[i])
					.click(function(){
						addCourse($(this).data("schedule"));
					})
			)
		}*/
	}
	function buildCourseOverlays(courseObject, days){
		var times = buildTime(courseObject["Time"]),
			result = [];
		for( t in times ){
			if( !times.hasOwnProperty(t) ) continue;
			if( times[t][0] == -1 ) continue;

			var top = ( ( timeToDecimal(times[t][0]) - 500 )/50 + 3 ) * 28 + 35,
				left = days[t] * 160 + 115,
				rows = ( timeToDecimal(times[t][1]) - timeToDecimal(times[t][0]) )/50 + 1,
				height = rows * 23 - 9;

			result.push($("<div />").addClass("course")
				.css({
						position: "absolute",
						left: left,
						top: top,
						height: height,
						"text-align": "center",
						"background-color": "#FFF",
						"font": "bold 100% sans-serif"
						
					})
				.repeat(parseInt(rows-1), "<br />")
				.append(courseObject["Dept"] + " " + courseObject["Course"] + " " + courseObject["Section"] + "<br />(" + courseObject["Call"] + ") ")
				.data("obj", courseObject)
				.attr('title',courseObject["Dept"] + " " + courseObject["Course"] + " " + courseObject["Section"])
				.hover(function(){
					$(this).parent().find(".course").css({
						"box-shadow" : "0px 0px 20px #a8171c"
					});
				}, function(){
					$(this).parent().find(".course").css({
						"box-shadow" : "0px 0px 5px black"
					});
				})
				.click(function(){
					if( !confirm("Are you sure you want to delete \"" + $(this).parent().attr("id") + "\"?") ) return false;
					removeCourse($(this).parent().attr("id"));
				})
			);
		}
		return result;
	}
	function checkCollision(time, ignore) {
		var time1 = buildTime(time);
		for( key in currentSchedule ) {
			if( !currentSchedule.hasOwnProperty(key) || typeof currentSchedule[key] == "undefined" ) continue;
			if( ignore == key ) continue;
			var time2 = buildTime(currentSchedule[key]["Time"]);
			for( t in time2 ) {
				if( time1[t][0] == -1 || time2[t][0] == -1 ) continue;
				
				if( time1[t][0] > time2[t][0] && time1[t][0] > time2[t][1] || time1[t][0] < time2[t][0] && time1[t][1] < time[2][0] ) {
					continue;
				}
				return key;
			}
		}
		return false;
	}
	function removeCourse(key){
		if( typeof currentSchedule[key] != "undefined" )
			delete currentSchedule[key];
		$("#" + key).remove();
		$("li." + key).remove();
		updateTable();
		return false;
	}
	function buildTime(str){
		var obj = {
				"M" : [-1, -1],
				"T" : [-1, -1],
				"W" : [-1, -1],
				"R" : [-1, -1],
				"F" : [-1, -1],
				"S" : [-1, -1]
			},
			multiple = str.split("\n");
		for( i in multiple ){
			if( !multiple.hasOwnProperty(i) ) continue;
			str = multiple[i];
			var split = str.split(":");
			if( split.length != 2 ) return obj;
			
			for( j = 0; j < split[0].length; j++ ) {
				obj[ split[0][j] ] = [
					to24(split[1].split("-")[0]),
					to24(split[1].split("-")[1])
				];
			}
		}
		return obj;
	}
	function to24(str){
		str = str.trim();
		if( str.indexOf("PM") == -1 ) return parseFloat(str.replace("AM", ""));
		if( str.indexOf("PM") != -1 && str.indexOf("12") == 0 ) return parseFloat(str.replace("PM", ""));
		if( str.indexOf("AM") != -1 && str.indexOf("12") == 0 ) return parseFloat("00" + str.replace("AM", "").substring(2));
		
		str = str.replace("PM", "");
		if( str.length == 4 ) {
			i = parseFloat(str[0] + "" + str[1]) + 12;
			return parseFloat(i + str[2] + "" + str[3]);
		} else if( str.length == 3 ) {
			i = parseFloat(str[0]) + 12;
			return parseFloat(i + str[1] + "" + str[2]);
		}
	}
	function intToTime(i){
		var result = ":" + ( i * 2 % 2 == 1 ? "30" : "00") + " ";
		i = ~~i;
		return (i > 12 ? i - 12 : i) + result + (i > 11 ? "PM" : "AM");
	}
	function timeToDecimal(i){
		str = i + "";
		str = str.length == 3 ? "0" + str : str;
		str = str.substring(0, 2) + "" + Math.round((parseFloat(str.substring(2))* 100)/60);
		return parseFloat(str.length == 3 ? str + "0" : str);
	}
});