NOTELIST = (function() {
    var MILLISECONDS_TO_DAYS = 86400000;
    
    function showNoteDetails(selector, note) {
        var container = jQuery(selector),
            daysDue = note.getDaysDue();
        
        // update the relevant note details
        container.find(".note-name").html(note.name);
        container.find(".note-description").html(note.description);
        if (note.imagepath == "") {
        	//alert("note imagepath is null");
        	//force to clear parent img
        	var img = document.getElementById('noteCameraImage');
        	img.src = "";
        	img.style.display = 'none';
        	img.style.visibility = 'hidden';
        }
        if (note.imagepath != "" && note.imagepath != null) {
        	//container.find(".note-imagePath").html(note.imagepath);
        	//alert("note imagepath is not null" + note.imagepath);
        	var img = document.getElementById('noteCameraImage');
        	img.src = note.imagepath;
        	img.style.display = 'block';
        	img.style.visibility = 'visible';
        }
        //add location as above here
     /*   if (note.posimap == "") {
        	//alert("note imagepath is null");
        	//force to clear parent img
        	var map = document.getElementById('positionmap');
        	map.src = "";
        	map.style.display = 'none';
        	map.style.visibility = 'hidden';
        }
        if (note.posimap != "" && note.posimap != null) {
        	//container.find(".note-imagePath").html(note.imagepath);
        	//alert("note imagepath is not null" + note.imagepath);
        	var p = document.getElementById('positionmap');
        	p.src = note.posimap;
        	p.style.display = 'block';
        	p.style.visibility = 'visible';
        } */
        container.find(".posi").html(note.position);
        
        if (daysDue < 0) {
            container.find(".note-daysleft").html(" " + Math.abs(daysDue) + " DAYS AGO").addClass("overdue");
        }
        else {
            container.find(".note-daysleft").html(daysDue + " DAYS AHEAD").removeClass("overdue");
        } // if..else
        
        container.slideDown();
    } // showNoteDetails
    
    function populateNoteList() {
        function pad(n) {
            return n<10 ? '0'+n : n;
        }
        
        var listHtml = "",
            monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        
        // iterate through the current notes
        for (var ii = 0; ii < currentNotes.length; ii++) {
            var dueDateHtml = 
                "<ul class='calendar right'>" + 
                    "<li class='day'>" + pad(currentNotes[ii].due.getDate()) + "</li>" +
                    "<li class='month'>" + monthNames[currentNotes[ii].due.getMonth()] + "</li>" + 
                    "<li class='year'>" + currentNotes[ii].due.getFullYear() + "</li>" + 
                "</ul>";
            
            // add the list item for the note
            /*listHtml += "<li id='note_" + currentNotes[ii].id + "'>" + dueDateHtml +
                "<div class='note-header'>" + currentNotes[ii].name + "</div>" + 
                "<div class='note-details'>" + 
                    currentNotes[ii].description +
                    "<div class='image'>" +  "<img 'id=listimage' src='" + currentNotes[ii].imagepath + "' />" + "</div>" +
                    "<br />" +
                    "<a href='#' class='note-complete right'>Delete Minutes</a>&nbsp;" + 
                "</div>" +
                "<div class='note-index'>" + ii + "</div>" + 
                "</li>";*/
            
            listHtml += "<li id='note_" + currentNotes[ii].id + "'>" + dueDateHtml +
            "<div class='note-header'>" + currentNotes[ii].name + "</div>" + 
           
            "<div class='note-details'>" + 
                currentNotes[ii].description;
            + "<br />"  
           
            if(currentNotes[ii].imagepath !="" && currentNotes[ii].imagepath != null)  {
            	listHtml += "<div class='image'>" +  "<img 'id=listimage' src='" + currentNotes[ii].imagepath + "' />" + "</div>";
            }
            //add more if new fields needed
           
            
            
            listHtml += "<br />" +
            "<div class='po'>" + currentNotes[ii].position +"</div>" +
                "<a href='#' class='note-complete right'>DELETE NOTE</a>&nbsp;" + 
            "</div>" +
            "<div class='note-index'>" + ii + "</div>" + 
            "</li>";
        } // for
        
        jQuery("ul#notelist").html(listHtml);
    } // populateNoteList
    
    function toggleDetailsDisplay(listItem) {
        // slide up any active note details panes
        jQuery(".note-details").slideUp();
       

        // if the current item is selected implement a toggle
        if (activeItem == listItem) { 
            activeItem = null;
            currentNoteIndex = null;
            return; 
        }
        
        // in the current list item toggle the display of the details pane
        jQuery(listItem).find(".note-details").slideDown();
     
        
        // update the active item
        activeItem = listItem;
        currentNoteIndex = jQuery(listItem).find(".note-index").text();
    } // toggleDetailsDisplay
    
    // define an array that will hold the current notes
    var currentNotes = [],
        activeItem = null,
        currentNoteIndex = null;
    
    // define the module
    var module = {
        /* note */
        note: function(params) {
            params = jQuery.extend({
                id: null,
                name: "",
                description: "",
                due: null,
                imagepath: "" ,
                //note above add ,
                //lat: "",
                //long: "",
                //accuracy: ""	
                position: "",
               
            }, params);
            
            // initialise self
            var self = {
                id: params.id,
                name: params.name,
                description: params.description,
                due: params.due ? new Date(params.due) : null,
                imagepath: params.imagepath,
                //lat: params.lat,
                //long: params.long,
                //accuracy: params.accuracy,
                position: params.position,
                completed: null,
                complete: function() {
                    self.completed = new Date();
                },
                
                getDaysDue: function() {
                    return Math.floor((self.due - new Date()) / MILLISECONDS_TO_DAYS);
                }
            };
            
            return self;
        },
        
        /* storage module */
        Storage: (function() {
            // open / create a database for the application (expected size ~ 100K)
            var db = null;
            
            try {
                //db = openDatabase("todolist", "1.2", "Note List Database", 100 * 1024);
                db = openDatabase("todolist", "1.2", "Note List Database", 100 * 1024);
                
                // check that we have the required tables created
                db.transaction(function(transaction) {
                    transaction.executeSql(
                        "CREATE TABLE IF NOT EXISTS note(" + 
                        "  name TEXT NOT NULL, " + 
                        "  description TEXT, " + 
                        "  imagepath TEXT, " + 
                        //"  lat TEXT, " + 
                        //"  long TEXT, " + 
                        "  position TEXT, " + 
                        "  due DATETIME, " + 
                        "  completed DATETIME);");
                });
            }
            catch (e) {
                //db = openDatabase("todolist", "1.1", "Note List Database", 100 * 1024);
                db = openDatabase("todolist", "1.1", "Note List Database", 100 * 1024);
                
                // check that we have the required tables created
                db.transaction(function(transaction) {
                    transaction.executeSql(
                        "CREATE TABLE IF NOT EXISTS note(" + 
                        "  name TEXT NOT NULL, " + 
                        "  description TEXT, " +
                        "  imagepath TEXT, " + 
                        //"  lat TEXT, " + 
                        //"  long TEXT, " + 
                        "  position TEXT, " + 
                        "  due DATETIME, " + 
                        "  completed DATETIME);");
                });
                
                /*db.changeVersion("1.0", "1.1", function(transaction) {
                    transaction.executeSql("ALTER TABLE note ADD completed DATETIME;");
                });*/
                
                /* db.changeVersion("1.1", "1.2", function(transaction) {
                    transaction.executeSql("ALTER TABLE note ADD imagepath TEXT;");
                });*/
                
               db.changeVersion("1.1", "1.2", function(transaction) {
                    transaction.executeSql("ALTER TABLE note ADD imagepath TEXT;");
                });
               
            }
            
            function getNotes(callback, extraClauses) {
                db.transaction(function(transaction) {
                    transaction.executeSql(
                        "SELECT rowid as id, * FROM note " + (extraClauses ? extraClauses : ""),
                        [],
                        function (transaction, results) {
                            // initialise an array to hold the notes
                            var notes = [];
                            
                            // read each of the rows from the db, and create notes
                            for (var ii = 0; ii < results.rows.length; ii++) {
                                notes.push(new module.note(results.rows.item(ii)));
                            } // for
                            
                            callback(notes);
                        }
                    );
                });
            } // getNotes
            
            var subModule = {
                getIncompleteNotes: function(callback) {
                    getNotes(callback, "WHERE completed IS NULL");
                },
                
                getNotesInPriorityOrder: function(callback) {
                    subModule.getIncompleteNotes(function(notes) {
                        callback(notes.sort(function(noteA, noteB) {
                            return noteA.due - noteB.due;
                        }));
                    });
                },
                
                getMostImportantNote: function(callback) {
                    subModule.getNotesInPriorityOrder(function(notes) {
                        callback(notes.length > 0 ? notes[0] : null);
                    });
                },
                
                saveNote: function(note, callback) {
                    db.transaction(function(transaction) {
                        // if the note id is not assigned, then insert
                        if (! note.id) {
                            transaction.executeSql(
                                "INSERT INTO note(name, description, due, imagepath, position) VALUES (?, ?, ?, ? , ?);", 
                                [note.name, note.description, note.due, note.imagepath, note.position],
                                /* add three params
                                 "INSERT INTO note(name, description, due, imagepath) VALUES (?, ?, ?, ?);", 
                                [note.name, note.description, note.due, note.imagepath],
                                 */
                                function(tx) {
                                    transaction.executeSql(
                                        "SELECT MAX(rowid) AS id from note",
                                        [],
                                        function (tx, results) {
                                            note.id = results.rows.item(0).id;
                                            if (callback) {
                                                callback();
                                            } // if
                                        } 
                                    );
                                }
                            );
                        }
                        // otherwise, update
                        else {
                            transaction.executeSql(
                                "UPDATE note " +
                                "SET name = ?, description = ?, due = ?, imagepath = ?, position = ? , completed = ? " + 
                                "WHERE rowid = ?;",
                                [note.name, note.description, note.due, note.imagepath, note.position, note.completed, note.id],
                                /* add three parames
                                 "UPDATE note " +
                                "SET name = ?, description = ?, due = ?, imagepath = ?,completed = ? " + 
                                "WHERE rowid = ?;",
                                [note.name, note.description, note.due, note.imagepath, note.completed, note.id],
                                 */
                                function (tx) {
                                    if (callback) {
                                        callback();
                                    } // if
                                }
                            );
                        } // if..else
                    });
                }
            };
            
            return subModule;
        })(),
        
        /* validation module */
        Validation: (function() {
            var errors = {};

            return {
                displayErrors: function(newErrors) {
                    // initialise variables
                    var haveErrors = false;
                    
                    // update the errors with the new errors
                    errors = newErrors;

                    // remove the invalid class for all inputs
                    $(":input.invalid").removeClass("invalid");

                    // iterate through the fields specified in the errors array
                    for (var fieldName in errors) {
                        haveErrors = true;
                        $("input[name='" + fieldName + "']").addClass("invalid");
                    } // for

                    // if we have errors, then add a message to the errors div
                    $("#errors")
                        .html(haveErrors ? "Errors were found." : "")
                        .css("display", haveErrors ? "block" : "none");
                },
                
                displayFieldErrors: function(field) {
                    var messages = errors[field.name];
                    if (messages && (messages.length > 0)) {
                        // find an existing error detail section for the field
                        var errorDetail = $("#errordetail_" + field.id).get(0);

                        // if it doesn't exist, then create it
                        if (! errorDetail) {
                            $(field).before("<ul class='errors-inline' id='errordetail_" + field.id + "'></ul>");
                            errorDetail = $("#errordetail_" + field.id).get(0);
                        } // if

                        // add the various error messages to the div
                        for (var ii = 0; ii < messages.length; ii++) {
                            $(errorDetail).html('').append("<li>" + messages[ii] + "</li>");
                        } // for
                    } // if
                } // displayFieldErrors
            };
        })(),
        
        /* view activation handlers */
        activateMain: function() {
            NOTELIST.Storage.getMostImportantNote(function(note) {
                if (note) {
                    // the no notes message may be displayed, so remove it
                    jQuery("#main .no_notes").remove();
                                    	
                    // update the note details
                    showNoteDetails("#main .note", note);
                    
                    // attach a click handler to the complete note button
                    jQuery("#main .note-complete").unbind().click(function() {
                        jQuery("#main .note").slideUp();
                        
                        // mark the note as complete
                        note.complete();
                                                
                        // save the note back to storage
                        NOTELIST.Storage.saveNote(note, module.activateMain);
                    });
                }
                else {
                    jQuery("#main .no_notes").remove();
                    jQuery("#main .note").slideUp().after("<p class='no_notes'>You have no notes</p>");
                }
            });
        },
        
        activateAllNotes: function() {
            NOTELIST.Storage.getNotesInPriorityOrder(function(notes) {
                // update the current notes
                currentNotes = notes;

                populateNoteList();
                
                // refresh the note list display
                jQuery("ul#notelist li").click(function() {
                    toggleDetailsDisplay(this);
                });
                
                jQuery("ul#notelist a.note-complete").unbind().click(function() {
                    // delete the note
                    alert("delete the note");
                    //the following handle actual delete note
                	//alert("current name " + currentNotes[currentNoteIndex].name);
                	//alert("current description " + currentNotes[currentNoteIndex].description);
                	//alert("current due " + currentNotes[currentNoteIndex].due);
                	//alert("current id " + currentNotes[currentNoteIndex].id);
                	//alert("current completed before call complete " + currentNotes[currentNoteIndex].completed);
                    currentNotes[currentNoteIndex].complete();
                	//alert("current completed after call complete " + currentNotes[currentNoteIndex].completed);
                	NOTELIST.Storage.saveNote(currentNotes[currentNoteIndex], module.activateAllNotes);
                    populateNoteList();
                });
            });
        }
    };
    

    
    return module;
})();

$(document).ready(function() {
    /* validation code */
    $(":input").focus(function(evt) {
        NOTELIST.Validation.displayFieldErrors(this);
    }).blur(function(evt) {
        $("#errordetail_" + this.id).remove();
    });

    $("#noteentry").validate({
        submitHandler: function(form) {
            // get the values from the form in hashmap
            var formValues = PROWEBAPPS.getFormValues(form);
            
            // create a new note to save to the database
            var note = new NOTELIST.note(formValues);
            
            // Try to get image path here
            var imagePath = document.getElementById('note-image');
            //alert("From pn_main.js " + jQuery(imagePath).text());
            note.imagepath=jQuery(imagePath).text();
            
            // note position
            var position = document.getElementById('cur_position');
            note.position=jQuery(position).text();
            
            // now create a new note
            NOTELIST.Storage.saveNote(note, function() {
                // PROWEBAPPS.ViewManager.activate("main");
                PROWEBAPPS.ViewManager.back();
            });
        },
        showErrors: function(errorMap, errorList) {
            // initialise an empty errors map
            var errors = {};

            // iterate through the jQuery validation error map, and convert to 
            // something we can use
            for (var elementName in errorMap) {
                if (! errors[elementName]) {
                    errors[elementName] = [];
                } // if

                errors[elementName].push(errorMap[elementName]);
            } // for

            // now display the errors
            NOTELIST.Validation.displayErrors(errors);
        }
    });
    
    // bind activation handlers
    $("#main").bind("activated", NOTELIST.activateMain);
    $("#allnotes").bind("activated", NOTELIST.activateAllNotes);

    // initialise the main view
    PROWEBAPPS.ViewManager.activate("main");
});