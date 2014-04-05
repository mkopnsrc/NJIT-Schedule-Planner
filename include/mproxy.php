<?php
header('Content-Type: application/xml; charset=UTF-8');
if(!empty($_GET))
	$_POST = $_GET;

$post = $_POST;
include('./functions.php');

switch($_POST['r']){
	case 'semesters':
		//r: semesters
		if($_POST['r'] == 'semesters'){
			$result = sendToBackend($post);
			echo $result;
		}
	break;
	case 'subjects':
		//r: subjects & semester: semesterID
		if(($_POST['r'] == 'subjects') && ($_POST['semester'] != '')){
			$result = sendToBackend($post);
			echo $result;
		}
		
	break;
	case 'instructors':
		//r: instructors & semester: semesterID
		if(($_POST['r'] == 'instructors') && ($_POST['semester'] != '')){
			$result = sendToBackend($post);
			//echo $result;
			$xml = new SimpleXMLElement($result);
			foreach ($xml->children() as $node) {
				$arr = $node->attributes();   // returns an array
				$items[] = "{$node} - {$arr['id']}";
			}
			// 2. sorting (by Professor's Full Name)
			sort($items);
			// 3. printing sorted result
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo '<list>';
			foreach ($items as $item) {
				$item = explode(' - ', $item);
				echo '<instructor id="'.$item[1].'">'.$item[0].'</instructor>';
			}
			echo '</list>';
		}
	break;
	case 'courses':
		//r: courses & semester: semesterID & subject: subjectID
		//r: courses & semester: semesterID & instructor: instructorID
		if(($_POST['r'] == 'courses') && ($_POST['semester']!='') && ($_POST['subject'] != '')){
			$result = sendToBackend($post);
			echo $result;
		}
		if(($_POST['r'] == 'courses') && ($_POST['semester']!='') && ($_POST['instructor'] != '')){
			$result = sendToBackend($post);
			echo $result;
		}
	break;
	case 'sections':
		//r: sections & semester: semesterId & subject: subjectId & course: courseId
		if(($_POST['r'] == 'sections') && ($_POST['semester']!='') && ($_POST['subject'] != '') && ($_POST['course'] != '')){
			$result = sendToBackend($post);
			echo $result;
		}
	break;
	case 'addSection':
		//r: addSection & call: callNumber
		if(($_POST['r'] == 'addSection') && ($_POST['call'] != '')){
			$calls = explode(',', $_POST['call']);
			sort($calls);
			echo '<?xml version="1.0" encoding="UTF-8"?>'; 
			echo '<list><status>';
			//header('Content-Type: text/html; charset=UTF-8');
			
			foreach( $calls as $i=>$call)
			{	if(($call) && (strlen($call) == 5))
				{	$post = array('r' => 'info', 'call' => $call);
					//print_r($post);
					$result[$i] = '<sections>';
					$result[$i] .= sendToBackend($post);
					$result[$i] .= '</sections>';
					//echo $result[$i];
					$session_status .= addSectionToSession($result[$i]);
				}
			}
			
			//echo sizeof($result);
			echo $session_status;
			echo '</status></list>';
			//header('Location: schedule.php');
			/*
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo "<status>";
				echo '<success id="'.$_POST['call'].'">Underconstruction...</success>';
			echo "</status>";
			*/
			//Session Starts for Saving the Schedule
			
			
		//r: addSection & semester: semesterId & subject: subjectId & course: courseId
		}else if (($_POST['r'] == 'addSection') && ($_POST['semester']!='') && ($_POST['subject'] != '') && ($_POST['course'] != '')){
			$result = sendToBackend($post);
			echo '<?xml version="1.0" encoding="UTF-8"?>';
			echo "<status>";
				echo '<success>No Call Number Passed..</success>';
			echo "</status>";
		
		}
	break;
	case 'dropSection':
		//r: dropSection & call: callNumber
		if(($_POST['r'] == 'dropSection') && ($_POST['call'] != '')){
			session_destroy();
			unset($_SESSION);
			
		}
	break;
	case 'info':
		//r: info & call: callNumber
	
	break;
	case 'min2time':
		if(($_POST['start_time'] != '') && ($_POST['mins'] != '')){
			echo '<?xml version="1.0" encoding="UTF-8"?><list>';
			echo "<endtime>". min2time($_POST['start_time'], $_POST['mins'])."</endtime></list>";
		}
	break;
	default:
		die("Oopps!!, Wrong request made!");
	break;
}

?>