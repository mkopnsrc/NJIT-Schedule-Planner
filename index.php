<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="description" content="NJIT Schedule Builder">
	<?php require('./include/header_lib.php'); ?>
	<title>NJIT Schedule Builder</title>
</head>
<body id=contents>
	<header id=header class=bradius>
		<h1><a href=""><img src="./img/logo.png" alt="New Jersey Institute of Technology Schedule Builder" width="230" height="70" id="njitlogo"/></a>
		</h1>
		<div id=courses_cart>
			<span>
				<a class=courses_cart rel="#overlay">
					<img alt="Added Coursed" src="./img/scart.png"/> 
					<span class=totalcr title="Total Credits">0.00</span> 
					<span class=totalcs title="Total Courses">(0)</span>
				</a>
			</span>
		</div>
		<div id=nav_menu>
			<span class="nav_l">
				<a class="selection">Select</a>
				<a class="searchby">Search</a>
				<a class="filters">Filters Option</a>
			</span>
			<span class="nav_r">
				<a class="viewschedule">View Schedule</a>
			</span>
		</div>
	</header>
	<div id=cart_details class=popup>
		<span class="button bClose"><span>X</span></span>
		<span id=titlebar class=bradius>Added Courses</span>
		<div id=added_courses class=bradius> </div>
		<div id="clearall"><button>Remove all courses</button></div>
	</div>
	<div id=features class=bradius>
		<div id="selection">
			<div class="wizard-steps">
				<div id=step class="active-step"><span>1</span><select id=semesterid name=semesterid></select></div>
				<div id=step><span>2</span><select id=majorid name=majorid disabled /></select></div>
				<div id=step><span>3</span><select name=courseid id=courseid disabled /></select></div>
			</div>
		</div>
		<div id="searchby">
			<div class="wizard-steps">
				<div id=step class="active-step"><span>1</span><select id=semesterid name=semesterid></select></div>
				<div id=step><span>2</span><select id=qtype name=qtype disabled>
												<option value>Select search type</option>
												<option value="profq">Professor</option>
												<option value="call">Call Number</option>
											</select></div>
				<div id=step><span>3</span><input type=text name=searchq id=searchq value /></div>
			</div>
		</div>
		<div id="filters">
			<fieldset class=time><legend class=bradius>Time</legend>
				<input type=radio class=sortbytime name=checkboxlist value=all checked />
				<span>ALL</span>
				<input type=radio class=sortbytime name=checkboxlist value=am />
				<span>AM</span>
				<input type=radio class=sortbytime name=checkboxlist value=pm />
				<span>PM</span>
			</fieldset>
			<fieldset class=days><legend class=bradius>Days</legend>
				<input type=checkbox class=sortbyday name=m title="Classes being offerd on Monday" value=m checked />
				<span>Mon</span>
				<input type=checkbox class=sortbyday name=t title="Classes being offerd on Tuesday" value=t checked />
				<span>Tue</span>
				<input type=checkbox class=sortbyday name=w title="Classes being offerd on Wednesday" value=w checked />
				<span>Wed</span>
				<input type=checkbox class=sortbyday name=r title="Classes being offerd on Thursday" value=r checked />
				<span>Thu</span>
				<input type=checkbox class=sortbyday name=f title="Classes being offerd on Friday" value=f checked />
				<span>Fri</span>
				<input type=checkbox class=sortbyday name=s title="Classes being offerd on Saturday" value=s checked />
				<span>Sat</span>
			</fieldset>
		</div>
	</div>
	<div id=contents class=bradius>
		<h2>Welcome to NJIT Schedule Planner</h2>
	</div>
	<div id=schedule class=bradius>
		<h2 id="content_title">Schedule Grid</h2>
		<div id="table">
			<div id="table_agenda">
				<div class="row thead">
					<div class="time">&nbsp;</div>
					<div class="day">Mon</div>
					<div class="day">Tue</div>
					<div class="day">Wed</div>
					<div class="day">Thu</div>
					<div class="day">Fri</div>
					<div class="day">Sat</div>
				</div>
			</div>
			<div class="overlays"></div>
		</div>
	</div>
	<div id=map-canvas></div>
</body>
</html>