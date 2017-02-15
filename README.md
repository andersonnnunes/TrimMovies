**Name:** Trim Movies

**Type:** Script for Directory Opus to define a new command: TrimMovies.

**License:** CC0 Public Domain by AndersonNNunes.org.

------

**Functionality**

The scripts adds the new command ```TrimMovies```.

It creates trimmed versions of movie files by chopping the beginning of the data stream while preserving all the metadata of the original file.

To make it easier to distinguish the original from the trimmed, adds a tag to the trimmed file.

It may replace the original with the trimmed version.

The trim operation begins at the same position for each video file.

Example: one video file with 01:00:00 (HH:MM:SS) total time is selected. Button is pressed. User inputs 00:15:00 as initial seek time. An output file with 00:45:00 total time is generated (the initial 15 minutes were chopped).

**Requirements**

Directory Opus version >= 12.2.5.

FFmpeg, accessible simply as "ffmpeg".

**Install**

It is distributed as a .js file. Install it by the usual means.

**Settings**

There should not be the need for you too change anything before executing the script.

You have some options to personalize the script's behavior. Right now you need to edit the script manually.

**Usage**

Set the command ```TrimMovies``` as an action triggered by whatever event you desire.

At least one file needs to be selected for the command to work.

**Limitations**

There is not any progress indication.

**Follow**

Follow the development of this script at the [Directory Opus Forum](https://resource.dopus.com/t/trim-movies-create-a-trimmed-copy-with-identical-metadata/24515) or on [GitHub](https://github.com/andersonnnunes/TrimMovies).