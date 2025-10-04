const {getXorInstruction} = require('./instructions/xor.js')
const {getMovInstruction} = require('./instructions/mov.js')
const {getLeaInstruction} = require('./instructions/lea.js')

const {getAddInstruction} = require('./instructions/add.js')
const {getSubInstruction} = require('./instructions/sub.js')
const {getMulInstruction} = require('./instructions/mul.js')
const {getDivInstruction} = require('./instructions/div.js')

const {getAndInstruction} = require('./instructions/and.js')
const {getOrInstruction} = require('./instructions/and.js')

const {getCallInstruction} = require('./instructions/call.js')
const {getJmpInstruction} = require('./instructions/jmp.js')


const instructions = {
    'xor': getXorInstruction,
    'mov': getMovInstruction,
    'lea': getLeaInstruction,
    'add': getAddInstruction,
    'sub': getSubInstruction,
    'mul': getMulInstruction,
    'div': getDivInstruction,
    'and': getAndInstruction,
    'or': getOrInstruction,
    'call': getCallInstruction,
    //'jmp': getJmpInstruction,
}






//let OFFSET = 0x3000


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






function make(code,CALLS,OFFSET=0x3000, ADDR){

    let offset = OFFSET


    function getAddr(from){
        if(ADDR.CALLS[from]){
            return ADDR.CALLS[from]-OFFSET
        }else{
            return ADDR.iCALLS[from]-((12364-8251-11)+OFFSET)
        }
    }

    function getParams(name, line){
        let params = line.replace(name+' ','')
        params = params.split(',').map(p=>p.trim()).map(param=>{
            //if(param&&(param.indexOf('0x')==-1)&&/^[a-zA-Z0-9\_]+$/gm.exec(param)&&!REGS.includes(param)){
            if(param[0]=='['){
                let addr = getAddr(param.substring(1,param.length-1))
                //console.log('param',param,addr)
                param = '0x'+DectoHex4(addr)
            }
            return param
        })
        return params
    }


function pLine(line){

    if(line.trim().length==0){
        return line
    }

    console.log('line', line)

    const instr = line.split(' ')[0]

    /*if(['db','dd','dq','rd','rq'].includes(instr)){
        return line
    }else if(!instructions.hasOwnProperty(instr)){
        console.log('UNKNOW INSTRUCTION: ', instr)
        process.exit(0)
    }else */
    if(instructions[instr]){
        const params = getParams(instr, line)

        line = instructions[instr](params,CALLS,OFFSET)

        OFFSET+=line.split(' ').length
        return line
    }
    
    /*if(line.split(' ')[0]=='lea'){
        const params = getParams('lea', line)
        //console.log('LEA', params)

        line = getLeaInstruction(params)

        OFFSET+=line.split(' ').length
        return line
    }else if(line.split(' ')[0]=='mov'){
        console.log('line', line)
        const params = getParams('mov', line)
        
        line = getMovInstruction(params)

        OFFSET+=line.split(' ').length
        return line
    }else if(line.split(' ')[0]=='xor'){
        console.log('line', line)
        const params = getParams('xor', line)
        
        line = getXorInstruction(params)

        OFFSET+=line.split(' ').length
        return line
    }else */
    /*if(line.split(' ')[0]=='call'){
        const params = getParams('call', line)
        //console.log('CALL', params)

        line = getCallInstruction(params)

        OFFSET+=line.split(' ').length
        return line
    }else */
    if(line.split(' ')[0]=='jmp'){
        let parts = line.split(' ')

        line = getJmpInstruction(parts,CALLS,OFFSET)

        OFFSET+=line.split(' ').length
        return line
    }else if(line.split(' ')[0]=='ret'){
        OFFSET+=1
        return 'C3'
    }
    return ''
}





let lines = code.split('\n')
function parse(){
    OFFSET=offset
lines = lines.map(line=>{
    line=line.replace(/\;.*/gm,'')
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
        return line
    }
    if(line.split(' ')[0]=='db'){
        let val = line.replace('db','').trim().split('\'')[1]
        OFFSET+=val.length+1
        return line
    }
    line=line.replace(/([\.a-zA-Z0-9\_]+)\:/gm,match=>{
        let name = match.split(':')[0].trim()
        CALLS[name] = OFFSET
        return ''
    })


    const result = pLine(line)
    //if(result&&result.length){
    //    return result
    //}

    return line
})
}
parse()
console.log('CALLS',CALLS)
parse()

OFFSET=offset

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


    console.log('line', line)
    const result = pLine(line)
    console.log('result', result)
    if(result&&result.length){
        return result
    }
    
    return line
})



code = lines.join('\n')

return code

}

module.exports = make