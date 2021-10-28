// Uploader.js
// Easy file splitter uploading library
// Author:	Nicholas Wright
// Version:	1.0

class Uploader {
	// -------- UPLOADER OPTIONS -------- //
	target = "target.php";		// Target URL to upload the file to
	chunk_size = 500000;		// Size of the data chunk to be uploaded per request (in bytes)
	
	post_action = "UPLOAD";		// Name of Post variable to use for stating file uploads, values: "UPLOAD" or "APPEND" or "FINISH" (remember to change in uploader.php too)
	post_data = "UPLOAD_DATA";	// Same as above but for file data
	
	// -------- RUNNING VARIABLES -------- //
	
	progress = 0;				// The progress of the file upload in percent
	progress_listener = null;	// A function to be called when a chunk has been sent: function (progress) {}
	
	file = null;				// The file currently being uploaded
	index = 0;					// The byte index of the file byte data which is to be uploaded next
	uploading = false;			// If a file is currently being uploaded
	upload_error = false;		// If there was an error uploading a file
	
	constructor () {
		// Nothing here yet
	}
	
	UploadFileFromSelector (file_selector_id) {	// Upload a file which is selected in the <input type = "file"> with the id
		// Get the File from the input element
		var file_selector = document.getElementById(file_selector_id);
		
		if (file_selector.files.length == 0){
			this._Log("No files to upload.");
			return false;
		}
		
		// Get the file
		var file = file_selector.files[0];
		
		return this.UploadFile(file);
	}
	
	UploadFile(file){							// Upload a file
		// Prevent double uploading
		if (this.uploading) {
			this._Log("Already uploading a file.");
			return false;
		}
		
		this.file = file;
		
		// Start the upload loop
		this._Log("Uploading " + this.file.name + " (" + this.file.type + ")");
		
		this.index = 0;
		this.progress = 0;
		this.uploading = true;
		this.upload_error = false;
		
		this._UploadNextChunk();
		
		return true;
	}
	
	_UploadNextChunk() {						// Upload the next chunk in the sequence
		var self = this;
		
		// Set the progress and call the listener
		this.progress = (this.index / this.file.size) * 100;
		
		if (this.progress > 100) {					// Upload finished
			this.progress = 100;
		}
		
		// Call the listener
		if (this.progress_listener != null) {
			this.progress_listener(this);
		}
		
		// Get the next file chunk and increment the index
		var chunk = this.file.slice(this.index, this.index + this.chunk_size, this.file.type);
		this.index = this.index + this.chunk_size;
		
		
		// Create the action for the HTTP request (so the server knows what to do)
		var action = "";
		
		if (this.progress == 0){			// Sending file for the first time
			action = "UPLOAD";
		
		} else if (this.progress == 100) {	// File upload complete
			action = "FINISH";
			
		} else {							// Still sending file data
			action = "DATA";
		}
		
		// Create a form to hold the data and action
		var form_data = new FormData();
		form_data.append(this.post_action, action);
		form_data.append(this.post_data, chunk);
		
		// Upload data via AJAX request
		var ajax = new XMLHttpRequest();
		
		
		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				// Check the response text
				if (ajax.responseText.substring(0, 5) != "OKAY") {	// Request was not Okay, stop and show an error
					self._Log("Error uploading file!");
					self.upload_error = true;
					self.uploading = false;
					
					// Debugging (showing PHP errors if any)
					console.log(ajax.responseText);
					
					// Call the listener
					if (self.progress_listener != null) {
						self.progress_listener(self);
					}
					
				} else if (self.progress < 100) {	
					self._UploadNextChunk();	// Upload the next chunk if all okay
					
				} else {	// File upload successful
					self.uploading = false;
					self.upload_error = false;
					
					self._Log("Upload complete.");
				}
			}
		};
		
		// Send the data
		ajax.open("POST", this.target, true);
		ajax.overrideMimeType('multipart/form-data');
		ajax.send(form_data);
	}
	
	SetProgressListener(listener){			// Set the listener to listen for progress changes
		this.progress_listener = listener;
	}

	_Log(text){								// Debug logging
		console.log("[Uploader] " + text);
	}
}


var UPER = new Uploader();