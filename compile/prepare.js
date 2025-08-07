const fs = require('fs')

module.exports = function(code){

    code = code.replace(/([a-zA-Z0-9\_]+) (db|dw|dd|dq) (.*)/gm,'$1:\n$2 $3')

    fs.writeFileSync('./cache/prepared.asm', code)

    return code
}