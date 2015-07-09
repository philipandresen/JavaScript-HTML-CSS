
//Question_Library should have : [Qid,Atype,Ttype,text] where 'Qid' is an identifier and 'Ttype' tells us what kind of user input. 
//Atype: 0=basic text 1=select 2=checkbox

var tday=new Date();
var todaysdate=tday.getFullYear() + "/" + (tday.getMonth()+1) + "/" + tday.getDate();

var Question_Library = [
[0,1,
	[
	"Q: Rapid Assay", //RA
	"Q: Rapid Assay SSDX", //RASSDX
	"Q: Snap Pro", //RASP
	"Q: Quant SSDX", //QUANTSSDX
	"Q: VetTest Snap Reader", //VTSR
	"Q: Snap Foal IGG" //FOAL
	]
,"Answer 1"
,"Answer 2"
,"Answer 3"
//...
,"Answer 20,000"
]
//Sensitive information deleted. No public available data
];