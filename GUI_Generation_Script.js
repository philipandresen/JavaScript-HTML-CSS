/*
Beacon compatible protocol checker by Philip W. Andresen
Created Feb 26 2015
	
*/

//Generate test menu options here
var new_html_block="";
for (i=0 ; i<Test_Library.length ; i++) {
	testname=Test_Library[i][0];
	new_html_block=new_html_block+"<option id=testoption"+i+" value='"+testname+"'>"+testname+"</option>";
}
document.getElementById("test_select_section").innerHTML="<select onchange=\"update_hidden_elements();update_correctness();\" id='test_select_menu'>"+new_html_block+"</select>"
////////////////////

//C to F converter 
/*var converter_html="";
converter_html="&nbsp&nbsp&nbsp&nbsp<input type=\"text\" id='C_input' onchange='C_2_F(0)' size=2></input><button>&degC = &degF</button><input type=\"text\" id='F_input' onchange='C_2_F(1)' size=2></input>";
document.getElementById('converter_section').innerHTML=converter_html;*/

//Main question and HTML generator code
var finalized_QID_list=[];
var block_html=""; //This is the block of script generated HTML that will be injected into the page.
for (i=0 ; i<Question_Library.length ; i++) { //Question_Library is defined in SNAP_QUEST_LIB.js
	var current_question_id="NONE"+i; //Default value, should be overwritten
	var current_question_submatrix=Question_Library[i];//the array within Question_Library that corresponds to our current question (i)
	var universal_QID=current_question_submatrix[0];//Each question has a unique ID which the code uses to associate relevant info. (ex: 0, 1, 2, ... 48, etc)
	var question_type=current_question_submatrix[1];//second element of submatrix defines the type of question (text or dropdown)
	var current_question_id="QID_"+universal_QID; //This is the ID of the element we are about to create in the HTML. (Ex: QID_1, QID_27, QID_48, etc)
	var num_answers=current_question_submatrix.length-3; //The first three elements are the question ID, question type, and actual question text.
	var html_segment=""; //separate section of HTML which will be inserted into block_html.
	switch (question_type) {
		case 0: //Plain text
			html_segment="<input type=\"text\" id=\""+current_question_id+"\" size=20 onchange=\"update_correctness()\"></input>";
			break;
		case 1: //Dropdown menu 
			html_segment="<select id=\""+current_question_id+"\" onchange=\"update_correctness()\"><option value=0>Info not captured</option>";
			
			for ( j=0 ; j<num_answers ; j++) { //Loop through all available answers and add them as options.
				var current_option_id=current_question_id+"_"+j;//This, again, is the option element ID in HTML (ex: QID_1_0, QID_1_1, QID_2_3, etc)
				html_segment=html_segment+"<option id="+current_option_id+">"+current_question_submatrix[j+3]+"</option>";
			}
			html_segment=html_segment+"</select>";
			
			//Add extra text comment box at the end of the dropdown menu for detailed notes
			html_segment=html_segment+"<button id='button_notes"+universal_QID+"' onclick='toggle_notes_function("+universal_QID+")'>+</button>";
			html_segment=html_segment+"<input type='text' id='protocol_detail" +universal_QID+ "' size=1 style='visibility:hidden'></input>";
			break;
		default: 
			html_segment="X";
			
	}
	explanation_contents="This is the default explanation text";
	for (j=0 ; j<Explanation_Library.length ; j++) { //search through the explanation library 
		if (Explanation_Library[j][0] == universal_QID) { //for the corresponding Question ID
			explanation_contents=Explanation_Library[j][1] //and capture the text stored there.
		}
		
	}
	//add text that can be hidden/expanded that will show explanation of the questions/answers
	html_explanation_button="<button id='button_explain"+universal_QID+"' onclick='toggle_explain_function("+universal_QID+")'>?</button>";
	html_explanation_text="<span id='explain_detail" +universal_QID+ "' style='display:none; background:#D9D9D9'>"+explanation_contents+"</span>";
	
	/*Each question section (Question text with answers and expandable text boxes) is grouped
	in a <span> element with ID : Qparagraph1, Qparagraph2, Qparagraph3, etc.
	This ID is referenced later in the code.
	In the lines below, we create this <span> element for a single question
	and append it to block_html*/
	block_html=block_html+"<span id='Qparagraph"+universal_QID+"' style='display:none;'>"+"<img id='qstatusimage"+universal_QID+"' src='blksqr.png' align='left'></img> &nbsp"+
		"<b id=Qquestiontext"+universal_QID+">"+current_question_submatrix[2]+"</b>"+"<br>"+html_explanation_button+html_segment+html_explanation_text+"<br><br></span>";

}
//after looping through all questions and answers, write the block of html that was generated to the main document.
document.getElementById("section_one").innerHTML=block_html;
finalized_QID_list=update_hidden_elements();
////////////////////////////////////////////

function update_hidden_elements() { //Updates which items are visible and which items are hidden
	var finalized_QID_list=[]; //List of question IDs that are going to be visible
	var FQL_index=0; //This is an index to keep track of where in the finalized_QID_list we are writing.
	var analyser_setting=document.getElementById('analyser_select_menu').value; //get the relevant analyser from the dropdown menu selection.
	for (i=0 ; i<Test_Library.length ; i++) { //look through all the test names
		var testname1=Test_Library[i][0]; //load the i'th test name from the library to check if it matches
		var testname2=document.getElementById("test_select_menu").value; //get the test name that was selected by the user
		if (testname1==testname2) {  //does this name match what we've chosen? If not we skip this loop iteration.
			for (j=0 ; j<Question_Library.length ; j++) { //look though all questions in the question library
				var QID=Question_Library[j][0]; //get the question ID for the J'th question
				for (k=1 ; k<Test_Library[i].length ; k++) {//loop through all the information for the user selected test
					if (Test_Library[i][k][0]==QID) { //Does the test we've selected have a definition for this question? If not, we skip this iteration
						if (Test_Library[i][k][1][analyser_setting]==1) { 
							/*Test_Library[i][k][1] is a logical array that looks like [0,0,1,0].
							analyser_setting is a number between 0 and 3 (defined by the user) 
							0=standalone
							1=SSDX
							2=SPro
							3=VET TEST SNap reader
							so if the analyser_setting is 0, we check Test_Library[i][k][1][0]
							to see if the current question is enabled for standalone tests
							If the question is enabled for this analyser, we set the display style to 'block' (visible)
							*/
							document.getElementById("Qparagraph"+QID).style.display = 'block';
							document.getElementById("Qquestiontext"+QID).innerHTML = Question_Library[j][2][analyser_setting];
							//alert(Test_Library[i][k]+"  |  "+Question_Library[j][2]); //debug
						} 
						else {//Otherwise we set it to 'none' (invisible)
							document.getElementById("Qparagraph"+QID).style.display = 'none';
						}
						//Then if the current question we're iterating through has *not* been set to *invisible*
						if (document.getElementById("Qparagraph"+QID).style.display != 'none') {
							finalized_QID_list[FQL_index++]=QID; // add this question's ID to the final list of IDs visible.
						}
						if (Test_Library[i][k].length>2) for (m=2 ; m<Test_Library[i][k].length ; m++) { //Does this question have answers defined?
							var answer_value=Test_Library[i][k][m]; //Starting with the third element [m=2] of this question (corresponds to the first answer 'correctness' value) 
							if ( document.getElementById("QID_"+QID+"_"+(m-2)) ) { //If an option has been created for this answer 
								document.getElementById("QID_"+QID+"_"+(m-2)).value=answer_value; //set this option's value to the 'correctness' value (-1 for hidden, 0 or wrong, 1 for right, and 2 for unknown)
							} else {break;} //otherwise if we have answers defined for options that do not exist, do nothing.
							switch (answer_value) { //(-1 for hidden, 0 or wrong, 1 for right, and 2 for unknown)
								case 0: //continue if wrong
								case 1: //continue if right
								case 2: //continue if unknown
									//Here we have three independent methods of making the options visible. 
									document.getElementById("QID_"+QID+"_"+(m-2)).style.display='block'; //Works in chrome
									document.getElementById("QID_"+QID+"_"+(m-2)).disabled=false; //Works in IE8
									document.getElementById("QID_"+QID+"_"+(m-2)).hidden=false;  //Works with HTML5
									break;
								default: //if not wrong, right, or unknown: hide/disable the option
								document.getElementById("QID_"+QID+"_"+(m-2)).style.display='none'; //Works in chrome
									document.getElementById("QID_"+QID+"_"+(m-2)).disabled=true; //Works in IE8
									document.getElementById("QID_"+QID+"_"+(m-2)).hidden=true; //Works with HTML5
									break;
							}
						}
					}
				}
			}
		}
	}
return finalized_QID_list; //Return the list of question IDs that are visible.
}

function toggle_notes_function(id) {//A small function to make collapsable note blocks at the end of each question.
	//Get the visibility of the text box that corresponds to the input question ID.
	var visi=document.getElementById("protocol_detail" + id).style.visibility; 
	//Change the visibility
	if (visi=="visible") { //if visible
		document.getElementById("protocol_detail" + id).style.visibility="hidden";
		document.getElementById("protocol_detail" + id).size=1;
		document.getElementById("button_notes"+id).innerHTML="+";
	}
	if (visi=="hidden") { //if hidden
		document.getElementById("protocol_detail" + id).style.visibility="visible";
		document.getElementById("button_notes"+id).innerHTML="-";
		document.getElementById("protocol_detail" + id).size=30;
	}
}

function toggle_explain_function(id) {//A small function to make collapsible explanation blocks at the end of each question.
	//Get the visibility of the explanation box that corresponds to the input question ID.
	var visi=document.getElementById("explain_detail" + id).style.display;
	//change visibility
	if (visi=="none") { //if visible
		document.getElementById("explain_detail" + id).style.display="block";
		document.getElementById("button_explain"+id).innerHTML="-";
	} else { //if not visible (we can't guarantee it will be 'block')
		document.getElementById("explain_detail" + id).style.display="none";
		document.getElementById("button_explain"+id).innerHTML="?";
	}
}

function outputfunction() {//Generate the final output text based on what's on the screen
	update_correctness(); //Make sure we update this before generating output.
	var SHOW_ONLY_INCORRECT=0;//Change this to output only incorrect answers or answers where user has manually typed information.
	var analyser_setting=document.getElementById('analyser_select_menu').value; //get the relevant analyser from the dropdown menu selection.
	var finalized_QID_list=update_hidden_elements(); //make sure everything is visible/invisible that should be and get the final list of IDs
	var beacon_friendly_text="";//This will store the copyable text for beacon
		for (i=0 ; i<finalized_QID_list.length ; i++) { //go through each ID that is visible
			var current_QID=finalized_QID_list[i]; //Defined just to reduce visual clutter, current_QID will be an integer (0, 1, 2 ... 48, etc)
			for (j=0 ; j<Question_Library.length ; j++) { //Look through the question library at all questions
				var question_submatrix=Question_Library[j]; //grab the question and associated data (ex : [question ID, question type, question text, answer 1, answer 2, ... answer x])
				if (question_submatrix[0]==current_QID) { //if the ID of this question matches the question we are looking for...
					var thisquestion_id = "QID_"+current_QID; //The HTML ID of the current question element. This would have been defined on line 29 (QID_0, QID_1, etc)
					var thisquestion_accessory_text_id="protocol_detail"+current_QID; //the HTML ID of the expandable text box (also predefined, near line 47)
					var thisquestion_accessory_text=""; //Default blank, in case it can't be loaded
					
					if (document.getElementById(thisquestion_accessory_text_id)) {//if accessory text exists
						thisquestion_accessory_text=document.getElementById(thisquestion_accessory_text_id).value; //grab it and set aside
					}
					
					if (document.getElementById(thisquestion_id).value==1) {
						if (SHOW_ONLY_INCORRECT==1 && thisquestion_accessory_text=="") { //make sure Q is wrong OR has user typed text.
							continue;
						}
					}
					
					beacon_friendly_text=beacon_friendly_text+"<b>"+(i+1)+". "+ question_submatrix[2][analyser_setting]+"</b><br>&nbsp&nbsp&nbsp"; //"<b>1. This is the question text!</b> <br> (indent)"
					switch (question_submatrix[1]) {//What kind of input was this? 
						case 1: //if this is a dropdown type question
							var selection_index=document.getElementById(thisquestion_id).selectedIndex; //what option did the user select? (0, 1, 2, 3... etc)
							var answer_text=document.getElementById(thisquestion_id).options[selection_index].text; //What is the text of that option? ("answer text!")
							beacon_friendly_text=beacon_friendly_text+answer_text // Add the answer text (we did a line break and indent already, line 184)
							if (document.getElementById(thisquestion_id).value==0) { //Mark as wrong if wrong;
								beacon_friendly_text=beacon_friendly_text+" ***"; //We use an asterisk marker for wrong answers
							}
							beacon_friendly_text=beacon_friendly_text+"<br>"; //Add a new line
							if (document.getElementById("protocol_detail"+current_QID).style.visibility=="visible") { //if the collapsible text input is visible
								beacon_friendly_text=beacon_friendly_text+thisquestion_accessory_text+"<br>"; //add the text from there and add a new line
							}
							break;
						case 0: //if this is a normal text box
							var answer_text=document.getElementById(thisquestion_id).value; //Get the string that is in there
							beacon_friendly_text=beacon_friendly_text+answer_text+"<br>"; //add the string as an answer and make a new line
							break;
						default: //if we have defined a question type that is not a dropdown or a textbox
							beacon_friendly_text=beacon_friendly_text+"ERROR! Undefined question type in SNAP_QUEST_LIB2.js"; //Print an error to the final text
							break;
					}
				}
			}
		}
	var resultwindow = window.open("about:blank", "Results","width=640, height=480, scrollbars=yes");//About:blank is required for IE8 compatibility
	resultwindow.document.write("<html><body>" + beacon_friendly_text + "</body></html>");
	//document.getElementById("section_three").innerHTML=beacon_friendly_text;
	return beacon_friendly_text;
}

function update_correctness() {
	var finalized_QID_list=update_hidden_elements();
	for (i=0 ; i<finalized_QID_list.length ; i++) {
		var current_QID=finalized_QID_list[i]
		switch (+document.getElementById("QID_"+current_QID).value) {
			case 0: //wrong
				document.getElementById("qstatusimage"+current_QID).src="redsqr.png";
				break;
			case 1: //right
				document.getElementById("qstatusimage"+current_QID).src="grnsqr.png";
				break;
			case 2: //unknown
				document.getElementById("qstatusimage"+current_QID).src="ornsqr.png";
				break;
			default: //N/A
				document.getElementById("qstatusimage"+current_QID).src="blksqr.png";
				break;
		}
	}
}

function C_2_F(input_type) { //Converts Celsius to Fahrenheit and back.
var input_temp;
	switch (input_type) {
		case 0:
			input_temp=parseFloat(document.getElementById('C_input').value);
			document.getElementById('F_input').value=input_temp*(9/5)+32;
			break;
			
		case 1:
			input_temp=parseFloat(document.getElementById('F_input').value);
			document.getElementById('C_input').value=(input_temp-32)*5/9;
			break;
	}
}