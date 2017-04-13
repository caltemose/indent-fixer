# indent-fixer

This repository contains a NodeJS script which can be run on the command line to convert the indentation of a directory of files. The directory provided in the arguments is recursed and file indentation is adjusted to one of the following conditions:

- convert tabs to spaces (2 or 4)
- convert number of spaces (2 to 4 *or* 4 to 2)

Currently the files to be ignored are hard-coded in the script as is the list of mime-types to allow.

## Interface

Run `node converter.js -h` to see help for this script. Examples:

`node converter.js -d ./directory-to-parse -m s2ts4` (convert 2 spaces to 4 spaces)

`node converter.js -d ./directory-to-parse -m tts4` (convert tabs to 4 spaces)

## Installing Globally

I have not added this package to NPM. If you want to use it globally, clone/download the repo, install the dependencies and then run `npm link` from the repo directory to add this to your global packages. You can then run the app from the cli like so:

`fix-indentation -d <dir> -m <mode>`

Use one of the following modes:

- stt4 (convert 4 spaces to tabs)
- sst2 (convert 2 spaces to tabs)
- tts4 (convert tabs to 4 spaces)
- tts2 (convert tabs to 2 spaces)

## Disclaimer

**This is by no means production quality** but it gets the job done for me. It is quasi-bulletproof but not as bulletproof as it could be.

## Next Steps

- implement converting spaces to tabs
- implement an optional config file to pass custom file globs to ignore and custom mime types to allow
