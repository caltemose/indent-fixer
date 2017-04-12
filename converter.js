const args = require('args')
const fs = require('fs')
const recursive = require('recursive-readdir')
const lineReader = require('line-reader')
const mime = require('mime')
const colors = require('colors')

const eol = '\n'
const writeOptions = {
    encoding: 'utf8',
    flag: 'w'
}

const defaultIgnores = [
    '.DS_Store',
    'node_modules/**/*',
    '*.md',
    '*.lock'
]

const allowedTypes = [
    'text/html',
    'text/css',
    'text/x-sass', 'text/x-scss',
    'application/javascript',
    'text/jsx'
]

args
    .option('dir', 'REQUIRED: The directory to traverse')
    .option('mode', 'REQUIRED: The conversion mode: stt4 (4 spaces to tabs), stt2 (2 spaces to tabs), tts4 (tabs to 4 spaces), tts2 (tabs to 2 spaces), s4ts2 (4 spaces to 2 spaces), s2ts4 (2 spaces to 4 spaces)')
    // .option('dryrun', 'Do not overwrite files - merely print a report of expected results.')

const flags = args.parse(process.argv)

let exit = false
// let dryrun = false
let allFiles
let currentFile = 0

if (!flags.dir) {
    console.error('A directory to traverse must be provided'.red)
    exit = true
}

if (!flags.mode) {
    console.error('A conversion mode must be provided.'.red)
    exit = true
}

// if (flags.dryrun) {
//     console.log('This is a dryrun.')
//     dryrun = true
// }

if (exit) {
    process.exitCode = 1
} else {
    start()
}

// ----------------------------------------------------------------
//  HELPER FUNCTIONS
// ----------------------------------------------------------------

function start () {
    fs.stat(flags.dir, (err, stat) => {
        if (err) {
            console.error('There\'s a problem with the directory you provided:'.red)
            console.error(err.toString().red)
            return false
        }
        initialReport()
        getFiles()
    })
}

function initialReport () {
    console.log('Directory:', flags.dir.green)
    console.log('Mode:', flags.mode.green)
}

function getFiles () {
    recursive(flags.dir, defaultIgnores, (err, files) => {
        allFiles = files
        if (files.length > 0)
            processFile(0)
        else
            console.log('No files to process'.yellow)
    })
}

function isAllowedFileType (file) {
    const fileType = mime.lookup(file)
    return allowedTypes.includes(fileType)
}

function nextFile () {
    if (currentFile < allFiles.length -1) {
        currentFile++
        processFile(currentFile)
    } else console.log('Done converting files!'.cyan)
}

function processFile (fileIndex) {
    const file = allFiles[fileIndex]

    if (!isAllowedFileType(file)) {
        // skip this file if it's not an allowed type
        nextFile()
        return
    }

    let fixed = ''
    lineReader.eachLine(file, (line, last) => {
        // convert 2 spaces to 4 spaces
        if (flags.mode === 's2ts4') {
            let match = line.match(/^(\s+)/g)
            if (!match) fixed += line + eol
            else {
                let fix = ''
                for(var i=0; i<match[0].length; i++) {
                    fix += '  '
                }
                line = line.replace(/^(\s+)/g, fix)
                fixed += line + eol
            }
        // convert 4 spaces to 2 spaces
        } else if (flags.mode === 's4ts2') {
            let match = line.match(/^(\s+)/g)
            if (!match) fixed += line + eol
            else {
                let fix = ''
                for(var i=0; i<match[0].length/2; i++) {
                    fix += ' '
                }
                line = line.replace(/^(\s+)/g, fix)
                fixed += line + eol
            }
        // convert tabs to 4 spaces
        } else if (flags.mode === 'tts4') {
            let match = line.match(/^(\t+)/g)
            if (!match) fixed += line + eol
            else {
                let fix = ''
                for(var i=0; i<match[0].length; i++) {
                    fix += '    '
                }
                line = line.replace(/^(\t+)/g, fix)
                fixed += line + eol
            }
        // convert tabs to 2 spaces
        } else if (flags.mode === 'tts2') {
            let match = line.match(/^(\t+)/g)
            if (!match) fixed += line + eol
            else {
                let fix = ''
                for(var i=0; i<match[0].length; i++) {
                    fix += '  '
                }
                line = line.replace(/^(\t+)/g, fix)
                fixed += line + eol
            }
        }

        if (last) {
            fs.writeFileSync(file, fixed, writeOptions)
            nextFile()
        }
    })
}
