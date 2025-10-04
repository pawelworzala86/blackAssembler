const conv = require('./convert.js')

const {getXorInstruction} = require('./instructions/xor.js')
const {getMovInstruction} = require('./instructions/mov.js')
const {getLeaInstruction} = require('./instructions/lea.js')

const {getAddInstruction} = require('./instructions/add.js')
const {getSubInstruction} = require('./instructions/sub.js')
const {getMulInstruction} = require('./instructions/mul.js')
const {getDivInstruction} = require('./instructions/div.js')

const {getAndInstruction} = require('./instructions/and.js')
const {getOrInstruction} = require('./instructions/and.js')




//48
const regOptCodeX64 = {
    'rax': '000',//	Rejestr eax (32-bit) lub rax (64-bit)
    'rcx': '001',//	Rejestr ecx (32-bit) lub rcx (64-bit)
    'rdx': '010',//	Rejestr edx (32-bit) lub rdx (64-bit)
    'rbx': '011',//	Rejestr ebx (32-bit) lub rbx (64-bit)
    'rsp': '100',//	Rejestr esp (32-bit) lub rsp (64-bit)
    'rbp': '101',//	Rejestr ebp (32-bit) lub rbp (64-bit)
    'rsi': '110',//	Rejestr esi (32-bit) lub rsi (64-bit)
    'rdi': '111',//	Rejestr edi (32-bit) lub rdi (64-bit)
}
let REGS = Object.keys(regOptCodeX64)
let REGS_S = Object.keys(regOptCodeX64)

//49
const regOptCodeX64R = {
    'r8': '000',//	Rejestr eax (32-bit) lub rax (64-bit)
    'r9': '001',//	Rejestr ecx (32-bit) lub rcx (64-bit)
    'r10': '010',//	Rejestr edx (32-bit) lub rdx (64-bit)
    'r11': '011',//	Rejestr ebx (32-bit) lub rbx (64-bit)
    'r12': '100',//	Rejestr esp (32-bit) lub rsp (64-bit)
    'r13': '101',//	Rejestr ebp (32-bit) lub rbp (64-bit)
    'r14': '110',//	Rejestr esi (32-bit) lub rsi (64-bit)
    'r15': '111',//	Rejestr edi (32-bit) lub rdi (64-bit)
}
REGS.push(...Object.keys(regOptCodeX64R))
let REGS_SR = Object.keys(regOptCodeX64R)

const regOptCodeX32D = {
    'eax': '000',//	Rejestr eax (32-bit) lub rax (64-bit)
    'ecx': '001',//	Rejestr ecx (32-bit) lub rcx (64-bit)
    'edx': '010',//	Rejestr edx (32-bit) lub rdx (64-bit)
    'ebx': '011',//	Rejestr ebx (32-bit) lub rbx (64-bit)
    'esp': '100',//	Rejestr esp (32-bit) lub rsp (64-bit)
    'ebp': '101',//	Rejestr ebp (32-bit) lub rbp (64-bit)
    'esi': '110',//	Rejestr esi (32-bit) lub rsi (64-bit)
    'edi': '111',//	Rejestr edi (32-bit) lub rdi (64-bit)
}
REGS.push(...Object.keys(regOptCodeX32D))
let REGS_D = Object.keys(regOptCodeX32D)

const regOptCodeX64RD = {
    'r8d': '000',//	Rejestr eax (32-bit) lub rax (64-bit)
    'r9d': '001',//	Rejestr ecx (32-bit) lub rcx (64-bit)
    'r10d': '010',//	Rejestr edx (32-bit) lub rdx (64-bit)
    'r11d': '011',//	Rejestr ebx (32-bit) lub rbx (64-bit)
    'r12d': '100',//	Rejestr esp (32-bit) lub rsp (64-bit)
    'r13d': '101',//	Rejestr ebp (32-bit) lub rbp (64-bit)
    'r14d': '110',//	Rejestr esi (32-bit) lub rsi (64-bit)
    'r15d': '111',//	Rejestr edi (32-bit) lub rdi (64-bit)
}
REGS.push(...Object.keys(regOptCodeX64RD))
let REGS_RD = Object.keys(regOptCodeX64RD)




const instructions = [
    /*{ mnemonic: "mov r32, imm32", opcode: "B8 + rd" },
    { mnemonic: "mov r64, imm32", opcode: "B8 + rd" },
    { mnemonic: "mov r/m32, r32", opcode: "89 /r" },
    { mnemonic: "mov r/m64, r64", opcode: "48 89 /r" },
    { mnemonic: "mov r/m64, imm32", opcode: "48 C7 /r id" },
    { mnemonic: "mov r/m64, imm64", opcode: "48 C7 /r id" },*/

    /*{ mnemonic: "add r/m8, imm8", opcode: "80 /0 ib" },
    { mnemonic: "add r/m32, imm32", opcode: "81 /0 id" },
    { mnemonic: "add r/m64, imm32", opcode: "48 81 /0 id" },
    { mnemonic: "add r/m64, imm8", opcode: "48 83 /0 id" },*/

    /*{ mnemonic: "sub r/m8, imm8", opcode: "80 /5 ib" },
    { mnemonic: "sub r/m32, imm32", opcode: "81 /5 id" },
    { mnemonic: "sub r/m64, imm32", opcode: "48 81 /5 id" },
    { mnemonic: "sub r/m64, imm8", opcode: "48 83 /5 id" },*/

    /*{ mnemonic: "mul r/m8", opcode: "F6 /4" },
    { mnemonic: "mul r/m32", opcode: "F7 /4" },
    { mnemonic: "mul r/m64", opcode: "48 F7 /4" },*/

    /*{ mnemonic: "div r/m8", opcode: "F6 /6" },
    { mnemonic: "div r/m32", opcode: "F7 /6" },
    { mnemonic: "div r/m64", opcode: "48 F7 /6" },*/

    /*{ mnemonic: "and r/m8, imm8", opcode: "80 /4 ib" },
    { mnemonic: "and r/m32, imm32", opcode: "81 /4 id" },
    { mnemonic: "and r/m64, imm32", opcode: "48 81 /4 id" },*/

    /*{ mnemonic: "or r/m8, imm8", opcode: "80 /1 ib" },
    { mnemonic: "or r/m32, imm32", opcode: "81 /1 id" },
    { mnemonic: "or r/m64, imm32", opcode: "48 81 /1 id" },*/

    /*{ mnemonic: "xor r/m8, imm8", opcode: "80 /6 ib" },
    { mnemonic: "xor r/m32, imm32", opcode: "81 /6 id" },
    { mnemonic: "xor r/m64, imm32", opcode: "48 81 /6 id" },*/

    { mnemonic: "cmp r/m8, imm8", opcode: "80 /7 ib" },
    { mnemonic: "cmp r/m32, imm32", opcode: "81 /7 id" },
    { mnemonic: "cmp r/m64, imm32", opcode: "48 81 /7 id" },

    { mnemonic: "jmp rel8", opcode: "EB cb" },
    { mnemonic: "jmp rel32", opcode: "E9 cd" },
    { mnemonic: "jmp imm8", opcode: "EB id" },

    { mnemonic: "call rel32", opcode: "E8 cd" },
    { mnemonic: "call r/m64", opcode: "FF /2" },

    { mnemonic: "ret", opcode: "C3" },
    { mnemonic: "ret imm16", opcode: "C2 iw" },
];

const mnemonics = ['mov','add','sub','mul','div','and','or','xor','cmp','jmp','call','ret']

function getInstruction(code){
    for(const instruction of instructions){
        if(instruction.mnemonic==code){
            return instruction.opcode
        }
    }
    return null
}




function getOptCode(opt,reg='rax'){
    let registerMode = conv.intToBinary3Bits(3,2)//3=11
    let cd = conv.intToBinary3Bits(opt,3)
    let optCode = regOptCodeX64[reg]
    return registerMode+cd+optCode
}
function getOptCodeRegReg(target,from){
    let registerMode = conv.intToBinary3Bits(3,2)//3=11
    let cd = regOptCodeX64[target]
    let optCode = regOptCodeX64[from]
    return registerMode+optCode+cd
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

    console.log('line', line)
    
    if(line.split(' ')[0]=='lea'){
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
    }else if(line.split(' ')[0]=='call'){
        const params = getParams('call', line)
        //console.log('CALL', params)

        let start = 'ff'
        //let modrm = '14'
        let modrm = '15'

        //console.log('OFFSET',OFFSET)
        const off = LE(params[0].replace('0x',''))

        line = start+' '+modrm+' '+off
        OFFSET+=6
        return line
    }else if(line.split(' ')[0]=='jmp'){
        let parts = line.split(' ')
        let func = parts[1]
        //let off = toHexMinus2(num+1)
        //console.log('CALLS',CALLS)
        let num = CALLS[func]-(OFFSET+5)//FUNCTIONS[func]-(OFFSET+5)
        //console.log('num',num, func)
        //console.log('...',FUNCTIONS[func],OFFSET)

        let bytes = ''

        if(num>=0){
            let off = conv.addHex('00000000', conv.littleEndian.fromHex(num))
            //console.log('off',off)
            off=off.hex.padStart(8, '0');
            off = off[0]+off[1]+' '+off[2]+off[3]+' '+off[4]+off[5]+' '+off[6]+off[7]
            //console.log('off',off)
            bytes = off
        }else{
            //let num = FUNCTIONS[func]-(OFFSET+6)
            let off = conv.toHexMinus(num+1)
            off = off[6]+off[7]+' '+off[4]+off[5]+' '+off[2]+off[3]+' '+off[0]+off[1]
            //console.log('off OFF',off)
            bytes = off
        }

        result = 'e9 '+bytes
        OFFSET += 5
        return result
    }else{

        let name = line.split(' ')[0]

        if(mnemonics.includes(name)){

            const params = getParams(name, line)
            const mnem = params.map((param,idx)=>{
                if(REGS.includes(param)&&(idx==1)){
                    return 'imm32'
                }else if(REGS.includes(param)){
                    return 'r/m64'
                }else if((param.indexOf('0x')>-1)&&(param.length<=4)){
                    return 'imm8'
                }else if(param.length==10){
                    return 'imm64'
                }else if(parseInt(param)){
                    return 'imm32'
                }else{
                    return 'r64'
                }
            })
            const instr = name+' '+mnem.join(', ')
            console.log('INSTR', instr)
            let rightReg = REGS.includes(params[1])
            let target = params[0]
            let from = params[1]

            let instruction = getInstruction(instr)
            if(instruction){
                let parts = instruction.split(' ')
                parts = parts.map(part=>{
                    if((part[0]=='/')&&((parseInt(part[1]))||(part[1]==0))){
                        //console.log('AAA',part[1], target)
                        let cod = getOptCode(parseInt(part[1]), target)
                        cod = conv.binaryToHex(cod)
                        part = cod
                    }else if((part=='id')&&(instr.indexOf('imm8')>-1)){
                        let imm8 = from
                        if(!imm8){
                            imm8 = target
                        }
                        part = imm8.replace('0x','')
                        if(part.length==1){
                            part='0'+part
                        }
                    }else if(part=='id'){
                        part = conv.intToHex32LE(from)
                    }else if(part=='/r'){
                        if(rightReg){
                            cod = getOptCodeRegReg(target,from)
                            //console.log('COD',cod)
                            cod = conv.binaryToHex(cod)
                            part = cod
                        }else{
                            cod = '11000'+regOptCodeX64[target]
                            //console.log('COD',cod)
                            cod = conv.binaryToHex(cod)
                            part = cod
                        }
                    }
                    return part
                })
                OFFSET+=parts.length
                return parts.join(' ')
            }

            return ''
        }
    }
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