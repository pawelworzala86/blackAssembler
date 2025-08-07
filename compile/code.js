const fs = require('fs');
const make = require('./compiler.js')

const CALLS = {}

let idata = `  dd 0,0,0,RVA kernel_name,RVA kernel_table
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

idata = make(idata, CALLS)

fs.writeFileSync('./cache/idata.txt',idata)






//let data = `4f4b00`
let data = `message:
db 'OK',0`

//CALLS['message'] = 0xff0+1
let offset = 0xff0+1

data = make(data, CALLS, offset)

fs.writeFileSync('./cache/data.txt',data)






const oldCompile = require('./compiler.old.js')

/*let text = `48 83 EC 28                         ; sub rsp, 0x28
48 8D 0D F5 0F 00 00                ; lea rcx, [rip + 0xff5]     ; adres względny
FF 15 3B 20 00 00                   ; call QWORD PTR [rip + 0x203b]
48 C7 C1 00 00 00 00                ; mov rcx, 0x0
FF 15 1E 20 00 00                   ; call QWORD PTR [rip + 0x201e]`*/

let text = `sub rsp, 0x28
lea rcx, message  ;0x00000ff5
call printf
mov rcx, 0x00000000
call ExitProcess`

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
text = oldCompile(text, CALLS)

fs.writeFileSync('./cache/text.txt',text)


module.exports = function(){
  return {text,data,idata}
}