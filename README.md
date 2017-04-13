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

- s4ts2 (convert 4 spaces to 2 spaces)
- s2ts4 (convert 2 spaces to 4 spaces)
- tts4 (convert tabs to 4 spaces)
- tts2 (convert tabs to 2 spaces)

## Whitelisting and Blacklisting Files

Currently the application will ignore files in a `node_modules` folder.

Additionally, the only accepted mime-types at the moment are:

- text/html
- text/css
- text/x-sass
- text/x-scss
- application/javascript
- application/json
- text/jsx

This isn't exhaustive or perfect but suits my immediate needs. Edit either the ignore array (`defaultIgnores`) or the allow mimes array (`allowTypes`) in the `converter.js` file if you want to make adjustments to what files are and are not converted.

## Working Directories

The `originals` directory in this repo is not needed for functionality - it contains test folders I use when working on the code to make sure that conversion happens properly. Ultimately I'll delete it but for now you're stuck with it. 😉

## Disclaimer

**This is by no means production quality** but it gets the job done for me. It is quasi-bulletproof but not as bulletproof as it could be.

## Next Steps

- implement converting spaces to tabs
- implement an optional config file to pass custom file globs to ignore and custom mime types to allow
