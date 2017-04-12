# indent-fixer

This repository contains a NodeJS script which can be run on the command line to convert the indentation of a directory of files. It has the following capabilities:

- recurse a given directory of files
- convert tabs to spaces (2 or 4)
- convert spaces (2 or 4) to tabs
- convert number of spaces (2 to 4 *or* 4 to 2)

Currently the files to be ignored are hard-coded in the script as is the list of mime-types to allow.

## Interface

Run `node converter.js -h` to see help for this script. Examples:

`node converter.js -d ./directory-to-parse -m s2ts4` (convert 2 spaces to 4 spaces)

`node converter.js -d ./directory-to-parse -m tts4` (convert tabs to 4 spaces)

## Disclaimer

**This is by no means production quality** but it gets the job done for me. It is quasi-bulletproof but not as bulletproof as it could be.

## Next Steps

- validate the `mode` passed to the script to ensure it's known
- implement an optional config file to pass custom file globs to ignore and custom mime types to allow
