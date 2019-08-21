const fs = require('fs')
const path = require('path')

const walk = function (dir, callbackOnFile, done) {
    fs.readdir(dir, (err, list) => {
        if (err) return done(err)
        let i = 0;
  
        const next = function (err) {
            if (err) return done(err)

            let filePath = list[i++]
    
            if (!filePath) return done(null)
    
            filePath = path.join(dir, filePath)
    
            fs.stat(filePath, (_, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(filePath, callbackOnFile, next);
                } else {
                    callbackOnFile(filePath, next);
                }
            })
        }
    
        next()
    })
}

module.exports = walk