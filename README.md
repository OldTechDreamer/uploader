# Uploader

A JavaScript / PHP library for uploading large files in seperate parts.

## Files

- uploader.js		Client side script
- uploader.php	Server side script
- target.php		An example of how to use uploader.php on your server
- index.html		An example web page to upload files to

## How it works

uploader.js uploads a file selected by the user in multiple parts parts. The server (including uploader.php) will receive the file and place it in a directory (default "uploads"), which will be named a unique random name. A PHP session will be started in uploader.php (if not already started), so the server can keep track files being uploaded. There is a function to find when a new file is uploaded.

## Options

Please edit the top of uploader.js and uploader.php.

## JavaScript methods

UPER.UploadFileFromSelector(file_selector_id)		Upload a file which is selected in an <input type = "file" id = "some_id" />, where the *file_selector_id* is the ID of the input element.

UPER.UploadFile(file) 	Upload a File object

UPER.SetProgressListener(listener)	Set a progress listener which is called whenever a chunk is sent to the server. Listener is a function of the form: function(uper){}, where *uper* in the function parameter is the UPER object.

UPER.uploading		A Boolean, true if an upload is in progress

UPER.progress		An integer, the progress of the upload in percent (0 - 100)

UPER.upload_error	A Boolean, true if there was an error uploading the last file

## PHP methods

$UPER.new_file_uploaded		A Boolean, true if a new file has been uploaded (this request)

$UPER.new_file_path				A string, the file path of the new file which has been uploaded (this request)
