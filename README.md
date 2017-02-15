**Name:** Trim Movies

**Type:** user defined command via script.

**License:** CC0 Public Domain by AndersonNNunes.org.

------

**Functionality**

Creates trimmed versions of movie files by chopping the beginning of the data stream while preserving all the metadata of the original file.

To make it easier to distinguish the original from the trimmed, adds a tag to the trimmed file.

May replace the original with the trimmed version.

The trim operation begins at the same position for each video file.

Example: one video file with 01:00:00 (HH:MM:SS) total time is selected. Button is pressed. User inputs 00:15:00 as initial seek time. An output file with 00:45:00 total time is generated (the initial 15 minutes were chopped).

**Requeriments**

Directory Opus version >= 12.2.5.
FFmpeg is accessible simply as "ffmpeg".
The FFmpeg line must execute correctly. (It is up to the user to make sure the input files are not corrupt movies, there is enough space on disk, the seek time is less than the total time, etc.)

**Install**

It is distributed as a .js file. Install it by the usual means.

**Settings**

There should not be the need for you too change anything before executing the script.

You have some options to personalize the script's behavior. Right now you need to edit the script manually.

**Usage**

Multiple files of any type may be selected on the source tab before pressing the button.

**Limitations**

There is not any progress indication.