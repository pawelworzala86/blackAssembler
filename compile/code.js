const fs = require('fs');
const make = require('./compiler.js')
const prepare = require('./prepare.js')
const parseIData = require('./idata.js')



const CALLS = {}
const iCALLS = {}
const tCALLS = {}

const fileName = process.argv[2]

let code = fs.readFileSync('./source/'+fileName+'.asm').toString()
code = prepare(code)

const source = {
  text: '',
  data: '',
  idata: '',
}
let active = ''
code.split('\n').map(line=>{
  line=line.trim()
  if(!line.length){
    return
  }
  if(line=='.code'){
    active = 'text'
  }else if(line=='.data'){
    active = 'data'
  }else if(line=='.import'){
    active = 'idata'
  }else{
    source[active]+=line+'\n'
  }
})
console.log(source)



let idata = prepare(parseIData(source.idata))

/*`  dd 0,0,0,RVA kernel_name,RVA kernel_table
  dd 0,0,0,RVA msvcrt_name,RVA msvcrt_table
  dd 0,0,0,0,0

  kernel_table:
    ExitProcess:
     dq RVA _ExitProcess
    dq 0
  msvcrt_table:
    printf:
     dq RVA _printf
    dq 0

  kernel_name:
   db 'KERNEL32.DLL',0
  msvcrt_name:
   db 'MSVCRT.DLL',0

  _ExitProcess:
   dw 0
    db 'ExitProcess',0
  _printf:
   dw 0
    db 'printf',0`
*/
let offset = 0x3000//-(12364-8251))+11
idata = make(idata, iCALLS, offset, {iCALLS,CALLS,tCALLS})

fs.writeFileSync('./cache/idata.txt',idata)






//let data = `4f4b00`
let data = source.data/*`message:
db 'OK',0
messageB:
db 'ok',0`*/

//CALLS['message'] = 0xff0+1
offset = (1024*4)-7//0xff0//+1

data = make(data, CALLS, offset, {iCALLS,CALLS,tCALLS})

fs.writeFileSync('./cache/data.txt',data)






//const oldCompile = require('./compiler.old.js')

/*let text = `48 83 EC 28                         ; sub rsp, 0x28
48 8D 0D F5 0F 00 00                ; lea rcx, [rip + 0xff5]     ; adres względny
FF 15 3B 20 00 00                   ; call QWORD PTR [rip + 0x203b]
48 C7 C1 00 00 00 00                ; mov rcx, 0x0
FF 15 1E 20 00 00                   ; call QWORD PTR [rip + 0x201e]`*/

let text = source.text/*`sub rsp, 0x28
lea rcx, messageB  ;0x00000ff5
call printf
mov rcx, 0x00000000
call ExitProcess`*/

/*function DectoHex4(dec){
    let val = parseInt(dec)
    val = val.toString(16)
    val = val.padStart(8,'00')
    return val
}
function LE(text){
    let bytes = text.match(/.{2}/g);
    return bytes.reverse().join(' ');
}
console.log('printf',LE(DectoHex4(CALLS['printf']-(12364-8251))))
console.log('ExitProcess',LE(DectoHex4(CALLS['ExitProcess']-(12364-8251))))
*/
offset = 0
text = make(text, tCALLS, offset, {iCALLS,CALLS,tCALLS})
//text = oldCompile(text, CALLS, iCALLS)

fs.writeFileSync('./cache/text.txt',text)


module.exports = function(){
  return {text,data,idata}
}