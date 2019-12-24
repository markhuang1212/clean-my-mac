#!/usr/bin/env node

const fs = require('fs')
const DirTreeSimple = require('./DirTree.js')

const homedir = require('os').homedir();
const libDir = homedir + '/Library'
const argv = process.argv.splice(2)

const userTree = new DirTreeSimple(libDir, 'Library', 100)

if(argv[0]=='list')
{
    console.log('Files to be cleared: ' + userTree.deleteSize() + ' Bytes.')
}

if(argv[0]=='clean')
{
    console.log('Files to be cleared: ' + userTree.deleteSize() + 'Bytes')
    userTree.clean()
}

process.exit(0)