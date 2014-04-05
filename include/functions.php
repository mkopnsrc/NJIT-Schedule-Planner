<?php
function sendToBackend($post)
{	$url = 'http://web.njit.edu/~vjb5/cs490_proj/process.php';
	$c = curl_init();
	curl_setopt($c, CURLOPT_HTTPHEADER, array('Content-Type' => 'application/xml'));
	curl_setopt($c, CURLOPT_URL, $url);
	curl_setopt($c, CURLOPT_POST, true);
	curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($c, CURLOPT_POSTFIELDS, $post);
	$result = curl_exec($c);
	curl_close ($c);
	return $result;
}
function min2time($start, $min){
	$time = "+".$min." minutes";
	$endtime = date('H:i',strtotime($start.$time));
	return $endtime;
}
function addSectionToSession($result) {
	//include('session.php');
	$sections = new SimpleXMLElement($result);
	//print_r ($time = $sections->xpath('//sections/section'));
	
	foreach ($sections as $section) {
		$call = $section->call;   // returns CRN / Call number
		$subject = $section->subject;   // returns subject name ex. ACCT, CS
		$courseId = $section->course['id'];   // returns course id ex. 115, 241
		$course = $section->course;   // returns course name
		$sectionId = $section['id'];   // returns section id ex. 001, 101
		$status = $section->status;   // returns status
		$cur = $section->enrollment['cur'];   // returns current room seats occupied
		$max = $section->enrollment['max'];   // returns max room capacity
		$instructor  = $section->instructor ;   // returns instructor name
		$credits = $section->credits;   // returns credits of class
		//echo $subject.' '.$courseId.' '.$course.' '.$sectionId.' ';
		if($status == 'Open')
		{
			foreach($section->days->children() as $index=>$day)
			{
				$stime = $day->time;
				$duration = $day->duration;
				$room = $day->room;
				$day = $day['id'];
				$etime = min2time($stime,$duration);
				//echo $day.' '.$stime.' - '.$etime.' '.$room.' ';
				
				//if(!isset($_SESSION)){
					$session_days[] = array(
						'day' => $day,
						'stime' => $stime,
						'etime' => $etime,
						'room' => $room,				
					);
				/*}else {
					
					if($ch_f_time >= $from_time && $ch_f_time <= $to_time) { 
						echo "INBETWEEN<br />";     
					} else { 
						echo "NOT INBETWEEN<br />";
					}
				}*/
			}
		
		if(!isset($_SESSION['schedule']))
		{	$_SESSION['schedule'][] = $set_sections = array (
				'call' => $call,
				'subject' => $subject,
				'courseid' => $courseId,
				'course' => $course,
				'sectionid' => $sectionId,
				'days' =>	$session_days,
				'status' => $status,
				'cur' => $cur,
				'max' => $max,
				'instructor' => $instructor,
				'credits' => $credits,
			);
			$secs = $set_sections;
			serialize($secs);
			//print_r($_SESSION['schedule']);
			echo '<success id="'.$_SESSION['schedule'][0]['call'].'">'.$_SESSION['schedule'][0]['subject'].' '.$_SESSION['schedule'][0]['courseid'].' '.$_SESSION['schedule'][0]['sectionid'].' Successfully Added!</success>';
			setcookie('sections','',time()+360);
		}else
		{
			for($a=0; $a< sizeof($_SESSION['schedule']); $a++)
			{	//if($call != $_SESSION['sections'][$a]['call'])
				if(!array_key_exists($call, $_SESSION['schedule'][$a]['call']))
				{	$_SESSION['schedule'][] = $set_sections = array (
						'call' => $call,
						'subject' => $subject,
						'courseid' => $courseId,
						'course' => $course,
						'sectionid' => $sectionId,
						'days' =>	$session_days,
						'status' => $status,
						'cur' => $cur,
						'max' => $max,
						'instructor' => $instructor,
						'credits' => $credits,
					);
					//echo sizeof($_SESSION['sections']);
				}
			return '<success id="'.$_SESSION['schedule'][$a]['call'].'">'.$_SESSION['schedule'][$a]['subject'].' '.$_SESSION['schedule'][$a]['courseid'].' '.$_SESSION['schedule'][$a]['sectionid'].' Successfully Added!</success>';
			}	//if($call != $_SESSION['sections'][$a]['call'])
					//echo $call;
		}
		echo session_id();
		}else { echo '<success id="'.$call.'">Cannot add closed section! \n'.$subject.' '.$courseId.' '.$sectionId.'</success>';}
	}
	
}

?>