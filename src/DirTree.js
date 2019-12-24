const fs = require('fs')
const path = require('path')

class DirTree {
    /**
     * @param {string} dir 
     * @param {string} name
     * @param {number} depth 
     */
    constructor(dir, name, depth = 10) {
        this.dir = dir
        this.name = name
        if (this.isCache())
            return
        this.child = []
        try {
            const subDir = fs.readdirSync(dir, { withFileTypes: true })
            subDir.forEach(v => {
                if (v.isDirectory())
                    this.child.push(new DirTree(path.join(dir, v.name), v.name, depth - 1))
            })
        } catch (e) { }
    }
    isCache() {
        return this.name == 'Caches' ||
            this.name == 'Cache' ||
            this.name == 'caches' ||
            this.name == 'cache'
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
}

module.exports = DirTree