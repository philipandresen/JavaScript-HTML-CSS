/*
Beacon compatible protocol checker by Philip W. Andresen
Created Feb 26 2015
	
*/
var preset_select_html="<select id='preset_select' onchange='update_preset()'><option value='Select a preset'></option>";
for (i=0 ; i<Test_Library.length ; i++) {
	var test_option_str=Test_Library[i][0];
	preset_select_html=preset_select_html+"<option value='"+test_option_str+"'>"+test_option_str+"</option>";
}
preset_select_html=preset_select_html+"</select><br>";

var block_html=preset_select_html+"<button id='generate_button' onclick='generate_code_button()'>GENERATE CODE</button><br>"; //This is the block of script generated HTML that will be injected into the page.
block_html=block_html+"Asy|SSDX|Spro|VTSR <br>";
document.getElementById("Section0").innerHTML=block_html;
refresh_all();



function refresh_all() {
	var block_html='';
	var input_id_list=[""];
	var current_imported_test=[];
	var preloaded_test_case='null';
	for (k=0 ; k<Test_Library.length ; k++) {
		var current_testname=Test_Library[k][0];
		if (current_testname==document.getElementById("testname").value) {//if the text box name corresponds to an existing test case;
			preloaded_test_case=Test_Library[k];
			alert("Successfully loaded test information");
		}
	}

	for (i=0 ; i<Question_Library.length ; i++) { //Question_Library is defined in SNAP_QUEST_LIB.js
		var question_type=Question_Library[i][1];
		var current_question_submatrix=Question_Library[i];
		var current_question_id="QID_"+current_question_submatrix[0];

		//IN here we're going to have to put some code that will grab the full matrix from the snaptestlib that we can import directly as we generate the page.
		//THis might need to be changed to a refresh function, the only problem is that if we make it dependent we're going to have to have a default matrix
		//for the case where no data is available for the string that is input into the field at the top of the screen.
		//We need to AUTOGENERATE this. That's the biggest problem because the default case will change in size.
		//Lets go for the import case first because that's a little easier to define right now.
		//alert(current_question_submatrix);
		var num_answers=current_question_submatrix.length-3;
		var html_segment="";
		//////////////////////////////////////////////////////
		var current_question_imported_data='null'; // going to have to loop through input again to be sure we get the right QID.
		if (preloaded_test_case !== 'null'){
			for (m=0 ; m<preloaded_test_case.length ; m++) {
				if (preloaded_test_case[m][0]==current_question_submatrix[0]) {//if QID from test case matches with QID of the question we are on
					current_question_imported_data=preloaded_test_case[m]; // import the data from this specific question
				}
			}
		} 
		/////////////////////////////////////////////////
		switch (question_type) {
			case 0: //Plain text
				
				break;
			case 1: //Dropdown menu 
				//html_segment=current_question_id+"<br>";
				//Loop through all available answers and add them as options.
				for ( j=0 ; j<num_answers ; j++) {
					var def_sel=[0,0,0,0,0,0];
					if (current_question_imported_data !== 'null') {//IF WE IMPORTED THE QUESTION DATA EARLIER
						var cur_quest_defval=current_question_imported_data[j+2];//(first two elements of testlib array are skipped)
						def_sel[(cur_quest_defval+1)]=1;
						//alert(current_question_imported_data);
					} else {def_sel[0]=1;}
					var current_option_id=current_question_id+"_"+j;
					html_segment=html_segment+"<select id=CHi"+i+"j"+j+">"+
						"<option value=-1 "+(def_sel[0]==1 ? "selected":"")+">Hidden</option>"+
						"<option value=0 "+(def_sel[1]==1 ? "selected":"")+">WRONG</option>"+
						"<option value=1 "+(def_sel[2]==1 ? "selected":"")+">Right</option>"+
						"<option value=2 "+(def_sel[3]==1 ? "selected":"")+">Unknown</option>"+
						"</select>"
					html_segment=html_segment+current_question_submatrix[j+3]+"<br>";
				}
				
				break;
			default: 
				html_segment="X";
				
		}
		var cur_ana_defval=[0,0,0,0,0,0];
		if (current_question_imported_data !== 'null') {
			var cur_ana_defval=current_question_imported_data[1];
		}
		//alert(current_question_imported_data);
		block_html=block_html+i+". <br>"+
			"<input type='checkbox'" + (cur_ana_defval[0]==1 ? "checked":"") + " id='Q"+i+"_Asy'>"+" RA <b>"+current_question_submatrix[2][0]+"</b><br>"+
			"<input type='checkbox'" + (cur_ana_defval[1]==1 ? "checked":"") + " id='Q"+i+"_SSDX'>"+" SS <b>"+current_question_submatrix[2][1]+"</b><br>"+
			"<input type='checkbox'" + (cur_ana_defval[2]==1 ? "checked":"") + " id='Q"+i+"_SPro'>"+" SP <b>"+current_question_submatrix[2][2]+"</b><br>"+
			"<input type='checkbox'" + (cur_ana_defval[3]==1 ? "checked":"") + " id='Q"+i+"_Quant'>"+" SQ <b>"+current_question_submatrix[2][3]+"</b><br>"+
			"<input type='checkbox'" + (cur_ana_defval[4]==1 ? "checked":"") + " id='Q"+i+"_Srdr'>"+" SR <b>"+current_question_submatrix[2][4]+"</b><br>"+
			"<input type='checkbox'" + (cur_ana_defval[5]==1 ? "checked":"") + " id='Q"+i+"_Foal'>"+" FO <b>"+current_question_submatrix[2][5]+"</b><br>";
		
		block_html=block_html+html_segment+"<br>";
		input_id_list[i]=current_question_id;

	}
	document.getElementById("Section1").innerHTML=block_html;
}

function generate_code_button() {
	var textout="[\""+document.getElementById("testname").value+"\"";
	for (i=0 ; i<Question_Library.length ; i++) {
		var current_question_submatrix=Question_Library[i];
		var num_answers=current_question_submatrix.length-3;
		var analyser_array=[
			+document.getElementById("Q"+i+"_Asy").checked,
			+document.getElementById("Q"+i+"_SSDX").checked,
			+document.getElementById("Q"+i+"_SPro").checked,
			+document.getElementById("Q"+i+"_Quant").checked,
			+document.getElementById("Q"+i+"_Srdr").checked,
			+document.getElementById("Q"+i+"_Foal").checked]
		textout=textout+",["+current_question_submatrix[0]+",["+analyser_array+"]";
		for ( j=0 ; j<num_answers ; j++) {
			textout=textout+","+document.getElementById("CHi"+i+"j"+j).value;
			}
		textout=textout+"]";
	}
textout=textout+"]";
var resultwindow = window.open("about:blank", "Results","width=640 height=480");//About:blank is required for IE8 compatibility
	resultwindow.document.write("<html><body>" + textout + "</body></html>");

}

function update_preset() {
	var preset_text=document.getElementById('preset_select').value;
	document.getElementById('testname').value=preset_text;
	refresh_all();
}