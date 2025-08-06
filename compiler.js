

let OFFSET = 0x3000
const CALLS = {}


function LE(text){
    let bytes = text.match(/.{2}/g);
    return bytes.reverse().join(' ');
}
function DectoHex1(dec){
    let val = parseInt(dec)
    val = val.toString(16)
    return val
}
function DectoHex2(dec){
    let val = parseInt(dec)
    val = val.toString(16)
    val = val.padStart(4,'00')
    return val
}
function DectoHex4(dec){
    let val = parseInt(dec)
    val = val.toString(16)
    val = val.padStart(8,'00')
    return val
}
function DectoHex8(dec){
    let val = parseInt(dec)
    val = val.toString(16)
    val = val.padStart(16,'00')
    return val
}


function make(code){


let lines = code.split('\n')
function parse(){
lines = lines.map(line=>{
    line=line.trim()
    if(line.split(' ')[0]=='dd'){
        let val = line.replace('dd','').trim().split(',').map(v=>v.trim()).map(v=>{
            if(v.indexOf('RVA')>-1){
                let vn = v.replace('RVA ','').trim()
                console.log('vn',vn)
                if(CALLS[vn]){
                    return 'RVA '+CALLS[vn]
                }else{
                    return 'RVA '+vn
                }
            }
            return v
        })
        OFFSET+=val.length*4
        line = 'dd '+val.join(',')
    }
    if(line.split(' ')[0]=='dq'){
        let val = line.replace('dq','').trim().split(',').map(v=>v.trim()).map(v=>{
            if(v.indexOf('RVA')>-1){
                let vn = v.replace('RVA ','').trim()
                console.log('vn',vn)
                if(CALLS[vn]){
                    return 'RVA '+CALLS[vn]
                }else{
                    return 'RVA '+vn
                }
            }
            return v
        })
        OFFSET+=val.length*8
        line = 'dq '+val.join(',')
    }
    if(line.split(' ')[0]=='dw'){
        let val = line.replace('dw','').trim().split(',').map(v=>v.trim())
        OFFSET+=val.length*2
    }
    if(line.split(' ')[0]=='db'){
        let val = line.replace('db','').trim().split('\'')[1]
        OFFSET+=val.length+1
    }
    line=line.replace(/([a-zA-Z0-9\_]+)\:/gm,match=>{
        let name = match.split(':')[0].trim()
        CALLS[name] = OFFSET
        return ''
    })
    return line
})
}
parse()
console.log('CALLS',CALLS)
parse()



lines = lines.map(line=>{
    let type = line.split(' ')[0]
    let val = line.replace(type,'').trim().split(',')
    if(type=='dd'){
        val=val.map(v=>{
            if(v.indexOf('RVA')>-1){
                v = v.replace('RVA','').trim()
                v = LE(DectoHex4(v))
            }else{
                v = DectoHex4(v)
            }
            return v
        })
        return val.join(' ')
    }
    if(type=='dq'){
        val=val.map(v=>{
            if(v.indexOf('RVA')>-1){
                v = v.replace('RVA','').trim()
                v = LE(DectoHex8(v))
            }else{
                v = DectoHex8(v)
            }
            return v
        })
        return val.join(' ')
    }
    if(type=='dw'){
        val=val.map(v=>{
            return DectoHex2(v)
        })
        return val.join(' ')
    }
    if(type=='db'){
        val=val[0].split('\'')[1]
        let ret = ''
        for(let i=0;i<val.length;i++){
            let code = val.charCodeAt(i)
            ret += DectoHex1(code)
        }
        return ret+'00'
    }
    return line
})



code = lines.join('\n')

return code

}

module.exports = make