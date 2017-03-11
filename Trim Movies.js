// The OnInit function is called by Directory Opus to initialize the script add-in.
function OnInit(initData) {
	// Basic information about the script.
	initData.name = "Trim Movies";
	initData.desc = "Creates trimmed versions of movie files by chopping the beginning of the data stream while preserving all the metadata of the original file.";
	initData.copyright = "CC0 Public Domain by AndersonNNunes.org";
	var version = "0.2";
	initData.version = version;
	initData.url = "https://github.com/andersonnnunes/TrimMovies";
	initData.default_enable = true;
	initData.min_version = "12.2.5"

	// Create a new ScriptCommand object and initialize it to add the command to Opus.
	var cmd = initData.AddCommand();
	cmd.name = "TrimMovies";
	cmd.method = "OnTrimMovies";
	cmd.desc = initData.desc;
	cmd.label = "Trim Movies";
	cmd.template = "";
}

// Implement the OnTrimMovies command (this entry point is an OnScriptCommand event).
function OnTrimMovies(scriptCmdData) {
	// ------------------------------- Preferences
	// Name of tag to apply to trimmed files.
	// Must end with a semicolon.
	// Set as empty string if no tag should be applied.
	var tagForTrimmedFiles = "Trimmed To Favorite Scene";
	// --------------------
	// Text to append to the name of the output file.
	var stringToAppendToTrimmedFiles = " - Trimmed";
	// --------------------
	// Name of file type group for movies.
	// If you defined a personalized file type group for your movies, type it here.
	var localizedMovieGroupTypeName = "Movies";
	// --------------------
	// Should the new file always overwrite the old?
	// If so, set this variable to true. Else shift should be pressed when the button is clicked to activate overwrite.
	var alwaysOverwrite = false;
	// --------------------
	// Determine verbosity level.
	// 1 - Print informative log.
	// 0 - Print nothing.
	var verbose = 1;
	// --------------------
	// Should the script prevent the display of external windows?
	// If so, set this variable to true.
	var hideWindows = true;
	// --------------------
	// Enable development mode.
	// During development, set this to true to make it easier to test this script.
	var developmentMode = false;
	// --------------------
	// Clear output on run?
	var clearOutput = false;
	// --------------------
	
	// ------------------------------- Main
	if (clearOutput) {
		DOpus.ClearOutput();
	}
	
	// Check that there are files selected.
	if (scriptCmdData.func.sourcetab.selected_files.count == 0)
	{
		error("No files are selected.");
	}
	else
	{
		// Adjust command behavior.
		var cmd = scriptCmdData.func.command;
		cmd.deselect = false;
		cmd.SetQualifiers("none");
		cmd.ClearFiles;
		
		// Filter selected files to consider only movie files.
		for (var eSel = new Enumerator(scriptCmdData.func.sourcetab.selected_files); !eSel.atEnd(); eSel.moveNext())
		{
			var selectedItem = eSel.item();
			for (var i=0; i<selectedItem.groups.length; i++){
				if (selectedItem.groups(i).display_name == localizedMovieGroupTypeName)
				{
					cmd.AddFile(selectedItem);
				}
			}
		}
				
		// Ask for the start time.
		if (developmentMode) {
				var initTime = "00:00:01";
		}
		else {
			var dialogObj = askTime();
			if (!dialogObj.result) {
				print("Operation aborted by the user.");
				return;
			}
			else {
				var initTime = dialogObj.input;
			}
		}

		// Set window display mode.
		var intWindowStyle = 1;
		if (hideWindows) {
			cmd.AddLine("@runmode:hide");
			intWindowStyle = 0;
		}
		
		// Prepare objects.
		var wsh = new ActiveXObject("WScript.Shell");
		
		// For each movie file, define what to do.
		for (var iSel = new Enumerator(cmd.files); !iSel.atEnd(); iSel.moveNext())
		{
			// Define paths.
			var cItem = iSel.item()
			var inputPath = "\"" + cItem + "\"";
			var outputPath = inputPath.replace(cItem.ext, stringToAppendToTrimmedFiles + cItem.ext);
			print("Input: " + inputPath);
			print("Output: " + outputPath);

			// Define how to produce the output file.
			var trimCmdLine = "ffmpeg -xerror -hide_banner -y -ss " + initTime + " -i " + inputPath + " -threads 6 -map 0:v -map 0:a? -map 0:s? -map_metadata g -c:v copy -c:a copy -c:s copy " + outputPath;
			print("Command sent to produce the file: " + trimCmdLine);
			
			// Execute trim operation.
			var runReturnCode = wsh.Run(trimCmdLine, intWindowStyle, true);
			
			if (runReturnCode == 0) {
				// -------------------- Copy metadata to the trimmed file.
				
				// Define how to set the tags for the output file.
				var tagString = tagForTrimmedFiles;
				for (var tagEnum = new Enumerator(cItem.metadata.tags); !tagEnum.atEnd(); tagEnum.moveNext())
				{
					if (tagString != "") {
						tagString += ";";
						tagString += tagEnum.item();
					}else {
						tagString = tagEnum.item();
					}
				}
				
				if (tagString != "") {
					setTagCmdLine = "SetAttr " + outputPath + " META \"tags:" + tagString + "\"";
					print("Command sent to set tags: " + setTagCmdLine);
					cmd.AddLine(setTagCmdLine);
				}
				
				// Define how to set the labels for the output file.
				var labelVector = cItem.labels;
				if (!labelVector.empty) {
					var labelString = "";
					labelVector.sort();
					for(var i=0; i<labelVector.count; i++)
					{
						labelString += labelVector(i);
						if (i < (labelVector.count - 1)) {
							labelString += ",";
						}
					}
					setLabelCmdLine = "Properties " + outputPath + " SetLabel=" + labelString;
					print("Command sent to set label: " + setLabelCmdLine);
					cmd.AddLine(setLabelCmdLine);
				}

				// Define how to set the rating for the output file.
				var ratingValue = cItem.metadata.other.rating;
				if (ratingValue > 0) {
					var setRatingCmdLine = "SetAttr " + outputPath + " META Rating:" + ratingValue;
					print("Command sent to set the rating: " + setRatingCmdLine);
					cmd.AddLine(setRatingCmdLine);
				}

				// Define how to set the movie specific metadata for the output file.
				var setMovieMetatadaCmdLine = "SetAttr " + outputPath + " META \"copyfrom:9," + cItem + "\"";
				print("Command sent to set the movie specific metadata: " + setMovieMetatadaCmdLine);
				cmd.AddLine(setMovieMetatadaCmdLine);

				// Define how to set the user comment for the output file.
				var commentString = cItem.metadata.other.usercomment;
				if (commentString)
				{
					var setCommentCmdLine = "SetAttr " + outputPath + " META \"Comment:" + commentString + "\"";
					print("Command sent to set the user's comment: " + setCommentCmdLine);
					cmd.AddLine(setCommentCmdLine);
				}

				// Define how to replace the original .
				if (alwaysOverwrite || scriptCmdData.func.qualifiers == "shift") {
					cmd.AddLine("Delete " + inputPath);
					cmd.AddLine("Rename " + outputPath + " To " + inputPath);
				}
				
				// Execute commands.
				cmd.Run;
				
				// Clear commands.
				cmd.Clear;
				
				print("Success!");
			} else {
				error("FFmpeg was unable to trim the file.");
			}
		}
	}

	// Dialog used to request the time.
	function askTime() {
		var dlg = scriptCmdData.func.Dlg;
		dlg.window = DOpus.Listers(0);
		dlg.defvalue = "00:00:00";
		dlg.message = "Input the initial seek time.";
		dlg.title = "Seek Position";
		dlg.max = 8;
		var answer = dlg.Show;
		return dlg;
	}

	// Print informative log only if requested.
	function print(text) {
		if (verbose) {
			DOpus.Output(text);
		}
	}
	
	// Display error message.
	function error(text) {
		DOpus.Output(text, true);
	}
}
