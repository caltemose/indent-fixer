#!/usr/bin/env node
'use strict'

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
    'text/plain',
    'text/css',
    'text/x-sass', 'text/x-scss',
    'application/octet-stream', // things like .pug report as this. not sure why.
    'application/javascript',
    'application/json',
    'text/jsx'
]

const allowedModes = [
    // 'stt4',
    // 'stt2',
    's4ts2',
    's2ts4',
    'tts2',
    'tts4'
]

const br = '\n                   '

args
    .option('dir', 'REQUIRED: The directory to traverse')
    .option('mode', 'REQUIRED: The conversion mode:' + br + 'stt4 (4 spaces to tabs)' + br + 'stt2 (2 spaces to tabs)' + br + 'tts4 (tabs to 4 spaces)' + br + 'tts2 (tabs to 2 spaces)' + br + 's4ts2 (4 spaces to 2 spaces)' + br + 's2ts4 (2 spaces to 4 spaces)')
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

if (!allowedModes.includes(flags.mode)) {
    console.error('You must provide a known mode.'.red)
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
    let regex, replacement
    const regexSpaces = /^(\s+)/g
    const regexTabs = /^(\t+)/g

    switch (flags.mode) {
        case 's2ts4':
            regex = regexSpaces
            replacement = '  ' // 2 spaces
            break
        case 's4ts2':
            regex = regexSpaces
            replacement = ' ' // 1 space
            break
        case 'tts4':
            regex = regexTabs
            replacement = '    ' // 4 spaces
            break
        case 'tts2':
            regex = regexTabs
            replacement = '  ' // 2 spaces
            break
    }

    lineReader.eachLine(file, (line, last) => {
        let iterationCount
        let match = line.match(regex)
        if (!match) fixed += line + eol
        else {
            switch (flags.mode) {
                case 's4ts2':
                    iterationCount = match[0].length/2
                    break
                default:
                    iterationCount = match[0].length
                    break
            }
            let indentation = ''
            for(var i=0; i<iterationCount; i++) {
                indentation += replacement
            }
            fixed += line.replace(regex, indentation) + eol
        }

        if (last) {
            fs.writeFileSync(file, fixed, writeOptions)
            nextFile()
        }
    })
}
