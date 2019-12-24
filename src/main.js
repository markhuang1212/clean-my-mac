const fs = require('fs')
const DirTree = require('./DirTree.js')

const homedir = require('os').homedir();
const libDir = homedir + '/Library'

const userTree = new DirTree(libDir, 'Library', 100)
const deleteList = userTree.deleteList()

process.exit(0)