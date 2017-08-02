function NoteReset(){
	var notename = document.getElementById('notename');
	notename.value = "";
	var notedesc = document.getElementById('notedesc');
	notedesc.value = "";
	var notedue = document.getElementById('notedue');
	notedue.value = "";
	var cameraImage = document.getElementById('cameraImage');
	cameraImage.src = "";
	cameraImage.src = "";
	cameraImage.style.display = 'none';
	cameraImage.style.visibility = 'hidden';
	// add more for other fields if needed for create note
	
	//update in main page records
	var noteimage = document.getElementById('note-image');
	noteimage.innerHTML=""; //clear content of div note-image
	
	var map = document.getElementById('map');
	map.src = "";
	map.src = "";
	map.style.display = 'none';
	map.style.visibility = 'hidden';
	
	document.getElementById('cur_position').innerHTML = "";

	
}

/*function ClearTempNoteRecords() {
	var noteimage = document.getElementById('note-image');
	noteimage.innerHTML=""; //clear content of div note-image
}*/

function TaskReset(){
	var taskname = document.getElementById('taskname');
	taskname.value = "";
	var taskdesc = document.getElementById('taskdesc');
	taskdesc.value = "";
	var taskdue = document.getElementById('taskdue');
	taskdue.value = "";
	// add more for other fields if needed.
}