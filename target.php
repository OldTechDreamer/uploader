<?php

// Include the uploader.php script

include("uploader.php");

// Use the Uploader Object to find if a file has been uploaded

if ($UPER->new_file_uploaded) {
	$file_path = $UPER->new_file_path;
	
	// Do something with $file_path e.g. recording it in a database
}

// IMPORTANT: target.php must not echo anything, as the client reads the response to detect errors