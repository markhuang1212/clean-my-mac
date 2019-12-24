const fs = require('fs')
const path = require('path')

const DEPTH = 20

class DirTree {
    /**
     * @param {string} dir 
     * @param {string} name
     * @param {number} depth 
     */
    constructor(dir, name, depth = DEPTH) {
        this.dir = dir
        this.name = name
        /** @type {DirTree[]} */
        this.child = []
    }
    isCache() {
        return this.name == 'Caches' ||
            this.name == 'Cache' ||
            this.name == 'caches' ||
            this.name == 'cache'
    }
    /** @param {string} name */
    static isCache(name) {
        return name == 'Caches' ||
            name == 'Cache' ||
            name == 'caches' ||
            name == 'cache'
    }
}

class DirTreeSimple extends DirTree {
    /**
     * @param {string} dir 
     * @param {string} name
     * @param {number} depth 
     */
    constructor(dir, name, depth = DEPTH) {
        super(dir, name, depth)

        /** @type {fs.Dirent[]} */
        let subDir = []
        try {
            subDir = fs.readdirSync(dir, { withFileTypes: true })
        } catch (e) { }

        subDir.forEach(v => {
            if (v.isDirectory()) {
                if (DirTree.isCache(v.name))
                    this.child.push(new DirTreeFull(path.join(dir, v.name), v.name, true, depth - 1))
                else
                    this.child.push(new DirTreeSimple(path.join(dir, v.name), v.name, depth - 1))
            }
        })
    }
    /**
     * @returns {string[]}
     */
    deleteList() {
        let list = []
        this.child.forEach(child => {
            if (child.isCache())
                list.push(child.dir)
            else
                list.push(child.deleteList())
        })
        list.filter(v => v != [])
        return list.flat(1)
    }
    deleteSize() {
        let size = 0
        this.child.forEach(child => {
            if (child instanceof DirTreeSimple)
                size += child.deleteSize()
            if (child instanceof DirTreeFull)
                size += child.size()
        })
        return size
    }
    clean(){
        this.child.forEach(child.clean())
    }
}

class DirTreeFull extends DirTree {
    /**
     * @param {string} dir 
     * @param {string} name
     * @param {boolean} isDir
     * @param {number} depth 
     */
    constructor(dir, name, isDir, depth = DEPTH) {
        super(dir, name, depth)
        this.isDir = isDir
        if (!isDir)
            return

        /** @type {fs.Dirent[]} */
        let subDir = []

        try {
            subDir = fs.readdirSync(dir, { withFileTypes: true })
        } catch (e) { }

        subDir.forEach(v => {
            this.child.push(new DirTreeFull(path.join(dir, v.name), v.name, v.isDirectory(), depth - 1))
        })

    }
    size() {
        let size = 0

        this.child.forEach(child => {
            if (child.isDir)
                size += child.size()
            else
                size += fs.statSync(child.dir).size
        })

        return size
    }
    clean(){
        if(!this.isDir)
            fs.rmdirSync(this.dir,{recursive})
    }
}

module.exports = DirTreeSimple