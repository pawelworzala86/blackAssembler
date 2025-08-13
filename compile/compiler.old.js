const fs = require('fs')

const conv = require('./convert.js')
//const reg = require('./registers.js')










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
    { mnemonic: "mov r32, imm32", opcode: "B8 + rd" },
    { mnemonic: "mov r64, imm32", opcode: "B8 + rd" },
    { mnemonic: "mov r/m32, r32", opcode: "89 /r" },
    { mnemonic: "mov r/m64, r64", opcode: "48 89 /r" },
    { mnemonic: "mov r/m64, imm32", opcode: "48 C7 /r id" },
    { mnemonic: "mov r/m64, imm64", opcode: "48 C7 /r id" },

    { mnemonic: "add r/m8, imm8", opcode: "80 /0 ib" },
    { mnemonic: "add r/m32, imm32", opcode: "81 /0 id" },
    { mnemonic: "add r/m64, imm32", opcode: "48 81 /0 id" },
    { mnemonic: "add r/m64, imm8", opcode: "48 83 /0 id" },

    { mnemonic: "sub r/m8, imm8", opcode: "80 /5 ib" },
    { mnemonic: "sub r/m32, imm32", opcode: "81 /5 id" },
    { mnemonic: "sub r/m64, imm32", opcode: "48 81 /5 id" },
    { mnemonic: "sub r/m64, imm8", opcode: "48 83 /5 id" },

    { mnemonic: "mul r/m8", opcode: "F6 /4" },
    { mnemonic: "mul r/m32", opcode: "F7 /4" },
    { mnemonic: "mul r/m64", opcode: "48 F7 /4" },
    { mnemonic: "div r/m8", opcode: "F6 /6" },
    { mnemonic: "div r/m32", opcode: "F7 /6" },
    { mnemonic: "div r/m64", opcode: "48 F7 /6" },
    { mnemonic: "and r/m8, imm8", opcode: "80 /4 ib" },
    { mnemonic: "and r/m32, imm32", opcode: "81 /4 id" },
    { mnemonic: "and r/m64, imm32", opcode: "48 81 /4 id" },
    { mnemonic: "or r/m8, imm8", opcode: "80 /1 ib" },
    { mnemonic: "or r/m32, imm32", opcode: "81 /1 id" },
    { mnemonic: "or r/m64, imm32", opcode: "48 81 /1 id" },
    { mnemonic: "xor r/m8, imm8", opcode: "80 /6 ib" },
    { mnemonic: "xor r/m32, imm32", opcode: "81 /6 id" },
    { mnemonic: "xor r/m64, imm32", opcode: "48 81 /6 id" },
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











function DectoHex4(dec){
    let val = parseInt(dec)
    val = val.toString(16)
    val = val.padStart(8,'00')
    return val
}
function LE(text){
    let bytes = text.match(/.{2}/g);
    return bytes.reverse().join(' ');
}



const FUNCTIONS = {}

module.exports = function(CODE, CALLS){
    
    /*function getDataOffset(name){
        return DATA.getDataOffset(name)
    }
*/
    function MakeHex(result){
        result=result.replace(/\ /gm,'')
        let res = ''
        for(let i=0;i<result.length;i+=2){
            res += result[i]+result[i+1]+' '
        }
        result = res.trim()
        return result
    }



let OFFSET = 0

function ParseLine(line){
    let [call,target,from] = line.split(' ').map(p=>p.replace(',',''))

    let instr = call+' '
    let rightReg = false

    //console.log(REGS)

    if(call=='hex'){
        return MakeHex(line.replace('hex',''))
    }
  
    if(REGS.includes(target)){
        instr += 'r/m64' + ', '
        if((from.indexOf('0x')>-1)&&(from.length<=4)){
            instr += 'imm8'
        }else if(from.length==10){
            instr += 'imm64'
        }else if(parseInt(from)){
            instr += 'imm32'
        }else{
            instr += 'r64'
            rightReg = true
        }
    }else{
        instr += 'imm8' + ''
    }

    //console.log(instr)

    let result = ''

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
        result = parts.join(' ')
    }

    

    if(call=='lea'){
        //'lea rcx, [rip+0xf5]',//   ; offset to "start" string
        //488d0df50f0000      ; 48 8D 0D F5 0F 00 00
        //'lea rcx, [rip+0xde]',//   ; offset to "%i" string
        //488d0dde0f0000      ; 48 8D 0D DE 0F 00 00
        let lea = '8d'
        let bytemode = '0d' //rcx
        result = '48 '+lea+' '+bytemode
        bytemode = {
            'rax':'0a',
            'rcx':'0d',
            //'rsi':'fde0f',
        }[target]

        //console.log('from',from)
        //process.exit(1)
        if(from.indexOf('0x')>-1){
            from = LE(from.replace('0x',''))
        }else{
            console.log('OFFSET DATA',OFFSET)
            //let offset = (CALLS[from]+(1024*4))-(OFFSET+7)
            let offset = CALLS[from]-OFFSET
            console.log(from,offset,DectoHex4(offset))
            from = LE(DectoHex4(offset))
        }

        /*let addr = getDataOffset(from)//line.split('0x')[1].split(']')[0].trim()
        //console.log('addr',addr)
        let off = addHex('000f0000', littleEndian.fromHex(addr-OFFSET))//0a - 1
        //let offLE = littleEndian.fromHex(parseInt(off,16))
        off=off.hex
        off = off[0]+off[1]+' '+off[2]+off[3]+' '+off[4]+off[5]+' '+off[6]+off[7]
        ////console.log('off',off, offLE)*/
        result+=' '+from
    }
    if(call=='call'){
        let parts = line.split(' ')
        let func = parts[1]
        
        let start = 'ff'
        //let modrm = '14'
        let modrm = '15'

        console.log('OFFSET',OFFSET)
        //console.log('CALLS',CALLS[func]-OFFSET)
        console.log('CALLS',CALLS[func]-((12364-8251-11)+OFFSET))
        const off = LE(DectoHex4(CALLS[func]-((12364-8251-11)+OFFSET)))
        //const off = LE(DectoHex4(CALLS[func]-OFFSET))
        //8251
        //8238
        //8225
        //8196 - ExitP...

        //off=func.replace('0x','')
        //off = off[6]+off[7]+' '+off[4]+off[5]+' '+off[2]+off[3]+' '+off[0]+off[1]
        result=start+' '+modrm/*+' 25 '*/+off
    }
    if((call=='jmp')&&(target=='short')){
        let parts = line.split(' ')
        let func = parts[2]

        let num = FUNCTIONS[func]-(OFFSET+2)
        //console.log('num',num)
        //console.log('...',FUNCTIONS[func],OFFSET)

        let bytes = ''

        if(num>=0){
            let off = addHex('00000000', littleEndian.fromHex(num))

            off=off.hex.padStart(8, '0');
            off = off[0]+off[1]
            //console.log('off',off)
            bytes = off
        }else{
            let num = FUNCTIONS[func]-(OFFSET+6)
            let off = toHexMinus(num+1)
            off = off[6]+off[7]
            //console.log('off OFF',off)
            bytes = off
        }

        result = 'eb '+bytes
    }else if(call=='jmp'){
        let parts = line.split(' ')
        let func = parts[1]
        //let off = toHexMinus2(num+1)
        let num = CONSTS[func]//FUNCTIONS[func]-(OFFSET+5)
        //console.log('num',num)
        //console.log('...',FUNCTIONS[func],OFFSET)

        let bytes = ''

        if(num>=0){
            let off = addHex('00000000', littleEndian.fromHex(num))
            //console.log('off',off)
            off=off.hex.padStart(8, '0');
            off = off[0]+off[1]+' '+off[2]+off[3]+' '+off[4]+off[5]+' '+off[6]+off[7]
            //console.log('off',off)
            bytes = off
        }else{
            //let num = FUNCTIONS[func]-(OFFSET+6)
            let off = toHexMinus(num+1)
            off = off[6]+off[7]+' '+off[4]+off[5]+' '+off[2]+off[3]+' '+off[0]+off[1]
            //console.log('off OFF',off)
            bytes = off
        }

        result = 'e9 '+bytes
    }
    if(call=='dq'){
        result = '25 69 00'
    }
    if(call=='xor'){
        //'xor rcx, rcx',//
        //4831c9              ; 48 31 C9
        result = '48 31 c9'
    }
    if(call=='ret'){
        result = 'c3'
    }

    function getHEXfromText(text){
        let hex = text
        hex = hex.replace('0x','')
        return hex
    }

    if((call=='mov')&&(REGS_RD.includes(target))){
        
        cod = '0100'+   '0'+regOptCodeX64RD[target.replace(/r|d|/gm,'')]
        //console.log('COD',cod)
        cod = conv.binaryToHex(cod)
        //console.log('COD',cod)

        let action = 'b'+ cod

        address = getHEXfromText(from)

        result = '41 '+action+' '+address

       // console.log('result',result)

        //process.exit(1);
    }else if((call=='mov')&&(REGS_D.includes(target))){

        cod = '1011'+   '1'+regOptCodeX32D[target]
        //console.log('COD',cod)
        cod = conv.binaryToHex(cod)
        //console.log('COD',cod)

        //let action = cod

        address = getHEXfromText(from)

        result = cod+' '+address

        //console.log('result',result)

        //process.exit(1);
    }

    result=MakeHex(result)

    if(call[call.length-1]==':'){
        FUNCTIONS[call.substring(0,call.length-1)] = OFFSET
        return ''
    }else{
        let parts = result.split(' ')
        OFFSET += parts.length
    }
    return result
}





    let code = CODE.split('\n')//buff.text

    for(let i=0;i<code.length;i++){
        ParseLine(code[i])
        //code[i] = ParseDATA(code[i])
    }
    OFFSET = 0
    let compiled = []
    for(let i=0;i<code.length;i++){
        const line = ParseLine(code[i])
        //if(line.length){
            compiled.push(line)
        //}else{
            
        //}
        console.log('LINE: ',line.replace(/\ /gm,''), ' : ', code[i],)
    }


    compiled=compiled.map(line=>{
        return line.toLowerCase()
    })


    //process.exit(1)




    compiled=compiled.join(' ')
    let shortCode = compiled

    //let virtualSize=compiled.length/2

    let sizeOfRawData = 512
    for(let i=compiled.length;i<sizeOfRawData*2;i++){
        compiled+='0'
    }
    //let buffer = Buffer.from(compiled, 'hex');

    return shortCode
}